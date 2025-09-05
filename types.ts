import { ImageSourcePropType } from 'react-native';

export interface Message {
  id: number;
  text: string;
  type: 'sent' | 'received';
  quickReplies?: string[];
  imagePicker?: boolean;
}

export interface IconConfig {
  attachment: ImageSourcePropType;
  pricing: ImageSourcePropType;
  thinkingEmoji: ImageSourcePropType;
  location: ImageSourcePropType;
  done: ImageSourcePropType;
  wipeout: ImageSourcePropType;
  upload: ImageSourcePropType;
}

export interface TextConfig {
  headerTitle: string;
  askingProblem: string;
  typePlaceholder: string;
  wipeoutConfirmation: string;
  yes: string;
  no: string;
  uploadText: string;
}

export interface Colors {
  primary: string;
  secondary: string;
  neutral: string;
  border: string;
  textDark: string;
  textLight: string;
  background: string;
  inputBorder: string;
  modalOverlay: string;
}

export interface Fonts {
  regular: string;
  bold: string;
}

export interface Sizes {
  iconSmall: number;
  iconMedium: number;
  iconLarge: number;
  headerHeight: number;
  inputHeight: number;
  borderRadius: number;
  modalBorderRadius: number;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}
