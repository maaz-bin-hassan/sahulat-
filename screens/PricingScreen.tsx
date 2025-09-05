import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, SPACING, FONTS } from '../theme';
import { useJobFlowStore } from '../store/jobFlowStore';

interface PricingScreenProps {
  visible: boolean;
  onClose: () => void;
  onPriceSelect: (price: string) => void;
}

const PricingScreen: React.FC<PricingScreenProps> = ({ visible, onClose, onPriceSelect }) => {
  const [enteredPrice, setEnteredPrice] = useState<string>("");
  const quickPrices = ["500", "1000", "1500"];
  
  const { setActiveStep } = useJobFlowStore();

  useEffect(() => {
    if (visible) {
      setActiveStep('pricing');
    }
  }, [visible, setActiveStep]);

  const handleNumberPress = (number: string) => {
    if (enteredPrice.length < 6) {
      setEnteredPrice(prev => prev + number);
    }
  };

  const handleDelete = () => {
    setEnteredPrice(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setEnteredPrice("");
  };

  const handleConfirm = () => {
    if (enteredPrice) {
      onPriceSelect(enteredPrice);
      setEnteredPrice("");
      onClose();
    }
  };

  const handleQuickPrice = (price: string) => {
    onPriceSelect(price);
    setEnteredPrice("");
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
        <View style={styles.priceDisplayContainer}>
          <Text style={styles.currencyLabel}>RS</Text>
          <Text style={styles.priceDisplay}>
            {enteredPrice || "0"}
          </Text>
        </View>

        <View style={styles.quickPricesContainer}>
          <View style={styles.quickPricesRow}>
            {quickPrices.map((price) => (
              <TouchableOpacity
                key={price}
                style={styles.quickPriceButton}
                onPress={() => handleQuickPrice(price)}
              >
                <Text style={styles.quickPriceText}>{price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.numpadContainer}>
          <View style={styles.numpadGrid}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
              ['clear', '0', 'delete']
            ].map((row, rowIndex) => (
              <View key={rowIndex} style={styles.numpadRow}>
                {row.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.numpadButton}
                    onPress={() => {
                      if (item === 'clear') {
                        handleClear();
                      } else if (item === 'delete') {
                        handleDelete();
                      } else {
                        handleNumberPress(item);
                      }
                    }}
                  >
                    {item === 'delete' ? (
                      <Ionicons name="backspace" size={20} color="#FFFFFF" />
                    ) : (
                      <Text style={[
                        styles.numpadButtonText,
                        item === 'clear' && styles.clearButtonText
                      ]}>
                        {item === 'clear' ? 'Clear' : item}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[
              styles.confirmButton,
              { backgroundColor: enteredPrice ? COLORS.textLight : COLORS.neutral }
            ]}
            onPress={handleConfirm}
            disabled={!enteredPrice}
          >
            <Text style={[
              styles.confirmButtonText,
              { color: enteredPrice ? COLORS.primary : COLORS.textDark }
            ]}>
              Confirm Budget
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '60%',
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: SIZES.modalBorderRadius,
    borderTopRightRadius: SIZES.modalBorderRadius,
    paddingTop: SPACING.lg,
  },
  priceDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  currencyLabel: {
    fontSize: 24,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontWeight: '600',
    marginRight: SPACING.md,
  },
  priceDisplay: {
    fontSize: 36,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontWeight: '700',
    minWidth: 120,
    textAlign: 'center',
  },
  quickPricesContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    justifyContent: 'center',
  },
  quickPricesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  quickPriceButton: {
    backgroundColor: COLORS.textLight,
    borderRadius: 15,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  quickPriceText: {
    color: COLORS.textDark,
    fontSize: 12,
    fontFamily: FONTS.regular,
    fontWeight: '600',
  },
  numpadContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    minHeight: 280,
  },
  numpadGrid: {
    maxWidth: 280,
    alignSelf: 'center',
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  numpadButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {},
  deleteButton: {},
  numpadButtonText: {
    fontSize: 20,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  clearButtonText: {
    fontSize: 14,
  },
  bottomContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  confirmButton: {
    paddingVertical: SPACING.md,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    fontWeight: '600',
  },
});

export default PricingScreen;
