import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import RouteCard from '@/components/RouteCard';
import { formatDistance, formatWalkTime, formatBudget } from '@/utils';
import styles from './index.module.scss';

type SceneFilter = 'all' | 'family' | 'rainy' | 'free' | 'halfday';

const sceneOptions: Array<{ key: SceneFilter; label: string; icon: string }> = [
  { key: 'all', label: '全部', icon: '📍' },
  { key: 'family', label: '亲子', icon: '👨‍👩‍👧' },
  { key: 'rainy', label: '雨天', icon: '🌧️' },
  { key: 'free', label: '免费', icon: '🆓' },
  { key: 'halfday', label: '半日游', icon: '🕐' },
];

const RoutesPage: React.FC = () => {
  const { routes, treasures, toggleRouteFavorite } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'favorite'>('all');
  const [sceneFilter, setSceneFilter] = useState<SceneFilter>('all');

  useDidShow(() => {
    console.log('[RoutesPage] 页面显示');
  });

  const routesWithDetails = useMemo(() => {
    return routes.map((route) => {
      const routeTreasures = route.treasureIds
        .map((id) => treasures.find((t) => t.id === id))
        .filter(Boolean);

      const hasFamily = routeTreasures.some((t) => t.isFamilyFriendly);
      const hasRainy = routeTreasures.some((t) => t.isRainy);
      const allFree = routeTreasures.every((t) => t.budget === 0);
      const totalBudget = routeTreasures.reduce((sum, t) => sum + t.budget, 0);
      const isHalfDay = route.totalTime <= 180;

      const sceneTags: string[] = [];
      if (hasFamily) sceneTags.push('亲子');
      if (hasRainy) sceneTags.push('雨天');
      if (allFree) sceneTags.push('免费');
      if (isHalfDay) sceneTags.push('半日游');

      return {
        ...route,
        hasFamily,
        hasRainy,
        allFree,
        totalBudget,
        isHalfDay,
        sceneTags,
        pointCount: routeTreasures.length,
      };
    });
  }, [routes, treasures]);

  const filteredRoutes = useMemo(() => {
    let result = routesWithDetails;

    if (activeTab === 'favorite') {
      result = result.filter((r) => r.isFavorite);
    }

    if (sceneFilter !== 'all') {
      result = result.filter((r) => {
        switch (sceneFilter) {
          case 'family':
            return r.hasFamily;
          case 'rainy':
            return r.hasRainy;
          case 'free':
            return r.allFree;
          case 'halfday':
            return r.isHalfDay;
          default:
            return true;
        }
      });
    }

    return result;
  }, [routesWithDetails, activeTab, sceneFilter]);

  const handleRouteClick = (routeId: string) => {
    console.log('[RoutesPage] 点击路线:', routeId);
    Taro.navigateTo({
      url: `/pages/route-detail/index?id=${routeId}`,
    });
  };

  const handleCreateRoute = () => {
    Taro.navigateTo({
      url: '/pages/route-edit/index',
    });
  };

  const handleFavorite = (routeId: string) => {
    toggleRouteFavorite(routeId);
    const route = routes.find((r) => r.id === routeId);
    if (route?.isFavorite) {
      Taro.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      Taro.showToast({ title: '已收藏路线', icon: 'success' });
    }
  };

  const recommendedRoutes = [
    {
      id: 'rec1',
      name: '文艺老城漫步',
      description: '老城区最有味道的一条路线，适合慢慢逛',
      coverImage: 'https://picsum.photos/id/103/600/400',
      points: 5,
      distance: 3.2,
      time: 150,
    },
    {
      id: 'rec2',
      name: '亲子公园游',
      description: '三个公园串起来玩，小朋友超开心',
      coverImage: 'https://picsum.photos/id/1036/600/400',
      points: 3,
      distance: 2.5,
      time: 180,
    },
    {
      id: 'rec3',
      name: '美食探店路线',
      description: '本地人私藏的美食地图',
      coverImage: 'https://picsum.photos/id/292/600/400',
      points: 6,
      distance: 4.0,
      time: 200,
    },
  ];

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>我的路线</Text>
        <Text className={styles.headerDesc}>把喜欢的宝藏串成你的专属路线</Text>

        <View className={styles.tabs}>
          <View
            className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Text className={styles.tabText}>全部路线</Text>
          </View>
          <View
            className={`${styles.tab} ${activeTab === 'favorite' ? styles.active : ''}`}
            onClick={() => setActiveTab('favorite')}
          >
            <Text className={styles.tabText}>我的收藏</Text>
          </View>
        </View>
      </View>

      <View className={styles.sceneSection}>
        <Text className={styles.sceneTitle}>
          <Text className={styles.sceneTitleIcon}>🎯</Text>
          按场景找路线
        </Text>
        <ScrollView scrollX className={styles.sceneList}>
          {sceneOptions.map((option) => (
            <View
              key={option.key}
              className={classnames(
                styles.sceneItem,
                sceneFilter === option.key && styles.sceneItemActive,
              )}
              onClick={() => setSceneFilter(option.key)}
            >
              <Text className={styles.sceneIcon}>{option.icon}</Text>
              <Text className={styles.sceneLabel}>{option.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📋</Text>
            {activeTab === 'all'
              ? sceneFilter !== 'all'
                ? `${sceneOptions.find((s) => s.key === sceneFilter)?.label || ''}路线`
                : '我的路线'
              : '收藏的路线'}
          </Text>
          <Text style={{ fontSize: '24rpx', color: '#86909c' }}>
            共 {filteredRoutes.length} 条
          </Text>
        </View>
      </View>

      <View className={styles.routeList}>
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map((route) => (
            <View key={route.id} className={styles.routeCardWrapper}>
              <RouteCard
                route={route}
                onClick={() => handleRouteClick(route.id)}
                onFavorite={() => handleFavorite(route.id)}
              />
              {route.sceneTags.length > 0 && (
                <View className={styles.sceneTagsRow}>
                  {route.sceneTags.map((tag) => (
                    <View key={tag} className={styles.sceneTag}>
                      <Text className={styles.sceneTagText}>{tag}</Text>
                    </View>
                  ))}
                  <Text className={styles.routeMetaText}>
                    {route.pointCount}个点 · {formatBudget(route.totalBudget)}
                  </Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View className={styles.emptyText}>
            {sceneFilter !== 'all' ? '没有符合条件的路线，换个场景试试~' : '还没有路线哦'}{'\n'}
            点击右下角按钮创建你的第一条路线吧~
          </View>
        )}
      </View>

      <View className={styles.recommendSection}>
        <Text className={styles.recommendTitle}>
          <Text className={styles.sectionIcon}>💡</Text>
          推荐路线
        </Text>

        <ScrollView scrollX className={styles.recommendList}>
          {recommendedRoutes.map((route) => (
            <View key={route.id} className={styles.recommendCard}>
              <Image
                className={styles.recommendImage}
                src={route.coverImage}
                mode="aspectFill"
              />
              <View className={styles.recommendContent}>
                <Text className={styles.recommendName}>{route.name}</Text>
                <Text className={styles.recommendDesc}>{route.description}</Text>
                <View className={styles.recommendStats}>
                  <Text className={styles.recommendStat}>📍 {route.points}个点</Text>
                  <Text className={styles.recommendStat}>
                    🚶 {formatWalkTime(route.time)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.createBtn} onClick={handleCreateRoute}>
        <Text className={styles.createBtnIcon}>➕</Text>
        <Text className={styles.createBtnText}>创建路线</Text>
      </View>
    </ScrollView>
  );
};

export default RoutesPage;
