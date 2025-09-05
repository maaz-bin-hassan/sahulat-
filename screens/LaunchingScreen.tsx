import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { COLORS, SIZES, SPACING, FONTS } from '../theme';

interface LaunchingScreenProps {
  visible: boolean;
  onClose: () => void;
}

const LaunchingScreen: React.FC<LaunchingScreenProps> = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.mainText}>Finding Experts</Text>
          <Text style={styles.mainText}>&</Text>
          <Text style={styles.mainText}>Launching Job</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  mainText: {
    fontSize: 32,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: SPACING.xs,
  },
});

export default LaunchingScreen;
