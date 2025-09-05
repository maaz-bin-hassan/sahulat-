import { ImageSourcePropType } from 'react-native';
import { IconConfig, TextConfig } from './types';

export const ICONS: IconConfig = {
  attachment: require('./assets/attachment.png') as ImageSourcePropType,
  pricing: require('./assets/pricing.png') as ImageSourcePropType,
  thinkingEmoji: require('./assets/thinking-emoji.png') as ImageSourcePropType,
  location: require('./assets/location.png') as ImageSourcePropType,
  done: require('./assets/lets-icons_done-duotone.png') as ImageSourcePropType,
  wipeout: require('./assets/wipeout.png') as ImageSourcePropType,
  upload: require('./assets/upload.png') as ImageSourcePropType,
};

export const TEXTS: TextConfig = {
  headerTitle: "Post Job",
  askingProblem: "Asking problem",
  typePlaceholder: "Type your reply...",
  wipeoutConfirmation: "Would you like to start with new order?",
  yes: "YES",
  no: "NO",
  uploadText: "Upload Images/Files",
};
