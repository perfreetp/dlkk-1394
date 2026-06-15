import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Treasure } from '@/types/treasure';
import { formatDistance, formatWalkTime, getCategoryLabel } from '@/utils';
import Tag from '../Tag';
import styles from './index.module.scss';

interface TreasureCardProps {
  treasure: Treasure;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavorite?: () => void;
  onClick?: () => void;
}

const TreasureCard: React.FC<TreasureCardProps> = ({
  treasure,
  showFavorite = true,
  isFavorite = false,
  onFavorite,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/treasure-detail/index?id=${treasure.id}`,
      });
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.();
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={treasure.image}
          mode="aspectFill"
        />
        <View className={styles.categoryTag}>
          <Text className={styles.categoryText}>{getCategoryLabel(treasure.category)}</Text>
        </View>
        {treasure.isNew && (
          <View className={styles.newBadge}>
            <Text className={styles.newText}>NEW</Text>
          </View>
        )}
        {showFavorite && (
          <View
            className={classnames(styles.favoriteBtn, isFavorite && styles.favorited)}
            onClick={handleFavorite}
          >
            <Text className={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </View>
        )}
      </View>

      <View className={styles.content}>
        <Text className={styles.title}>{treasure.name}</Text>
        <Text className={styles.desc}>{treasure.description}</Text>

        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoIcon}>📍</Text>
            <Text className={styles.infoText}>{formatDistance(treasure.distance)}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoIcon}>🚶</Text>
            <Text className={styles.infoText}>{formatWalkTime(treasure.walkTime)}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoIcon}>💰</Text>
            <Text className={styles.infoText}>
              {treasure.budget === 0 ? '免费' : `¥${treasure.budget}`}
            </Text>
          </View>
        </View>

        <View className={styles.tagRow}>
          {treasure.isRainy && <Tag text="雨天可去" type="rain" size="small" />}
          {treasure.isFamilyFriendly && <Tag text="亲子友好" type="family" size="small" />}
          {treasure.budget === 0 && <Tag text="免费" type="free" size="small" />}
        </View>

        <View className={styles.bottomRow}>
          <View className={styles.rating}>
            <Text className={styles.star}>⭐</Text>
            <Text className={styles.ratingText}>{treasure.rating}</Text>
          </View>
          <Text className={styles.checkinCount}>{treasure.checkinCount}人打卡</Text>
        </View>
      </View>
    </View>
  );
};

export default TreasureCard;
