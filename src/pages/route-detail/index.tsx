import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import { Treasure } from '@/types/treasure';
import { formatDistance, formatWalkTime, formatBudget, getCategoryLabel } from '@/utils';
import styles from './index.module.scss';

const RouteDetailPage: React.FC = () => {
  const router = useRouter();
  const { treasures, routes, toggleRouteFavorite, addToCurrentRoute } = useAppStore();

  const routeId = router.params.id;

  useDidShow(() => {
    console.log('[RouteDetailPage] 页面显示, id:', routeId);
  });

  const route = useMemo(() => {
    return routes.find((r) => r.id === routeId);
  }, [routes, routeId]);

  const routeTreasures = useMemo(() => {
    if (!route) return [];
    return route.treasureIds
      .map((id) => treasures.find((t) => t.id === id))
      .filter(Boolean) as Treasure[];
  }, [route, treasures]);

  const handleTreasureClick = (treasureId: string) => {
    Taro.navigateTo({
      url: `/pages/treasure-detail/index?id=${treasureId}`,
    });
  };

  const handleFavorite = () => {
    if (!route) return;
    toggleRouteFavorite(route.id);
    Taro.showToast({
      title: route.isFavorite ? '已取消收藏' : '已收藏路线',
      icon: 'none',
    });
  };

  const handleShare = () => {
    if (!route || routeTreasures.length === 0) return;
    const treasureNames = routeTreasures.map((t) => `・${t.name}`).join('\n');
    Taro.showModal({
      title: `分享路线：${route.name}`,
      content: `【${route.name}】\n\n${route.description}\n\n📍包含${routeTreasures.length}个地点：\n${treasureNames}\n\n📏总距离：${formatDistance(route.totalDistance)}\n⏱️预计时间：${formatWalkTime(route.totalTime)}\n\n快打开「城市散步宝藏」来探索吧！`,
      showCancel: true,
      confirmText: '复制信息',
      cancelText: '小程序分享',
      success: (res) => {
        if (res.confirm) {
          Taro.setClipboardData({
            data: `【${route.name}】\n${route.description}\n\n包含${routeTreasures.length}个地点：\n${treasureNames}\n\n总距离：${formatDistance(route.totalDistance)}\n预计时间：${formatWalkTime(route.totalTime)}`,
            success: () => {
              Taro.showToast({ title: '已复制分享文案', icon: 'success' });
            },
          });
        } else {
          Taro.showToast({ title: '请点击右上角分享', icon: 'none' });
        }
      },
    });
  };

  const handleUseRoute = () => {
    if (!route) return;
    route.treasureIds.forEach((id) => {
      addToCurrentRoute(id);
    });
    Taro.showToast({ title: '已加入编辑路线', icon: 'success' });
    setTimeout(() => {
      Taro.navigateTo({
        url: '/pages/route-edit/index',
      });
    }, 1000);
  };

  if (!route) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx', textAlign: 'center', color: '#B2BEC3' }}>
          路线不存在
        </View>
      </View>
    );
  }

  const totalBudget = routeTreasures.reduce((sum, t) => sum + t.budget, 0);

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>{route.name}</Text>
        <Text className={styles.headerDesc}>{route.description}</Text>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{routeTreasures.length}</Text>
            <Text className={styles.statLabel}>个地点</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatDistance(route.totalDistance)}</Text>
            <Text className={styles.statLabel}>总距离</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatWalkTime(route.totalTime)}</Text>
            <Text className={styles.statLabel}>预计时长</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>¥{totalBudget}</Text>
            <Text className={styles.statLabel}>总预算</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>📍</Text>
          建议游览顺序
        </Text>

        <View className={styles.timeline}>
          {routeTreasures.map((treasure, index) => (
            <View key={treasure.id} className={styles.timelineItem}>
              <View className={styles.timelineDot}>{index + 1}</View>
              <View
                className={styles.timelineCard}
                onClick={() => handleTreasureClick(treasure.id)}
              >
                <View className={styles.timelineCardHeader}>
                  <Image
                    className={styles.timelineImage}
                    src={treasure.image}
                    mode="aspectFill"
                  />
                  <View className={styles.timelineInfo}>
                    <View>
                      <Text className={styles.timelineName}>{treasure.name}</Text>
                      <View className={styles.timelineCategory}>
                        {getCategoryLabel(treasure.category)}
                      </View>
                    </View>
                    <View className={styles.timelineMeta}>
                      <Text className={styles.timelineMetaItem}>
                        📍 {formatDistance(treasure.distance)}
                      </Text>
                      <Text className={styles.timelineMetaItem}>
                        💰 {formatBudget(treasure.budget)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className={styles.timelineCardBody}>
                  <Text className={styles.timelineDuration}>
                    ⏱️ 建议停留：约30分钟 · 步行{formatWalkTime(treasure.walkTime)}可达
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>💡</Text>
          温馨提示
        </Text>
        <View className={styles.tipsSection}>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>🕐</Text>
            <Text className={styles.tipText}>
              建议预留充足时间，每个地点约30分钟的探索和拍照时间
            </Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>👟</Text>
            <Text className={styles.tipText}>
              穿舒适的鞋子，全程步行约{formatWalkTime(route.totalTime)}
            </Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>💧</Text>
            <Text className={styles.tipText}>
              记得带水和小零食，路上及时补充能量
            </Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>📸</Text>
            <Text className={styles.tipText}>
              每个地点都有推荐拍照点，记得打卡哦~
            </Text>
          </View>
        </View>
      </View>

      <View style={{ height: '40rpx' }}></View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.actionBtn, styles.btnOutline)}
          onClick={handleFavorite}
        >
          <Text className={styles.btnIcon}>{route.isFavorite ? '❤️' : '🤍'}</Text>
          <Text>{route.isFavorite ? '已收藏' : '收藏'}</Text>
        </View>
        <View
          className={classnames(styles.actionBtn, styles.btnOutline)}
          onClick={handleShare}
        >
          <Text className={styles.btnIcon}>📤</Text>
          <Text>分享</Text>
        </View>
        <View
          className={classnames(styles.actionBtn, styles.btnPrimary)}
          onClick={handleUseRoute}
        >
          <Text className={styles.btnIcon}>🚶</Text>
          <Text>使用路线</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RouteDetailPage;
