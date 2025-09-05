import React from 'react';
import { View, TouchableOpacity, Image, Text, ImageSourcePropType } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../theme';

interface AskingButtonProps {
  onPress?: () => void;
  text?: string;
  iconSource: ImageSourcePropType;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
}

const AskingButton: React.FC<AskingButtonProps> = ({ 
  onPress, 
  text = "Asking problem",
  iconSource,
  backgroundColor = COLORS.primary,
  textColor = COLORS.textLight,
  fontSize = 12
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor,
        borderRadius: SIZES.borderRadius + 4,
        paddingHorizontal: 10,
        paddingVertical: SPACING.xs + 2,
      }}>
        <Image
          source={iconSource}
          style={{
            width: SIZES.iconSmall + 2,
            height: SIZES.iconSmall + 2,
            tintColor: textColor,
            marginRight: SPACING.xs + 2,
          }}
        />
        <Text style={{
          color: textColor,
          fontSize,
          fontFamily: FONTS.bold,
          fontWeight: "700",
        }}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AskingButton;
