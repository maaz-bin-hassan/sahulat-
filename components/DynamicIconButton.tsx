import React from 'react';
import { View, TouchableOpacity, Image, Text, ImageSourcePropType, ViewStyle, ImageStyle } from 'react-native';
import { COLORS, SIZES, SPACING, FONTS } from '../theme';
import { useUploadStore } from '../store/uploadStore';

interface DynamicIconButtonProps {
  iconSource: ImageSourcePropType;
  onPress?: () => void;
  size?: number;
  text?: string;
  showTextOnChatScreen?: boolean;
  showTextOnUploadScreen?: boolean;
  showIconOnlyOnUploadScreen?: boolean;
  defaultBackgroundColor?: string;
  uploadScreenBackgroundColor?: string;
  tintColor?: string;
  uploadScreenTintColor?: string;
  containerStyle?: ViewStyle;
  iconStyle?: ImageStyle;
  boldText?: boolean;
}

const DynamicIconButton: React.FC<DynamicIconButtonProps> = ({ 
  iconSource, 
  onPress, 
  size = SIZES.iconMedium, 
  text,
  showTextOnChatScreen = false,
  showTextOnUploadScreen = false,
  showIconOnlyOnUploadScreen = false,
  defaultBackgroundColor = COLORS.neutral,
  uploadScreenBackgroundColor = COLORS.primary,
  tintColor = COLORS.textDark,
  uploadScreenTintColor = COLORS.textLight,
  containerStyle = {},
  iconStyle = {},
  boldText = false
}) => {
  const { currentScreen } = useUploadStore();
  const isUploadScreen = currentScreen === 'upload';

  const backgroundColor = isUploadScreen ? uploadScreenBackgroundColor : defaultBackgroundColor;
  const iconTintColor = isUploadScreen ? uploadScreenTintColor : tintColor;
  
  const shouldShowText = isUploadScreen ? showTextOnUploadScreen : showTextOnChatScreen;
  const shouldShowIconOnly = isUploadScreen ? showIconOnlyOnUploadScreen : false;

  const getContainerStyle = (): ViewStyle => {
    if (shouldShowIconOnly) {
      return {
        width: SIZES.iconLarge,
        height: SIZES.iconLarge,
        borderRadius: SIZES.iconLarge / 2,
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      };
    }

    if (shouldShowText) {
      return {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor,
        borderRadius: SIZES.borderRadius + 4,
        paddingHorizontal: 16,
        paddingVertical: SPACING.xs + 2,
        minWidth: 120,
      };
    }

    return {
      width: SIZES.iconLarge,
      height: SIZES.iconLarge,
      borderRadius: SIZES.iconLarge / 2,
      backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
    };
  };

  const getIconStyle = (): ImageStyle => {
    const baseStyle = {
      width: size,
      height: size,
      tintColor: iconTintColor,
    };

    if (shouldShowText) {
      return {
        ...baseStyle,
        marginRight: SPACING.xs,
      };
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[getContainerStyle(), containerStyle]}>
        <Image 
          source={iconSource} 
          style={[getIconStyle(), iconStyle]} 
          resizeMode="contain" 
        />
        {shouldShowText && (
          <Text style={{
            color: iconTintColor,
            fontSize: 12,
            fontFamily: boldText ? FONTS.bold : FONTS.regular,
            fontWeight: boldText ? 'bold' : '600',
          }}>
            {text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default DynamicIconButton;
