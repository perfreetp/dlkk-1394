import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface TagProps {
  text: string;
  type?: 'primary' | 'rain' | 'family' | 'new' | 'free' | 'default';
  size?: 'small' | 'medium';
}

const Tag: React.FC<TagProps> = ({ text, type = 'default', size = 'small' }) => {
  return (
    <View
      className={classnames(
        styles.tag,
        styles[`tag-${type}`],
        styles[`tag-${size}`]
      )}
    >
      <Text className={styles.tagText}>{text}</Text>
    </View>
  );
};

export default Tag;
