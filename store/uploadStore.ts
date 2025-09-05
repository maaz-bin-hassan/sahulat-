import { create } from 'zustand';

interface UploadState {
  isUploadScreenVisible: boolean;
  selectedImages: string[];
  currentScreen: 'chat' | 'upload';
  selectedLocation: string;
  showUploadScreen: () => void;
  hideUploadScreen: () => void;
  setCurrentScreen: (screen: 'chat' | 'upload') => void;
  addImage: (imageUri: string) => void;
  removeImage: (imageUri: string) => void;
  clearImages: () => void;
  setLocation: (location: string) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  isUploadScreenVisible: false,
  selectedImages: [],
  currentScreen: 'chat',
  selectedLocation: '',
  
  showUploadScreen: () => set({ isUploadScreenVisible: true }),
  hideUploadScreen: () => set({ isUploadScreenVisible: false, currentScreen: 'chat' }),
  setCurrentScreen: (screen: 'chat' | 'upload') => set({ currentScreen: screen }),
  
  addImage: (imageUri: string) => 
    set((state) => ({ 
      selectedImages: [...state.selectedImages, imageUri] 
    })),
    
  removeImage: (imageUri: string) => 
    set((state) => ({ 
      selectedImages: state.selectedImages.filter(uri => uri !== imageUri) 
    })),
    
  clearImages: () => set({ selectedImages: [] }),
  
  setLocation: (location: string) => set({ selectedLocation: location }),
}));
