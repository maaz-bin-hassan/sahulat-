import React from 'react';
import { View, Text, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../theme';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  onRightPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  backgroundColor?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Post Job", 
  onBackPress, 
  onRightPress, 
  leftIcon, 
  rightIcon,
  backgroundColor = COLORS.background 
}) => {
  return (
    <View style={{
      height: SIZES.headerHeight,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: SPACING.md,
      backgroundColor,
    }}>
      <Text style={{ 
        fontFamily: FONTS.regular, 
        fontSize: 18, 
        fontWeight: "600", 
        lineHeight: SIZES.headerHeight 
      }}>
        {title}
      </Text>
      
      {leftIcon && (
        <View style={{ 
          position: "absolute", 
          left: 15, 
          justifyContent: "center", 
          height: "100%" 
        }}>
          <TouchableOpacity onPress={onBackPress}>
            {leftIcon}
          </TouchableOpacity>
        </View>
      )}
      
      {rightIcon && (
        <View style={{ 
          position: "absolute", 
          right: 15, 
          flexDirection: "row", 
          alignItems: "center" 
        }}>
          <TouchableOpacity onPress={onRightPress}>
            {rightIcon}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;
