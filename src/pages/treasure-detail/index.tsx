import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, Button, Textarea } from '@tarojs/components';
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
  const { treasures, favoriteIds, checkins, addToFavorites, removeFromFavorites, addToCurrentRoute, addCheckin } =
    useAppStore();

  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [checkinPhoto, setCheckinPhoto] = useState('');
  const [checkinComment, setCheckinComment] = useState('');

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
    if (!treasure) return;
    Taro.showModal({
      title: '分享给朋友',
      content: `【${treasure.name}】\n📍 ${treasure.address}\n⭐ 评分 ${treasure.rating}\n\n${treasure.description}\n\n快打开「城市散步宝藏」小程序来探索吧！`,
      showCancel: true,
      confirmText: '复制信息',
      cancelText: '小程序分享',
      success: (res) => {
        if (res.confirm) {
          Taro.setClipboardData({
            data: `【${treasure.name}】\n📍 ${treasure.address}\n⭐ 评分 ${treasure.rating}\n\n${treasure.description}`,
            success: () => {
              Taro.showToast({ title: '已复制分享文案', icon: 'success' });
            }
          });
        } else {
          Taro.showToast({ title: '请点击右上角分享', icon: 'none' });
        }
      }
    });
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
  };

  const handleCheckin = () => {
    setCheckinPhoto('');
    setCheckinComment('');
    setShowCheckinModal(true);
  };

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        setCheckinPhoto(tempFilePath);
        console.log('[TreasureDetailPage] 选择图片:', tempFilePath);
      },
      fail: (err) => {
        console.error('[TreasureDetailPage] 选择图片失败:', err);
        // 如果失败，使用默认图片
        const fallbackPhotos = [
          'https://picsum.photos/id/431/600/600',
          'https://picsum.photos/id/292/600/600',
          'https://picsum.photos/id/1015/600/600',
          'https://picsum.photos/id/103/600/600',
        ];
        const randomPhoto = fallbackPhotos[Math.floor(Math.random() * fallbackPhotos.length)];
        setCheckinPhoto(randomPhoto);
        Taro.showToast({ title: '已添加照片', icon: 'none' });
      }
    });
  };

  const handleSubmitCheckin = () => {
    if (!treasure) return;
    if (!checkinPhoto) {
      Taro.showToast({ title: '请先选择照片', icon: 'none' });
      return;
    }
    if (!checkinComment.trim()) {
      Taro.showToast({ title: '写一句短评吧', icon: 'none' });
      return;
    }

    addCheckin(
      treasure.id,
      treasure.name,
      checkinPhoto,
      checkinComment.trim()
    );

    setShowCheckinModal(false);
    Taro.showToast({ title: '打卡成功！', icon: 'success' });
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

      {checkins.filter((c) => c.treasureId === treasureId).length > 0 && (
        <View className={styles.section} style={{ padding: '0 32rpx', marginTop: '0' }}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📸</Text>
            打卡记录（{checkins.filter((c) => c.treasureId === treasureId).length}）
          </Text>
          <View className={styles.checkinRecordList}>
            {checkins
              .filter((c) => c.treasureId === treasureId)
              .slice(0, 3)
              .map((record) => (
                <View key={record.id} className={styles.checkinRecordItem}>
                  <Image
                    className={styles.checkinRecordPhoto}
                    src={record.photo}
                    mode="aspectFill"
                  />
                  <View className={styles.checkinRecordContent}>
                    <Text className={styles.checkinRecordComment}>{record.comment}</Text>
                    <Text className={styles.checkinRecordDate}>{record.createdAt}</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
      )}

      {/* 打卡弹窗 */}
      {showCheckinModal && (
        <View className={styles.checkinModal}>
          <View className={styles.modalMask} onClick={() => setShowCheckinModal(false)} />
          <View className={styles.modalContent}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>打卡 · {treasure.name}</Text>
              <View
                className={styles.modalClose}
                onClick={() => setShowCheckinModal(false)}
              >
                <Text style={{ fontSize: '32rpx', color: '#B2BEC3' }}>✕</Text>
              </View>
            </View>

            <View className={styles.modalBody}>
              <View
                className={styles.photoPicker}
                onClick={handleChooseImage}
              >
                {checkinPhoto ? (
                  <Image
                    className={styles.pickedPhoto}
                    src={checkinPhoto}
                    mode="aspectFill"
                  />
                ) : (
                  <View className={styles.photoPlaceholder}>
                    <Text style={{ fontSize: '60rpx' }}>📷</Text>
                    <Text style={{ fontSize: '24rpx', color: '#B2BEC3', marginTop: '16rpx' }}>
                      点击添加照片
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ marginTop: '32rpx' }}>
                <Text style={{ fontSize: '26rpx', color: '#2D3436', fontWeight: 500, marginBottom: '16rpx' }}>
                  写一句短评
                </Text>
                <Textarea
                  className={styles.commentInput}
                  placeholder="说点什么吧，不超过50字..."
                  placeholderStyle={{ color: '#B2BEC3' }}
                  value={checkinComment}
                  onInput={(e) => setCheckinComment(e.detail.value.slice(0, 50))}
                  maxlength={50}
                  autoHeight
                />
                <Text style={{ fontSize: '22rpx', color: '#B2BEC3', textAlign: 'right', marginTop: '8rpx' }}>
                  {checkinComment.length}/50
                </Text>
              </View>
            </View>

            <View className={styles.modalFooter}>
              <View
                className={classnames(styles.modalBtn, styles.modalBtnCancel)}
                onClick={() => setShowCheckinModal(false)}
              >
                <Text>取消</Text>
              </View>
              <View
                className={classnames(styles.modalBtn, styles.modalBtnConfirm)}
                onClick={handleSubmitCheckin}
              >
                <Text>完成打卡</Text>
              </View>
            </View>
          </View>
        </View>
      )}

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
