import { create } from 'zustand';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { User as AuthStoreUser, AuthState } from '@/types/auth';

// Omit because we want to enforce extending the appMode here
interface User extends AuthStoreUser {
    appMode?: 'PLANNER' | 'RESIDENT';
}

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setCredentials: (user: User, token: string) => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
    toggleMode: (mode: 'PLANNER' | 'RESIDENT') => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    token: Cookies.get('token') || null,
    isAuthenticated: !!Cookies.get('token'),
    isLoading: true,

    setCredentials: (user, token) => {
        Cookies.set('token', token, { expires: 7 }); // 7 days
        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        Cookies.remove('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    fetchUser: async () => {
        const token = Cookies.get('token');
        if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
        }

        try {
            const response = await api.get('/auth/me');
            set({
                user: response.data.data.user,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            Cookies.remove('token');
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
    },

    toggleMode: async (mode) => {
        const currentData = get().user;
        if (!currentData) return;

        // Optimistic update
        set({ user: { ...currentData, appMode: mode } });

        try {
            await api.put('/users/mode', { appMode: mode });
        } catch (error) {
            console.error('Failed to save mode preference to server', error);
            // Revert optimistic update
            set({ user: currentData });
        }
    }
}));

