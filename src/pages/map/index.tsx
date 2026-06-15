import React, { useState, useMemo } from 'react';
import { View, Text, Image, Map } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { TreasureCategory } from '@/types/treasure';
import { useAppStore } from '@/store/useAppStore';
import { categoryList } from '@/data/mockData';
import { formatDistance, getCategoryLabel } from '@/utils';
import styles from './index.module.scss';

const MapPage: React.FC = () => {
  const { treasures } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<TreasureCategory | 'all'>('all');

  useDidShow(() => {
    console.log('[MapPage] 页面显示');
  });

  const filteredTreasures = useMemo(() => {
    if (activeCategory === 'all') {
      return treasures;
    }
    return treasures.filter((t) => t.category === activeCategory);
  }, [treasures, activeCategory]);

  const markers = useMemo(() => {
    return filteredTreasures.map((treasure) => ({
      id: Number(treasure.id),
      latitude: treasure.latitude,
      longitude: treasure.longitude,
      title: treasure.name,
      iconPath: '',
      width: 32,
      height: 32,
      callout: {
        content: treasure.name,
        color: '#2D3436',
        fontSize: 12,
        borderRadius: 4,
        bgColor: '#ffffff',
        padding: 5,
        display: 'BYCLICK',
      },
    }));
  }, [filteredTreasures]);

  const handleMarkerClick = (e) => {
    const markerId = String(e.detail.markerId);
    console.log('[MapPage] 点击标记点:', markerId);
    Taro.navigateTo({
      url: `/pages/treasure-detail/index?id=${markerId}`,
    });
  };

  const handleTreasureClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/treasure-detail/index?id=${id}`,
    });
  };

  const centerLatitude = useMemo(() => {
    if (filteredTreasures.length > 0) {
      const sumLat = filteredTreasures.reduce((sum, t) => sum + t.latitude, 0);
      return sumLat / filteredTreasures.length;
    }
    return 31.2304;
  }, [filteredTreasures]);

  const centerLongitude = useMemo(() => {
    if (filteredTreasures.length > 0) {
      const sumLng = filteredTreasures.reduce((sum, t) => sum + t.longitude, 0);
      return sumLng / filteredTreasures.length;
    }
    return 121.4737;
  }, [filteredTreasures]);

  const handleLocate = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log('[MapPage] 获取位置成功:', res.latitude, res.longitude);
        Taro.showToast({ title: '已定位到当前位置', icon: 'none' });
      },
      fail: () => {
        console.error('[MapPage] 获取位置失败');
        Taro.showToast({ title: '获取位置获取失败', icon: 'none' });
      },
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.mapContainer}>
        <Map
          className={styles.map}
          latitude={centerLatitude}
          longitude={centerLongitude}
          scale={14}
          markers={markers}
          showLocation
          onMarkerClick={handleMarkerClick}
        />

        <View className={styles.filterBar}>
          <View className={styles.categoryTabs}>
            {categoryList.slice(0, 5).map((item) => (
              <View
                key={item.key}
                className={`${styles.categoryTab} ${activeCategory === item.key ? styles.active : ''}`}
                onClick={() => setActiveCategory(item.key)}
              >
                <Text className={styles.tabIcon}>{item.icon}</Text>
                <Text className={styles.tabText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.locateBtn} onClick={handleLocate}>
          <Text className={styles.locateIcon}>📍</Text>
        </View>

        <View className={styles.bottomPanel}>
          <View className={styles.panelHandle}></View>
          <Text className={styles.panelTitle}>
            附近宝藏 ({filteredTreasures.length}个)
          </Text>

          <View
            className={styles.treasureList}
            style={{ whiteSpace: 'nowrap' }}
          >
            {filteredTreasures.map((treasure) => (
              <View
                key={treasure.id}
                className={styles.treasureItem}
                onClick={() => handleTreasureClick(treasure.id)}
                style={{ display: 'inline-block', width: '300rpx', marginRight: '24rpx', verticalAlign: 'top' }}
              >
                <Image
                  className={styles.treasureItemImage}
                  src={treasure.image}
                  mode="aspectFill"
                />
                <View className={styles.treasureItemContent}>
                  <Text className={styles.treasureItemName}>{treasure.name}</Text>
                  <View className={styles.treasureItemInfo}>
                    <Text className={styles.treasureItemDistance}>
                      📍 {formatDistance(treasure.distance)}
                    </Text>
                    <Text className={styles.treasureItemCategory}>
                      {getCategoryLabel(treasure.category)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default MapPage;
