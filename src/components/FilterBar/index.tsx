import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import { TreasureCategory } from '@/types/treasure';
import { categoryList } from '@/data/mockData';
import styles from './index.module.scss';

interface FilterBarProps {
  activeCategory: TreasureCategory | 'all';
  onCategoryChange: (category: TreasureCategory | 'all') => void;
  showRainy?: boolean;
  showFamily?: boolean;
  onRainyChange?: (checked: boolean) => void;
  onFamilyChange?: (checked: boolean) => void;
  rainyActive?: boolean;
  familyActive?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeCategory,
  onCategoryChange,
  showRainy = true,
  showFamily = true,
  onRainyChange,
  onFamilyChange,
  rainyActive = false,
  familyActive = false,
}) => {
  return (
    <View className={styles.filterBar}>
      <ScrollView scrollX className={styles.categoryScroll}>
        <View className={styles.categoryList}>
          {categoryList.map((item) => (
            <View
              key={item.key}
              className={classnames(
              styles.categoryItem,
              activeCategory === item.key && styles.categoryActive
            )}
            onClick={() => onCategoryChange(item.key)}
          >
            <Text className={styles.categoryIcon}>{item.icon}</Text>
            <Text className={styles.categoryLabel}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.filterTags}>
        {showRainy && (
          <View
            className={classnames(styles.filterTag, rainyActive && styles.filterTagActive)}
            onClick={() => onRainyChange?.(!rainyActive)}
          >
            <Text className={styles.filterTagIcon}>🌧️</Text>
            <Text className={styles.filterTagText}>雨天可去</Text>
          </View>
        )}
        {showFamily && (
          <View
            className={classnames(styles.filterTag, familyActive && styles.filterTagActive)}
            onClick={() => onFamilyChange?.(!familyActive)}
          >
            <Text className={styles.filterTagIcon}>👨‍👩‍👧</Text>
            <Text className={styles.filterTagText}>亲子友好</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FilterBar;
