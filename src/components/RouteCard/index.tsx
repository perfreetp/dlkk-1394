import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import { Route } from '@/types/treasure';
import { formatDistance, formatWalkTime } from '@/utils';
import styles from './index.module.scss';

interface RouteCardProps {
  route: Route;
  onClick?: () => void;
  onFavorite?: () => void;
  showFavorite?: boolean;
}

const RouteCard: React.FC<RouteCardProps> = ({
  route,
  onClick,
  onFavorite,
  showFavorite = true,
}) => {
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.();
  };

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={route.coverImage}
          mode="aspectFill"
        />
        <View className={styles.pointsBadge}>
          <Text className={styles.pointsText}>{route.treasureIds.length}个点</Text>
        </View>
        {showFavorite && (
          <View
            className={classnames(styles.favoriteBtn, route.isFavorite && styles.favorited)}
            onClick={handleFavorite}
          >
            <Text className={styles.favoriteIcon}>{route.isFavorite ? '❤️' : '🤍'}</Text>
          </View>
        )}
      </View>

      <View className={styles.content}>
        <Text className={styles.title}>{route.name}</Text>
        <Text className={styles.desc}>{route.description}</Text>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statIcon}>📍</Text>
            <Text className={styles.statText}>{formatDistance(route.totalDistance)}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statIcon}>⏱️</Text>
            <Text className={styles.statText}>{formatWalkTime(route.totalTime)}</Text>
          </View>
        </View>

        <View className={styles.dateRow}>
          <Text className={styles.dateText}>创建于 {route.createdAt}</Text>
        </View>
      </View>
    </View>
  );
};

export default RouteCard;
