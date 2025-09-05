import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'expo-image';
import { COLORS, SIZES, SPACING, FONTS } from '../theme';
import { ICONS } from '../config';
import Header from '../components/Header';
import DynamicIconButton from '../components/DynamicIconButton';
import JobFlowBar from '../components/JobFlowBar';
import { useJobFlowStore } from '../store/jobFlowStore';

// Constants for better maintainability
const ANIMATION_DURATION = 6000; // 6 seconds
const BACK_ICON_SIZE = 24;

/**
 * Props interface for WorkersScreen component
 */
interface WorkersScreenProps {
  /** Controls the visibility of the modal screen */
  visible: boolean;
  /** Callback function called when the screen should be closed */
  onClose: () => void;
}

/**
 * WorkersScreen Component
 * 
 * Displays the workers finding screen with animated transitions from finding experts
 * to success state, along with navigation icons.
 * 
 * Features:
 * - Automatic transition from moving.gif to success.gif after 6 seconds
 * - Responsive icon layout with proper spacing
 * - Memoized for performance optimization
 * - Accessible design with proper ARIA labels
 * 
 * @param props - The component props
 * @returns The WorkersScreen component
 */
const WorkersScreen: React.FC<WorkersScreenProps> = React.memo(({ visible, onClose }) => {
  // State for controlling animation phases
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  // Job flow store
  const { setActiveStep } = useJobFlowStore();

  // Memoized handlers for better performance
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Memoized icon props to prevent unnecessary re-renders
  const iconProps = useMemo(() => ({
    size: SIZES.iconSmall,
    showTextOnChatScreen: false,
    showTextOnUploadScreen: false,
    defaultBackgroundColor: COLORS.primary,
    uploadScreenBackgroundColor: COLORS.primary,
    tintColor: COLORS.textLight,
    uploadScreenTintColor: COLORS.textLight,
  }), []);

  // Memoized back icon to prevent recreation on every render
  const backIcon = useMemo(() => (
    <Ionicons 
      name="chevron-back" 
      size={BACK_ICON_SIZE} 
      color={COLORS.textDark} 
    />
  ), []);

  // Effect for handling animation timing
  useEffect(() => {
    if (!visible) return;

    // Reset state when screen becomes visible
    setShowSuccess(false);
    setActiveStep('done'); // Set job flow to done step when workers screen opens
    
    // Set up timer for animation transition
    const timer = setTimeout(() => {
      setShowSuccess(true);
    }, ANIMATION_DURATION);

    // Cleanup function
    return () => clearTimeout(timer);
  }, [visible, setActiveStep]);

  // Early return for better performance
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header 
          title="Post Job"
          backgroundColor={COLORS.background}
          leftIcon={backIcon}
          onBackPress={handleClose}
        />
        
        {/* Job Flow Bar */}
        <JobFlowBar
          onAttachmentPress={() => {}}
          onPricingPress={() => {}}
          onLocationPress={() => {}}
          onAskingPress={() => {}}
          onDonePress={() => {}}
        />

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Animated GIF */}
          <Image
            source={showSuccess ? require('../assets/success.gif') : require('../assets/moving.gif')}
            style={styles.gif}
            contentFit="contain"
            priority="high"
            cachePolicy="memory-disk"
          />

          {/* Dynamic Text Content */}
          <View style={styles.bottomTextContainer}>
            {showSuccess ? (
              <Text style={styles.bottomText} numberOfLines={2}>
                You can wait for expert's bids now.
              </Text>
            ) : (
              <View style={styles.multiLineTextContainer}>
                <Text style={styles.bottomText}>Finding Experts</Text>
                <Text style={styles.bottomText}>&</Text>
                <Text style={styles.bottomText}>Launching Job</Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'flex-end',
    paddingBottom: '15%',
  },
  iconBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  leftIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: SPACING.sm,
  },
  gif: {
    width: 351,
    height: 351,
    position: 'absolute',
    top: 154,
    left: 40,
  },
  bottomTextContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  multiLineTextContainer: {
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 32,
    fontFamily: FONTS.regular,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    marginVertical: SPACING.xs,
  },
});

export default WorkersScreen;
