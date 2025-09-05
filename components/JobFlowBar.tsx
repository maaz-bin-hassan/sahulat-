import React from 'react';
import { View } from 'react-native';
import { useJobFlowStore } from '../store/jobFlowStore';
import { COLORS, SIZES, SPACING } from '../theme';
import { ICONS } from '../config';
import DynamicIconButton from './DynamicIconButton';

interface JobFlowBarProps {
  onAttachmentPress?: () => void;
  onPricingPress?: () => void;
  onLocationPress?: () => void;
  onAskingPress?: () => void;
  onDonePress?: () => void;
}

interface IconConfig {
  key: string;
  icon: any;
  size: number;
  onPress?: () => void;
  isActive?: boolean;
  marginRight?: number;
}

const JobFlowBar: React.FC<JobFlowBarProps> = ({
  onAttachmentPress,
  onPricingPress,
  onLocationPress,
  onAskingPress,
  onDonePress,
}) => {
  const { activeStep, setActiveStep } = useJobFlowStore();

  const handlePress = (step: 'asking' | 'attachment' | 'location' | 'pricing' | 'done', customHandler?: () => void) => {
    setActiveStep(step);
    customHandler?.();
  };

  const createIconButton = (config: IconConfig) => (
    <DynamicIconButton
      key={config.key}
      iconSource={config.icon}
      onPress={config.onPress || (() => {})}
      size={config.size}
      text=""
      showTextOnChatScreen={false}
      showTextOnUploadScreen={false}
      defaultBackgroundColor={config.isActive ? COLORS.primary : COLORS.neutral}
      uploadScreenBackgroundColor={config.isActive ? COLORS.primary : COLORS.neutral}
      tintColor={config.isActive ? COLORS.textLight : COLORS.textDark}
      uploadScreenTintColor={config.isActive ? COLORS.textLight : COLORS.textDark}
      containerStyle={config.marginRight ? { marginRight: config.marginRight } : undefined}
    />
  );

  const getLeftButtons = () => {
    const buttonConfigs: IconConfig[] = [];

    switch (activeStep) {
      case 'asking':
        buttonConfigs.push(
          { key: "attachment", icon: ICONS.attachment, size: SIZES.iconSmall, onPress: () => handlePress('attachment', onAttachmentPress), marginRight: SPACING.md },
          { key: "pricing", icon: ICONS.pricing, size: SIZES.iconMedium, onPress: () => handlePress('pricing', onPricingPress) }
        );
        break;
      case 'attachment':
        buttonConfigs.push(
          { key: "asking", icon: ICONS.thinkingEmoji, size: SIZES.iconMedium, onPress: () => handlePress('asking', onAskingPress), isActive: true, marginRight: SPACING.md },
          { key: "pricing", icon: ICONS.pricing, size: SIZES.iconMedium, onPress: () => handlePress('pricing', onPricingPress) }
        );
        break;
      case 'location':
      case 'pricing':
      case 'done':
        buttonConfigs.push(
          { key: "asking", icon: ICONS.thinkingEmoji, size: SIZES.iconMedium, onPress: () => handlePress('asking', onAskingPress), isActive: true, marginRight: SPACING.md },
          { key: "attachment", icon: ICONS.attachment, size: SIZES.iconSmall, onPress: () => handlePress('attachment', onAttachmentPress), isActive: true }
        );
        break;
    }

    return buttonConfigs.map(createIconButton);
  };

  const getRightButtons = () => {
    const buttonConfigs: IconConfig[] = [];

    switch (activeStep) {
      case 'asking':
      case 'attachment':
        buttonConfigs.push(
          { key: "location", icon: ICONS.location, size: SIZES.iconSmall, onPress: () => handlePress('location', onLocationPress), marginRight: SPACING.md },
          { key: "done", icon: ICONS.done, size: SIZES.iconMedium, onPress: () => handlePress('done', onDonePress) }
        );
        break;
      case 'location':
        buttonConfigs.push(
          { key: "pricing", icon: ICONS.pricing, size: SIZES.iconMedium, onPress: () => handlePress('pricing', onPricingPress), marginRight: SPACING.md },
          { key: "done", icon: ICONS.done, size: SIZES.iconMedium, onPress: () => handlePress('done', onDonePress) }
        );
        break;
      case 'pricing':
        buttonConfigs.push(
          { key: "location", icon: ICONS.location, size: SIZES.iconSmall, onPress: () => handlePress('location', onLocationPress), isActive: true, marginRight: SPACING.md },
          { key: "done", icon: ICONS.done, size: SIZES.iconMedium, onPress: () => handlePress('done', onDonePress) }
        );
        break;
      case 'done':
        buttonConfigs.push(
          { key: "location", icon: ICONS.location, size: SIZES.iconSmall, onPress: () => handlePress('location', onLocationPress), isActive: true, marginRight: SPACING.md },
          { key: "pricing", icon: ICONS.pricing, size: SIZES.iconMedium, onPress: () => handlePress('pricing', onPricingPress), isActive: true }
        );
        break;
    }

    return buttonConfigs.map(createIconButton);
  };

  const getCenterContent = () => {
    switch (activeStep) {
      case 'asking':
        return {
          icon: ICONS.thinkingEmoji,
          text: 'Asking problem',
          size: SIZES.iconMedium,
          onPress: () => handlePress('asking', onAskingPress),
        };
      case 'attachment':
        return {
          icon: ICONS.attachment,
          text: 'Attach Photo/Files',
          size: SIZES.iconSmall,
          onPress: () => handlePress('attachment', onAttachmentPress),
        };
      case 'location':
        return {
          icon: ICONS.location,
          text: 'Decide location',
          size: SIZES.iconSmall,
          onPress: () => handlePress('location', onLocationPress),
        };
      case 'pricing':
        return {
          icon: ICONS.pricing,
          text: 'Set Budget',
          size: SIZES.iconMedium,
          onPress: () => handlePress('pricing', onPricingPress),
        };
      case 'done':
        return {
          icon: ICONS.done,
          text: 'Find Workers',
          size: SIZES.iconMedium,
          onPress: () => handlePress('done', onDonePress),
        };
      default:
        return null;
    }
  };

  const centerContent = getCenterContent();
  if (!centerContent) return null;

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: 10,
    }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        marginRight: SPACING.lg,
      }}>
        {getLeftButtons()}
      </View>

      <DynamicIconButton
        iconSource={centerContent.icon}
        onPress={centerContent.onPress}
        size={centerContent.size}
        text={centerContent.text}
        showTextOnChatScreen={true}
        showTextOnUploadScreen={centerContent.text === 'Attach Photo/Files'}
        defaultBackgroundColor="rgba(0, 128, 128, 0.7)"
        uploadScreenBackgroundColor="rgba(0, 128, 128, 0.7)"
        tintColor={COLORS.textLight}
        uploadScreenTintColor={COLORS.textLight}
        boldText={true}
          containerStyle={{
            minWidth: 100,
            maxWidth: 200,
            height: 43,
            flexGrow: 1,
            flexShrink: 1,
            alignSelf: 'center',
            transform: [{ rotate: '0deg' }],
            opacity: 1
          }}
      />

      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        marginLeft: SPACING.lg,
      }}>
        {getRightButtons()}
      </View>
    </View>
  );
};

export default JobFlowBar;
