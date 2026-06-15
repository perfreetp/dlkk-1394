import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import { TreasureCategory } from '@/types/treasure';
import { categoryList } from '@/data/mockData';
import styles from './index.module.scss';

export type WalkTimeOption = 'all' | '10' | '20' | '30';
export type BudgetOption = 'all' | '0' | '20' | '50';

interface FilterBarProps {
  activeCategory: TreasureCategory | 'all';
  onCategoryChange: (category: TreasureCategory | 'all') => void;
  showRainy?: boolean;
  showFamily?: boolean;
  showWalkTime?: boolean;
  showBudget?: boolean;
  onRainyChange?: (checked: boolean) => void;
  onFamilyChange?: (checked: boolean) => void;
  onWalkTimeChange?: (value: WalkTimeOption) => void;
  onBudgetChange?: (value: BudgetOption) => void;
  rainyActive?: boolean;
  familyActive?: boolean;
  walkTimeActive?: WalkTimeOption;
  budgetActive?: BudgetOption;
}

const walkTimeOptions: { value: WalkTimeOption; label: string }[] = [
  { value: 'all', label: '步行不限' },
  { value: '10', label: '≤10分钟' },
  { value: '20', label: '≤20分钟' },
  { value: '30', label: '≤30分钟' },
];

const budgetOptions: { value: BudgetOption; label: string }[] = [
  { value: 'all', label: '预算不限' },
  { value: '0', label: '免费' },
  { value: '20', label: '≤20元' },
  { value: '50', label: '≤50元' },
];

const FilterBar: React.FC<FilterBarProps> = ({
  activeCategory,
  onCategoryChange,
  showRainy = true,
  showFamily = true,
  showWalkTime = true,
  showBudget = true,
  onRainyChange,
  onFamilyChange,
  onWalkTimeChange,
  onBudgetChange,
  rainyActive = false,
  familyActive = false,
  walkTimeActive = 'all',
  budgetActive = 'all',
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
        </View>
      </ScrollView>

      {showWalkTime && (
        <ScrollView scrollX className={styles.optionScroll}>
          <View className={styles.optionRow}>
            {walkTimeOptions.map((opt) => (
              <View
                key={opt.value}
                className={classnames(
                  styles.optionTag,
                  walkTimeActive === opt.value && styles.optionActive
                )}
                onClick={() => onWalkTimeChange?.(opt.value)}
              >
                <Text className={styles.optionText}>
                  {walkTimeActive === opt.value ? '🚶 ' : ''}{opt.label}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {showBudget && (
        <ScrollView scrollX className={styles.optionScroll}>
          <View className={styles.optionRow}>
            {budgetOptions.map((opt) => (
              <View
                key={opt.value}
                className={classnames(
                  styles.optionTag,
                  budgetActive === opt.value && styles.optionActive
                )}
                onClick={() => onBudgetChange?.(opt.value)}
              >
                <Text className={styles.optionText}>
                  {budgetActive === opt.value ? '💰 ' : ''}{opt.label}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

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
