import { create } from 'zustand';
import { UserProfile, UserRole } from '../types/product';
import { MOCK_USERS } from '../data/mockUsers';

interface AuthState {
  currentUser: UserProfile;
  isAuthModalOpen: boolean;
  
  // Actions
  switchRole: (role: UserRole) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  updateCreditLimit: (userId: string, newLimit: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: MOCK_USERS['cliente_b2c'], // Default to B2C Retail
  isAuthModalOpen: false,

  switchRole: (role: UserRole) => {
    if (MOCK_USERS[role]) {
      set({ currentUser: MOCK_USERS[role], isAuthModalOpen: false });
    }
  },

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  updateCreditLimit: (userId: string, newLimit: number) => {
    set((state) => {
      if (state.currentUser.id === userId) {
        return {
          currentUser: { ...state.currentUser, creditLimit: newLimit }
        };
      }
      return state;
    });
  }
}));
