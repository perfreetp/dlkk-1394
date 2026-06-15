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

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1000) / 1000;
};

export const estimateWalkTime = (distanceKm: number): number => {
  return Math.max(5, Math.round(distanceKm / 5 * 60));
};

export interface SegmentInfo {
  fromIndex: number;
  toIndex: number;
  distance: number;
  walkTime: number;
}

export const calculateSegments = (treasures: Treasure[]): SegmentInfo[] => {
  const segments: SegmentInfo[] = [];
  for (let i = 0; i < treasures.length - 1; i++) {
    const from = treasures[i];
    const to = treasures[i + 1];
    const dist = calculateDistance(from.latitude, from.longitude, to.latitude, to.longitude);
    segments.push({
      fromIndex: i,
      toIndex: i + 1,
      distance: dist,
      walkTime: estimateWalkTime(dist),
    });
  }
  return segments;
};
