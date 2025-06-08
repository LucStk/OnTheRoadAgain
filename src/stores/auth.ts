import { defineStore } from 'pinia';
import api from '@/services/api';

interface User {
  // Ajuste selon la structure réelle de ton objet utilisateur
  id: number;
  username: string;
  email?: string;
  // ajoute d'autres propriétés ici si besoin
}

interface AuthState {
  access: string | null;
  refresh: string | null;
  user: User | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    user: null,
  }),

  actions: {
    async login(username: string, password: string): Promise<boolean> {
      try {
        const res = await api.post<{ access: string; refresh: string }>('token/', { username, password });
        this.access = res.data.access;
        this.refresh = res.data.refresh;

        localStorage.setItem('access', this.access);
        localStorage.setItem('refresh', this.refresh);

        await this.fetchUser();

        return true
      } catch (err: unknown) {
        return false
      }
    },

    logout(): boolean {
      this.access = null;
      this.refresh = null;
      this.user = null;

      localStorage.removeItem('access');
      localStorage.removeItem('refresh');

      return true
    },

    async fetchUser(): Promise<void> {
      try {
        const res = await api.get<User>('user/');
        this.user = res.data;
      } catch (err: unknown) {
        this.user = null;
      }
    }
  },
});
