import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import { Treasure } from '@/types/treasure';
import { formatDistance, formatWalkTime, calculateRouteStats } from '@/utils';
import styles from './index.module.scss';

const RouteEditPage: React.FC = () => {
  const {
    treasures,
    currentRouteTreasureIds,
    addToCurrentRoute,
    removeFromCurrentRoute,
    clearCurrentRoute,
    saveRoute,
  } = useAppStore();

  const [routeName, setRouteName] = useState('');
  const [routeDesc, setRouteDesc] = useState('');

  useDidShow(() => {
    console.log('[RouteEditPage] 页面显示');
  });

  const routeTreasures = useMemo(() => {
    return currentRouteTreasureIds
      .map((id) => treasures.find((t) => t.id === id))
      .filter(Boolean);
  }, [treasures, currentRouteTreasureIds]);

  const routeStats = useMemo(() => {
    return calculateRouteStats(routeTreasures as Treasure[]);
  }, [routeTreasures]);

  const availableTreasures = useMemo(() => {
    return treasures.filter((t) => !currentRouteTreasureIds.includes(t.id));
  }, [treasures, currentRouteTreasureIds]);

  const handleAddTreasure = (id: string) => {
    addToCurrentRoute(id);
    Taro.showToast({ title: '已添加', icon: 'success' });
  };

  const handleRemoveTreasure = (id: string) => {
    removeFromCurrentRoute(id);
    Taro.showToast({ title: '已移除', icon: 'none' });
  };

  const handleSave = () => {
    if (!routeName.trim()) {
      Taro.showToast({ title: '请输入路线名称', icon: 'none' });
      return;
    }
    if (routeTreasures.length < 2) {
      Taro.showToast({ title: '至少添加2个地点', icon: 'none' });
      return;
    }

    saveRoute(routeName.trim(), routeDesc.trim());
    Taro.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const handleCancel = () => {
    if (routeTreasures.length > 0 || routeName || routeDesc) {
      Taro.showModal({
        title: '确认取消',
        content: '编辑的内容将会丢失，确定取消吗？',
        success: (res) => {
          if (res.confirm) {
            clearCurrentRoute();
            Taro.navigateBack();
          }
        },
      });
    } else {
      Taro.navigateBack();
    }
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.inputWrap}>
          <Text className={styles.inputLabel}>路线名称</Text>
          <Input
            className={styles.nameInput}
            placeholder="给你的路线起个名字吧"
            placeholderStyle={{ color: '#B2BEC3' }}
            value={routeName}
            onInput={(e) => setRouteName(e.detail.value)}
            maxlength={20}
          />
        </View>

        <View className={styles.inputWrap}>
          <Text className={styles.inputLabel}>路线简介</Text>
          <Textarea
            className={styles.descInput}
            placeholder="简单介绍一下这条路线..."
            placeholderStyle={{ color: '#B2BEC3' }}
            value={routeDesc}
            onInput={(e) => setRouteDesc(e.detail.value)}
            maxlength={100}
          />
        </View>

        <View className={styles.statsBar}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{routeTreasures.length}</Text>
            <Text className={styles.statLabel}>个地点</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatDistance(routeStats.distance)}</Text>
            <Text className={styles.statLabel}>总距离</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{formatWalkTime(routeStats.time)}</Text>
            <Text className={styles.statLabel}>预计时长</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>¥{routeStats.budget}</Text>
            <Text className={styles.statLabel}>总预算</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📍</Text>
            路线地点
          </Text>
          <Text className={styles.countBadge}>{routeTreasures.length}个地点</Text>
        </View>

        {routeTreasures.length > 0 ? (
          <View className={styles.routeList}>
            {routeTreasures.map((treasure, index) => (
              <View key={treasure!.id} className={styles.routeItem}>
                <View className={styles.itemIndex}>{index + 1}</View>
                <Image
                  className={styles.itemImage}
                  src={treasure!.image}
                  mode="aspectFill"
                />
                <View className={styles.itemInfo}>
                  <Text className={styles.itemName}>{treasure!.name}</Text>
                  <Text className={styles.itemDesc}>
                    🚶 {formatWalkTime(treasure!.walkTime)} · 💰
                    {treasure!.budget === 0 ? '免费' : `¥${treasure!.budget}`}
                  </Text>
                </View>
                <View
                  className={styles.removeBtn}
                  onClick={() => handleRemoveTreasure(treasure!.id)}
                >
                  <Text className={styles.removeIcon}>✕</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🗺️</Text>
            <Text className={styles.emptyText}>
              还没有添加地点{'\n'}从下方选择宝藏加入你的路线吧~
            </Text>
          </View>
        )}
      </View>

      <View className={styles.treasurePicker}>
        <Text className={styles.pickerTitle}>
          <Text className={styles.sectionIcon}>✨</Text>
          添加更多宝藏
        </Text>

        {availableTreasures.length > 0 ? (
          <ScrollView scrollX className={styles.pickerList}>
            {availableTreasures.map((treasure) => (
              <View
                key={treasure.id}
                className={classnames(styles.pickerItem)}
                onClick={() => handleAddTreasure(treasure.id)}
              >
                <Image
                  className={styles.pickerItemImage}
                  src={treasure.image}
                  mode="aspectFill"
                />
                <View className={styles.pickerItemContent}>
                  <Text className={styles.pickerItemName}>{treasure.name}</Text>
                  <Text className={styles.pickerItemInfo}>
                    📍 {formatDistance(treasure.distance)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View
            style={{
              textAlign: 'center',
              padding: '32rpx 0',
              color: '#B2BEC3',
              fontSize: '24rpx',
            }}
          >
            所有宝藏都已加入路线啦~
          </View>
        )}
      </View>

      <View style={{ height: '40rpx' }}></View>

      <View className={styles.bottomBar}>
        <View className={styles.cancelBtn} onClick={handleCancel}>
          <Text>取消</Text>
        </View>
        <View
          className={classnames(
            styles.saveBtn,
            routeTreasures.length < 2 && styles.disabled
          )}
          onClick={handleSave}
        >
          <Text>保存路线</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RouteEditPage;
