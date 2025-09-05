import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS, SIZES, SPACING } from '../theme';

interface InputBarProps {
  placeholder?: string;
  onSend?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  backgroundColor?: string;
  borderColor?: string;
}

const InputBar: React.FC<InputBarProps> = ({ 
  placeholder = "Type your reply...",
  onSend,
  value,
  onChangeText,
  backgroundColor = COLORS.background,
  borderColor = COLORS.border
}) => {
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: 1,
      borderColor,
      padding: 10,
      backgroundColor,
    }}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: COLORS.inputBorder,
          borderRadius: SIZES.borderRadius,
          height: SIZES.inputHeight,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          fontFamily: FONTS.regular,
          fontSize: 15,
          backgroundColor: COLORS.background,
          textAlignVertical: "center",
        }}
      />
      <TouchableOpacity 
        style={{ marginLeft: 10 }}
        onPress={onSend}
      >
        <View style={{
          backgroundColor: COLORS.background,
          borderRadius: SIZES.borderRadius,
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: COLORS.inputBorder,
        }}>
          <MaterialIcons name="more-vert" size={SIZES.iconSmall} color={COLORS.textDark} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default InputBar;
