import React from 'react';
import { View, Modal, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '../theme';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  visible, 
  onClose, 
  title = "Confirmation",
  message = "Are you sure?",
  confirmText = "YES",
  cancelText = "NO",
  onConfirm,
  onCancel,
  confirmButtonColor = COLORS.primary,
  cancelButtonColor = COLORS.neutral
}) => {
  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.modalOverlay,
      }}>
        <View style={{
          backgroundColor: COLORS.background,
          borderRadius: SIZES.modalBorderRadius,
          padding: SPACING.xl,
          minWidth: 280,
          alignItems: 'center',
        }}>
          <Text style={{
            fontFamily: FONTS.bold,
            fontWeight: "700",
            fontSize: SIZES.modalBorderRadius,
            marginBottom: SPACING.md,
            textAlign: 'center',
          }}>
            {message}
          </Text>
          
          <View style={{ 
            flexDirection: "row", 
            marginTop: 10, 
            gap: 10 
          }}>
            <TouchableOpacity 
              style={{
                flex: 1,
                backgroundColor: confirmButtonColor,
                borderRadius: SIZES.borderRadius,
                paddingVertical: 10,
                alignItems: 'center',
              }}
              onPress={() => {
                onConfirm && onConfirm();
                onClose();
              }}
            >
              <Text style={{
                color: COLORS.textLight,
                fontFamily: FONTS.bold,
                fontWeight: "700",
                fontSize: 15,
              }}>
                {confirmText}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{
                flex: 1,
                backgroundColor: cancelButtonColor,
                borderRadius: SIZES.borderRadius,
                paddingVertical: 10,
                alignItems: 'center',
              }}
              onPress={() => {
                onCancel && onCancel();
                onClose();
              }}
            >
              <Text style={{
                color: COLORS.textDark,
                fontFamily: FONTS.bold,
                fontWeight: "700",
                fontSize: 15,
              }}>
                {cancelText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
