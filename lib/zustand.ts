// useStore.ts
import { create } from 'zustand';

interface DriveData {
  capacity_bytes: number;
  dates: string;
  floor: number;
  model: string;
  serial_number: string;
  status: 'Anomalous' | 'Normal';
}

interface Store {
  // Modal state
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;

  // Period selection
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;

  // Drive data
  apiResponse: DriveData[];
  setApiResponse: (data: DriveData[]) => void;

  // Data loading states
  hasLoadedSavedData: boolean;
  setHasLoadedSavedData: (loaded: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  // Modal state
  isModalOpen: true,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

  // Period selection
  selectedPeriod: '',
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  // Drive data storage
  apiResponse: [],
  setApiResponse: (data) => set({ apiResponse: data }),

  // Data loading states
  hasLoadedSavedData: false,
  setHasLoadedSavedData: (loaded) => set({ hasLoadedSavedData: loaded }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));