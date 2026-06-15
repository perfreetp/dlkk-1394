import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import TreasureCard from '@/components/TreasureCard';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const { treasures, favoriteIds, checkins, addToFavorites, removeFromFavorites } = useAppStore();

  useDidShow(() => {
    console.log('[MinePage] 页面显示');
  });

  const favoriteTreasures = treasures.filter((t) => favoriteIds.includes(t.id));

  const handleFavorite = (id: string) => {
    if (favoriteIds.includes(id)) {
      removeFromFavorites(id);
      Taro.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      addToFavorites(id);
      Taro.showToast({ title: '已收藏', icon: 'success' });
    }
  };

  const handleMenuClick = (menuKey: string) => {
    console.log('[MinePage] 点击菜单:', menuKey);
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  const handleShare = () => {
    console.log('[MinePage] 分享');
    Taro.showToast({ title: '分享功能开发中', icon: 'none' });
  };

  const menuItems = [
    { key: 'new', icon: '✨', label: '本周新上榜', badge: '5个' },
    { key: 'feedback', icon: '💬', label: '用户反馈/纠错' },
    { key: 'share', icon: '📤', label: '分享给朋友' },
    { key: 'about', icon: 'ℹ️', label: '关于我们' },
    { key: 'setting', icon: '⚙️', label: '设置' },
  ];

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>😊</View>
          <View className={styles.userDetail}>
            <Text className={styles.username}>散步爱好者</Text>
            <Text className={styles.userDesc}>已发现 {treasures.length} 个城市宝藏</Text>
          </View>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{favoriteIds.length}</Text>
            <Text className={styles.statLabel}>收藏</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{checkins.length}</Text>
            <Text className={styles.statLabel}>打卡</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>3</Text>
            <Text className={styles.statLabel}>路线</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>0</Text>
            <Text className={styles.statLabel}>分享</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>❤️</Text>
          我的收藏
        </Text>

        {favoriteTreasures.length > 0 ? (
          <View>
            {favoriteTreasures.slice(0, 3).map((treasure) => (
              <TreasureCard
                key={treasure.id}
                treasure={treasure}
                isFavorite={true}
                onFavorite={() => handleFavorite(treasure.id)}
              />
            ))}
            {favoriteTreasures.length > 3 && (
              <View className={styles.viewAll} onClick={() => handleMenuClick('favorites')}>
                查看全部 {favoriteTreasures.length} 个收藏 ›
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              textAlign: 'center',
              padding: '48rpx 0',
              color: '#B2BEC3',
              fontSize: '24rpx',
            }}
          >
            还没有收藏的宝藏，快去发现吧~
          </View>
        )}
      </View>

      <View className={styles.checkinSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📸</Text>
          最近打卡
        </Text>

        {checkins.length > 0 ? (
          <View className={styles.checkinList}>
            {checkins.slice(0, 3).map((checkin) => (
              <View key={checkin.id} className={styles.checkinCard}>
                <Image
                  className={styles.checkinPhoto}
                  src={checkin.photo}
                  mode="aspectFill"
                />
                <View className={styles.checkinContent}>
                  <View>
                    <Text className={styles.checkinTitle}>{checkin.treasureName}</Text>
                    <Text className={styles.checkinComment}>{checkin.comment}</Text>
                  </View>
                  <Text className={styles.checkinDate}>{checkin.createdAt}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              textAlign: 'center',
              padding: '48rpx 0',
              color: '#B2BEC3',
              fontSize: '24rpx',
            }}
          >
            还没有打卡记录，快去探索吧~
          </View>
        )}
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>⚡</Text>
          更多功能
        </Text>

        <View className={styles.menuList}>
          {menuItems.map((item) => (
            <View
              key={item.key}
              className={styles.menuItem}
              onClick={() =>
                item.key === 'share' ? handleShare() : handleMenuClick(item.key)
              }
            >
              <Text className={styles.menuIcon}>{item.icon}</Text>
              <Text className={styles.menuText}>{item.label}</Text>
              {item.badge && <Text className={styles.menuBadge}>{item.badge}</Text>}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default MinePage;
