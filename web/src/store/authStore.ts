import { create } from 'zustand';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { User, AuthState } from '@/types/auth';

interface AuthStore extends AuthState {
    setCredentials: (user: User, token: string) => void;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
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
}));
