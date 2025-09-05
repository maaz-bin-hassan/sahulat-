import { create } from 'zustand';

type JobFlowStep = 'asking' | 'attachment' | 'location' | 'pricing' | 'done';

interface JobFlowState {
  activeStep: JobFlowStep;
  setActiveStep: (step: JobFlowStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const stepOrder: JobFlowStep[] = ['asking', 'attachment', 'location', 'pricing', 'done'];

export const useJobFlowStore = create<JobFlowState>((set, get) => ({
  activeStep: 'asking',
  
  setActiveStep: (step: JobFlowStep) => set({ activeStep: step }),
  
  goToNextStep: () => {
    const { activeStep } = get();
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex < stepOrder.length - 1) {
      set({ activeStep: stepOrder[currentIndex + 1] });
    }
  },
  
  goToPreviousStep: () => {
    const { activeStep } = get();
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex > 0) {
      set({ activeStep: stepOrder[currentIndex - 1] });
    }
  },
}));
