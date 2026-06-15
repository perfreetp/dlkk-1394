import { Treasure } from '@/types/treasure';

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const formatWalkTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
};

export const formatBudget = (budget: number): string => {
  if (budget === 0) {
    return '免费';
  }
  return `¥${budget}/人`;
};

export const calculateRouteStats = (treasures: Treasure[]) => {
  const totalDistance = treasures.reduce((sum, t) => sum + t.distance, 0);
  const totalTime = treasures.reduce((sum, t) => sum + t.walkTime + 30, 0);
  const totalBudget = treasures.reduce((sum, t) => sum + t.budget, 0);

  return {
    distance: Math.round(totalDistance * 10) / 10,
    time: totalTime,
    budget: totalBudget,
  };
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    shop: '特色小店',
    exhibition: '街角展览',
    park: '口袋公园',
    viewpoint: '观景台',
  };
  return labels[category] || category;
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    shop: '#FF7D4A',
    exhibition: '#A29BFE',
    park: '#2EC4B6',
    viewpoint: '#FFD166',
  };
  return colors[category] || '#FF7D4A';
};
