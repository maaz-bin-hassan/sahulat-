import React from 'react';
import { View, TouchableOpacity, Image, ImageSourcePropType, ViewStyle, ImageStyle } from 'react-native';
import { COLORS, SIZES } from '../theme';

interface IconButtonProps {
  iconSource: ImageSourcePropType;
  onPress?: () => void;
  size?: number;
  tintColor?: string;
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  iconStyle?: ImageStyle;
}

const IconButton: React.FC<IconButtonProps> = ({ 
  iconSource, 
  onPress, 
  size = SIZES.iconMedium, 
  tintColor = COLORS.textDark,
  backgroundColor = COLORS.neutral,
  containerStyle = {},
  iconStyle = {}
}) => {
  const defaultContainerStyle: ViewStyle = {
    width: SIZES.iconLarge,
    height: SIZES.iconLarge,
    borderRadius: SIZES.iconLarge / 2,
    backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const defaultIconStyle: ImageStyle = {
    width: size,
    height: size,
    tintColor,
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[defaultContainerStyle, containerStyle]}>
        <Image 
          source={iconSource} 
          style={[defaultIconStyle, iconStyle]} 
          resizeMode="contain" 
        />
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;
