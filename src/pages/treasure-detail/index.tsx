import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import Tag from '@/components/Tag';
import {
  formatDistance,
  formatWalkTime,
  formatBudget,
  getCategoryLabel,
} from '@/utils';
import styles from './index.module.scss';

const TreasureDetailPage: React.FC = () => {
  const router = useRouter();
  const { treasures, favoriteIds, addToFavorites, removeFromFavorites, addToCurrentRoute } =
    useAppStore();

  const treasureId = router.params.id;

  useDidShow(() => {
    console.log('[TreasureDetailPage] 页面显示, id:', treasureId);
  });

  const treasure = useMemo(() => {
    return treasures.find((t) => t.id === treasureId);
  }, [treasures, treasureId]);

  const isFavorited = useMemo(() => {
    return favoriteIds.includes(treasureId || '');
  }, [favoriteIds, treasureId]);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleShare = () => {
    console.log('[TreasureDetailPage] 分享');
    Taro.showToast({ title: '分享功能开发中', icon: 'none' });
  };

  const handleFavorite = () => {
    if (!treasure) return;
    if (isFavorited) {
      removeFromFavorites(treasure.id);
      Taro.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      addToFavorites(treasure.id);
      Taro.showToast({ title: '已收藏', icon: 'success' });
    }
  };

  const handleAddToRoute = () => {
    if (!treasure) return;
    addToCurrentRoute(treasure.id);
    Taro.showToast({ title: '已加入路线', icon: 'success' });
    console.log('[TreasureDetailPage] 加入路线:', treasure.id);
  };

  const handleCheckin = () => {
    setShowCheckin(true);
    Taro.showActionSheet({
      itemList: ['拍照打卡', '从相册选择'],
      success: (res) => {
        console.log('[TreasureDetailPage] 打卡选择:', res.tapIndex);
        Taro.showToast({ title: '打卡功能开发中', icon: 'none' });
      },
    });
  };

  if (!treasure) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx', textAlign: 'center', color: '#B2BEC3' }}>
          宝藏不存在
        </View>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.banner}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text className={styles.backIcon}>←</Text>
        </View>
        <View className={styles.shareBtn} onClick={handleShare}>
          <Text className={styles.shareIcon}>📤</Text>
        </View>
        <Image className={styles.bannerImage} src={treasure.image} mode="aspectFill" />
        <View className={styles.categoryTag}>
          <Text className={styles.categoryText}>{getCategoryLabel(treasure.category)}</Text>
        </View>
      </View>

      <View className={styles.content}>
        <Text className={styles.title}>{treasure.name}</Text>

        <View className={styles.address}>
          <Text className={styles.addressIcon}>📍</Text>
          <Text>{treasure.address}</Text>
        </View>

        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoValue}>{formatDistance(treasure.distance)}</Text>
            <Text className={styles.infoLabel}>距离</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoValue}>{formatWalkTime(treasure.walkTime)}</Text>
            <Text className={styles.infoLabel}>步行</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoValue}>{formatBudget(treasure.budget)}</Text>
            <Text className={styles.infoLabel}>预算</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoValue}>⭐ {treasure.rating}</Text>
            <Text className={styles.infoLabel}>评分</Text>
          </View>
        </View>

        <View className={styles.tagRow}>
          {treasure.isRainy && <Tag text="🌧️ 雨天可去" type="rain" size="medium" />}
          {treasure.isFamilyFriendly && (
            <Tag text="👨‍👩‍👧 亲子友好" type="family" size="medium" />
          )}
          {treasure.budget === 0 && <Tag text="🆓 免费" type="free" size="medium" />}
          {treasure.isNew && <Tag text="✨ 新上榜" type="new" size="medium" />}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📝</Text>
            宝藏介绍
          </Text>
          <Text className={styles.descText}>{treasure.description}</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>✨</Text>
            亮点推荐
          </Text>
          <View className={styles.highlightsList}>
            {treasure.highlights.map((highlight, index) => (
              <View key={index} className={styles.highlightItem}>
                <Text className={styles.highlightIcon}>⭐</Text>
                <Text className={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🕐</Text>
            开放时间
          </Text>
          <View className={styles.highlightItem}>
            <Text className={styles.highlightIcon}>🕒</Text>
            <Text className={styles.highlightText}>{treasure.openTime}</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>⚠️</Text>
            避坑提示
          </Text>
          <View className={styles.tipsList}>
            {treasure.tips.map((tip, index) => (
              <View key={index} className={styles.tipItem}>
                <Text className={styles.tipIcon}>💡</Text>
                <Text className={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📸</Text>
            拍照好位置
          </Text>
          <View className={styles.photoSpots}>
            {treasure.photoSpots.map((spot, index) => (
              <Text key={index} className={styles.photoSpotTag}>
                📷 {spot}
              </Text>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🏪</Text>
            附近补给
          </Text>
          <View className={styles.supplyList}>
            {treasure.nearbySupply.map((supply, index) => (
              <View key={index} className={styles.supplyItem}>
                <Text className={styles.supplyIcon}>📍</Text>
                <Text className={styles.supplyText}>{supply}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: '40rpx' }}></View>
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.actionBtn, styles.btnFavorite, isFavorited && styles.favorited)}
          onClick={handleFavorite}
        >
          <Text className={styles.btnIcon}>{isFavorited ? '❤️' : '🤍'}</Text>
          <Text>{isFavorited ? '已收藏' : '收藏'}</Text>
        </View>
        <View className={classnames(styles.actionBtn, styles.btnAddRoute)} onClick={handleAddToRoute}>
          <Text className={styles.btnIcon}>➕</Text>
          <Text>加入路线</Text>
        </View>
        <View className={classnames(styles.actionBtn, styles.btnPrimary)} onClick={handleCheckin}>
          <Text className={styles.btnIcon}>📷</Text>
          <Text>打卡</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default TreasureDetailPage;
