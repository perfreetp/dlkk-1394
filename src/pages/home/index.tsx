import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { TreasureCategory } from '@/types/treasure';
import { useAppStore } from '@/store/useAppStore';
import TreasureCard from '@/components/TreasureCard';
import FilterBar from '@/components/FilterBar';
import { formatDistance } from '@/utils';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const { treasures, favoriteIds, addToFavorites, removeFromFavorites } = useAppStore();
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<TreasureCategory | 'all'>('all');
  const [rainyActive, setRainyActive] = useState(false);
  const [familyActive, setFamilyActive] = useState(false);

  useDidShow(() => {
    console.log('[HomePage] 页面显示');
  });

  const newTreasures = useMemo(() => {
    return treasures.filter((t) => t.isNew).slice(0, 5);
  }, [treasures]);

  const filteredTreasures = useMemo(() => {
    let result = [...treasures];

    if (searchText) {
      const keyword = searchText.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(keyword) ||
          t.description.toLowerCase().includes(keyword) ||
          t.address.toLowerCase().includes(keyword)
      );
    }

    if (activeCategory !== 'all') {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (rainyActive) {
      result = result.filter((t) => t.isRainy);
    }

    if (familyActive) {
      result = result.filter((t) => t.isFamilyFriendly);
    }

    return result;
  }, [treasures, searchText, activeCategory, rainyActive, familyActive]);

  const handleFavorite = useCallback(
    (id: string) => {
      if (favoriteIds.includes(id)) {
        removeFromFavorites(id);
        Taro.showToast({ title: '已取消收藏', icon: 'none' });
      } else {
        addToFavorites(id);
        Taro.showToast({ title: '已收藏', icon: 'success' });
      }
    },
    [favoriteIds, addToFavorites, removeFromFavorites]
  );

  const handleNewClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/treasure-detail/index?id=${id}`,
    });
  };

  return (
    <ScrollView scrollY className={styles.page} refresherEnabled>
      <View className={styles.header}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索宝藏地点..."
            placeholderClass={styles.placeholder}
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>

        <View className={styles.quickStats}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{treasures.length}</Text>
            <Text className={styles.statLabel}>发现宝藏</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{newTreasures.length}</Text>
            <Text className={styles.statLabel}>本周新增</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{favoriteIds.length}</Text>
            <Text className={styles.statLabel}>我的收藏</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>✨</Text>
            本周新上榜
          </Text>
          <Text className={styles.moreBtn}>查看更多 ›</Text>
        </View>

        <ScrollView scrollX className={styles.newList}>
          {newTreasures.map((treasure) => (
            <View
              key={treasure.id}
              className={styles.newCard}
              onClick={() => handleNewClick(treasure.id)}
            >
              <Image
                className={styles.newCardImage}
                src={treasure.image}
                mode="aspectFill"
              />
              <View className={styles.newCardContent}>
                <Text className={styles.newCardTitle}>{treasure.name}</Text>
                <Text className={styles.newCardDesc}>{treasure.description}</Text>
                <View className={styles.newCardMeta}>
                  <Text className={styles.newCardDistance}>
                    📍 {formatDistance(treasure.distance)}
                  </Text>
                  <Text className={styles.newCardBadge}>NEW</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.filterSection}>
        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          rainyActive={rainyActive}
          familyActive={familyActive}
          onRainyChange={setRainyActive}
          onFamilyChange={setFamilyActive}
        />
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📍</Text>
            精选推荐
          </Text>
          <Text className={styles.moreBtn}>共 {filteredTreasures.length} 个</Text>
        </View>
      </View>

      <View className={styles.treasureList}>
        {filteredTreasures.map((treasure) => (
          <TreasureCard
            key={treasure.id}
            treasure={treasure}
            isFavorite={favoriteIds.includes(treasure.id)}
            onFavorite={() => handleFavorite(treasure.id)}
          />
        ))}
        {filteredTreasures.length === 0 && (
          <View className={styles.loading}>没有找到相关宝藏，换个关键词试试~</View>
        )}
      </View>
    </ScrollView>
  );
};

export default HomePage;
