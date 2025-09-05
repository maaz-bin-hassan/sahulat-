import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES, SPACING, FONTS } from '../theme';
import { useUploadStore } from '../store/uploadStore';

interface SummaryScreenProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ visible, onClose, onComplete }) => {
  const { selectedImages, removeImage, selectedLocation } = useUploadStore();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Electrical Installation",
    "Troubleshooting",
    "Safety Compliance",
    "Residential Work",
    "Commercial Work"
  ]);
  const [newTag, setNewTag] = useState<string>("");
  const [showAddTag, setShowAddTag] = useState<boolean>(false);
  const [summaryText, setSummaryText] = useState<string>(
    `We're looking for an experienced Electrician to install, repair, and maintain electrical systems in residential and commercial settings. The role involves troubleshooting issues, ensuring safety compliance, and delivering high-quality work. Ideal candidates have relevant certifications, strong technical skills, and a commitment to safety. Join us if you're passionate about delivering reliable electrical solutions! We're looking for an experienced Electrician to install, repair, and maintain electrical systems in residential and commercial settings. The role involves troubleshooting issues, ensuring safety compliance, and delivering high-quality work. Ideal candidates have relevant`
  );

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag("");
      setShowAddTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Summary</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {selectedImages.length > 0 && (
            <View style={styles.imagesContainer}>
              <Text style={styles.imagesTitle}>Attached Photos ({selectedImages.length})</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.imagesScroll}
                contentContainerStyle={styles.imagesScrollContent}
              >
                {selectedImages.map((imageUri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.summaryImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(imageUri)}
                    >
                      <MaterialIcons name="close" size={16} color={COLORS.textLight} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {selectedLocation && (
            <View style={styles.locationContainer}>
              <Text style={styles.locationTitle}>Job Location</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                <Text style={styles.locationText}>{selectedLocation}</Text>
              </View>
            </View>
          )}

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Job Description</Text>
            <TextInput
              style={styles.summaryTextInput}
              value={summaryText}
              onChangeText={setSummaryText}
              multiline={true}
              textAlignVertical="top"
              placeholder="Enter job description..."
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.tagsContainer}>
            <Text style={styles.tagsTitle}>Relevant Tags</Text>
            
            <View style={styles.tagsGrid}>
              {selectedTags.map((tag, index) => (
                <View key={index} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity 
                    onPress={() => handleRemoveTag(tag)}
                    style={styles.removeTagButton}
                  >
                    <Ionicons name="close" size={16} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {showAddTag ? (
              <View style={styles.addTagContainer}>
                <TextInput
                  style={styles.addTagInput}
                  placeholder="Enter new tag..."
                  value={newTag}
                  onChangeText={setNewTag}
                  onSubmitEditing={handleAddTag}
                  autoFocus
                />
                <TouchableOpacity 
                  onPress={handleAddTag}
                  style={styles.addTagConfirmButton}
                >
                  <Ionicons name="checkmark" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setShowAddTag(false);
                    setNewTag("");
                  }}
                  style={styles.addTagCancelButton}
                >
                  <Ionicons name="close" size={20} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addTagButton}
                onPress={() => setShowAddTag(true)}
              >
                <Ionicons name="add" size={24} color={COLORS.primary} />
                <Text style={styles.addTagButtonText}>Add Tag</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.doneButton} onPress={handleComplete}>
            <Ionicons name="checkmark" size={24} color={COLORS.textLight} />
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  summaryContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  summaryTextInput: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
    lineHeight: 24,
    textAlign: 'justify',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    minHeight: 120,
    backgroundColor: COLORS.background,
  },
  imagesContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  imagesTitle: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  imagesScroll: {
    flexGrow: 0,
  },
  imagesScrollContent: {
    paddingRight: SPACING.lg,
  },
  imageContainer: {
    position: 'relative',
    marginRight: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryImage: {
    width: 100,
    height: 100,
    borderRadius: SIZES.borderRadius + 4,
    backgroundColor: COLORS.neutral,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  locationContainer: {
    marginBottom: SPACING.xl,
  },
  locationTitle: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: SIZES.borderRadius,
  },
  locationText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  tagsContainer: {
    marginBottom: SPACING.xl,
  },
  tagsTitle: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.textDark,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tagText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginRight: SPACING.xs,
  },
  removeTagButton: {
    padding: 2,
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignSelf: 'flex-start',
  },
  addTagButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginLeft: SPACING.xs,
  },
  addTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  addTagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginRight: SPACING.sm,
  },
  addTagConfirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    padding: SPACING.sm,
    marginRight: SPACING.xs,
  },
  addTagCancelButton: {
    backgroundColor: COLORS.neutral,
    borderRadius: SIZES.borderRadius,
    padding: SPACING.sm,
  },
  bottomContainer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius,
    paddingVertical: SPACING.md,
  },
  doneButtonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontFamily: FONTS.regular,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
});

export default SummaryScreen;
