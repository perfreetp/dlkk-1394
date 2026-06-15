import React, { useState } from 'react';
import { View, Text, Input, Textarea, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

type FeedbackType = 'error' | 'suggest' | 'shop' | 'other';

const typeList: Array<{ key: FeedbackType; label: string; icon: string }> = [
  { key: 'error', label: '信息错误', icon: '❌' },
  { key: 'suggest', label: '功能建议', icon: '💡' },
  { key: 'shop', label: '新地点推荐', icon: '📍' },
  { key: 'other', label: '其他问题', icon: '📝' },
];

const FeedbackPage: React.FC = () => {
  const router = useRouter();
  const initialType = (router.params.type as FeedbackType) || 'suggest';

  const [feedbackType, setFeedbackType] = useState<FeedbackType>(initialType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title.trim().length > 0 && content.trim().length >= 10 && !submitting;

  const handleChooseImage = () => {
    if (images.length >= 3) {
      Taro.showToast({ title: '最多上传3张图片', icon: 'none' });
      return;
    }
    Taro.chooseImage({
      count: 3 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFilePaths || [];
        setImages([...images, ...newImages]);
      },
      fail: () => {
        const fallbackUrl = `https://picsum.photos/400/400?random=${Date.now()}`;
        setImages([...images, fallbackUrl]);
        Taro.showToast({ title: '已使用示例图片', icon: 'none' });
      },
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      if (title.trim().length === 0) {
        Taro.showToast({ title: '请填写标题', icon: 'none' });
      } else if (content.trim().length < 10) {
        Taro.showToast({ title: '内容至少10个字', icon: 'none' });
      }
      return;
    }

    setSubmitting(true);
    console.log('[FeedbackPage] 提交反馈:', {
      type: feedbackType,
      title,
      content,
      images,
      contact,
    });

    setTimeout(() => {
      setSubmitting(false);
      Taro.showModal({
        title: '提交成功 🎉',
        content: '感谢您的反馈，我们会认真处理！\n一般会在1-3个工作日内回复您。',
        showCancel: false,
        confirmText: '好的',
        success: () => {
          Taro.navigateBack();
        },
      });
    }, 800);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>反馈与纠错</Text>
        <Text className={styles.headerDesc}>
          有任何问题或建议？告诉我们，让宝藏地图更完善~
        </Text>
      </View>

      <View className={styles.form}>
        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📋</Text>
            反馈类型
          </Text>
          <View className={styles.typeGrid}>
            {typeList.map((item) => (
              <View
                key={item.key}
                className={classnames(
                  styles.typeItem,
                  feedbackType === item.key && styles.typeItemActive,
                )}
                onClick={() => setFeedbackType(item.key)}
              >
                <Text className={styles.typeIcon}>{item.icon}</Text>
                <Text className={styles.typeLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>✏️</Text>
            详细描述
          </Text>

          <Text className={styles.inputLabel}>
            标题<Text className={styles.inputRequired}>*</Text>
          </Text>
          <Input
            className={styles.titleInput}
            placeholder="简单概括您的问题或建议"
            placeholderStyle="color: #B2BEC3"
            maxlength={30}
            value={title}
            onInput={(e) => setTitle(e.detail.value)}
          />

          <Text className={styles.inputLabel}>
            详细内容<Text className={styles.inputRequired}>*</Text>
          </Text>
          <Textarea
            className={styles.contentInput}
            placeholder="请详细描述（至少10字）\n例如：XX咖啡馆营业时间已变更为10:00-22:00"
            placeholderStyle="color: #B2BEC3"
            maxlength={500}
            value={content}
            onInput={(e) => setContent(e.detail.value)}
          />
          <View className={styles.charCount}>{content.length} / 500</View>

          <View className={styles.imageSection}>
            <Text className={styles.inputLabel}>上传图片（可选，最多3张）</Text>
            <View className={styles.imageList}>
              {images.map((img, index) => (
                <View key={index} className={styles.imageItem}>
                  <Image className={styles.imagePreview} src={img} mode="aspectFill" />
                  <View
                    className={styles.imageRemove}
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </View>
                </View>
              ))}
              {images.length < 3 && (
                <View className={styles.imageAdd} onClick={handleChooseImage}>
                  <Text className={styles.imageAddIcon}>+</Text>
                  <Text className={styles.imageAddText}>添加图片</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📬</Text>
            联系方式（可选）
          </Text>
          <Input
            className={styles.contactInput}
            placeholder="留下邮箱或微信，方便我们回复您"
            placeholderStyle="color: #B2BEC3"
            maxlength={50}
            value={contact}
            onInput={(e) => setContact(e.detail.value)}
          />
          <Text className={styles.contactHint}>
            您的联系方式仅用于反馈回复，我们会严格保密
          </Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(
            styles.submitBtn,
            !canSubmit && styles.submitBtnDisabled,
          )}
          onClick={handleSubmit}
        >
          <Text className={styles.btnIcon}>{submitting ? '⏳' : '📮'}</Text>
          <Text>{submitting ? '提交中...' : '提交反馈'}</Text>
        </View>
      </View>
    </View>
  );
};

export default FeedbackPage;
