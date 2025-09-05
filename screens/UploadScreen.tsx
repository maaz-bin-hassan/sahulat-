import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, SIZES, SPACING } from '../theme';
import { ICONS, TEXTS } from '../config';
import { useUploadStore } from '../store/uploadStore';
import { useJobFlowStore } from '../store/jobFlowStore';
import DynamicIconButton from '../components/DynamicIconButton';
import JobFlowBar from '../components/JobFlowBar';

const { width, height } = Dimensions.get('window');
const CAMERA_BOX_SIZE = width * 0.8; // 80% of screen width

const UploadScreen: React.FC = () => {
  const { 
    isUploadScreenVisible, 
    selectedImages, 
    hideUploadScreen, 
    addImage,
    removeImage,
    setCurrentScreen
  } = useUploadStore();

  const { setActiveStep } = useJobFlowStore();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const cameraRef = useRef<CameraView>(null);

  // Set screen state to 'upload' after modal starts opening to prevent flash
  useEffect(() => {
    if (isUploadScreenVisible) {
      const timer = setTimeout(() => {
        setCurrentScreen('upload');
        setActiveStep('attachment'); // Set job flow to attachment step
      }, 100); // Small delay to allow modal animation to start
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isUploadScreenVisible, setCurrentScreen, setActiveStep]);

  const requestPermissions = async () => {
    try {
      if (!permission?.granted) {
        const response = await requestPermission();
        if (!response.granted) {
          Alert.alert(
            'Permissions Required', 
            'Sorry, we need camera permissions to make this work!'
          );
          return false;
        }
      }
      
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (mediaStatus !== 'granted') {
        Alert.alert(
          'Permissions Required', 
          'Sorry, we need photo library permissions to access your photos!'
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
      return false;
    }
  };

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        
        if (photo?.uri) {
          addImage(photo.uri);
        }
      }
    } catch (error) {
      console.log('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        result.assets.forEach(asset => {
          addImage(asset.uri);
        });
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleClose = () => {
    hideUploadScreen();
  };

  useEffect(() => {
    if (isUploadScreenVisible) {
      requestPermissions();
    }
  }, [isUploadScreenVisible]);

  return (
    <Modal
      visible={isUploadScreenVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Files</Text>
        </View>

        {/* Job Flow Bar */}
        <JobFlowBar
          onAttachmentPress={pickImage}
          onPricingPress={() => {}}
          onLocationPress={() => {}}
          onAskingPress={() => {}}
          onDonePress={() => {}}
        />

        {/* Camera Section */}
        <View style={styles.cameraSection}>
          <View style={[styles.cameraBox, { borderColor: COLORS.primary }]}>
            {permission?.granted ? (
              <>
                <CameraView 
                  style={styles.camera} 
                  facing={facing}
                  ref={cameraRef}
                />
                {/* Camera controls overlay - moved outside CameraView */}
                <View style={styles.cameraOverlay}>
                  <View style={[styles.focusSquare, { borderColor: COLORS.primary }]} />
                  
                  {/* Camera controls overlay */}
                  <TouchableOpacity 
                    style={styles.flipCameraButton}
                    onPress={toggleCameraFacing}
                  >
                    <MaterialIcons name="flip-camera-ios" size={30} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.cameraPlaceholder}>
                <MaterialIcons name="camera-alt" size={60} color={COLORS.primary} />
                <Text style={styles.cameraPlaceholderText}>Camera permission required</Text>
                <TouchableOpacity 
                  style={[styles.permissionButton, { backgroundColor: COLORS.primary }]}
                  onPress={requestPermissions}
                >
                  <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Capture Button */}
          <TouchableOpacity 
            style={[styles.captureButton, { backgroundColor: COLORS.primary }]}
            onPress={takePicture}
            disabled={!permission?.granted}
          >
            <View style={[styles.captureButtonInner, { opacity: permission?.granted ? 1 : 0.5 }]} />
          </TouchableOpacity>

          {/* Selected Images - Right below capture button */}
          {selectedImages.length > 0 && (
            <View style={styles.selectedImagesSection}>
              <Text style={styles.selectedImagesTitle}>Selected Images ({selectedImages.length})</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.selectedImagesScroll}
              >
                {selectedImages.map((imageUri, index) => (
                  <View key={index} style={styles.selectedImageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(imageUri)}
                    >
                      <MaterialIcons name="close" size={18} color={COLORS.textLight} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
            onPress={pickImage}
          >
            <MaterialIcons name="photo-library" size={24} color={COLORS.primary} />
            <Text style={[styles.actionButtonText, { color: COLORS.primary }]}>
              Gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.doneButton, { backgroundColor: COLORS.primary }]}
            onPress={handleClose}
          >
            <Image 
              source={ICONS.done} 
              style={{ 
                width: 32, 
                height: 32, 
                tintColor: COLORS.textLight 
              }} 
              resizeMode="contain" 
            />
            <Text style={[styles.doneButtonText, { color: COLORS.textLight }]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    position: 'absolute',
    left: SPACING.lg,
    top: 50,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1.2, // Increased from flex: 1 to give more space for text
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
  },
  attachmentButton: {
    backgroundColor: COLORS.neutral,
  },
  iconOnlyButton: {
    width: SIZES.iconLarge,
    height: SIZES.iconLarge,
    borderRadius: SIZES.iconLarge / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentButtonWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius + 4,
    paddingHorizontal: 12,
    paddingVertical: SPACING.xs + 2,
  },
  attachmentButtonText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontFamily: FONTS.regular,
    fontWeight: '600',
  },
  cameraSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  cameraBox: {
    width: CAMERA_BOX_SIZE,
    height: CAMERA_BOX_SIZE,
    borderWidth: 3,
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusSquare: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 8,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    position: 'relative',
  },
  cameraPlaceholderText: {
    marginTop: SPACING.sm,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: SIZES.borderRadius,
    minWidth: 120,
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: SPACING.sm,
    fontSize: 16,
    fontFamily: FONTS.regular,
    fontWeight: '600',
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: SIZES.borderRadius,
    minWidth: 140,
    justifyContent: 'center',
  },
  doneButtonText: {
    marginLeft: SPACING.sm,
    fontSize: 18,
    fontFamily: FONTS.regular,
    fontWeight: '700',
  },
  selectedImagesSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  selectedImagesTitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  selectedImagesScroll: {
    maxHeight: 100,
  },
  selectedImageContainer: {
    position: 'relative',
    marginRight: SPACING.sm,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.borderRadius,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipCameraButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.borderRadius,
    marginTop: SPACING.md,
  },
  permissionButtonText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontFamily: FONTS.regular,
    fontWeight: '600',
  },
});

export default UploadScreen;
