import { defineStore } from 'pinia';
import api from '@/services/api';

export interface User {
  username: string;
  photo_profile? : string;
  photo_profile_cropping? : string;
  bio?: string;
  ville? : string;
  pays? : string;
  date_naissance? : string;
  email?: string;
  nom_complet? : string;
}

export interface AuthState {
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

        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);

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
        const res = await api.get<User>('users/me');
        this.user = res.data;
      } catch (err: unknown) {
        this.user = null;
      }
    },

    async initialize() {
      if (this.access && !this.user) {
        try {
          await this.fetchUser(); // access encore valide
        } catch (e) {
          // access expiré → tente refresh
          if (this.refresh) {
            try {
              const res = await api.post<{ access: string }>('token/refresh/', {
                refresh: this.refresh,
              });
              this.access = res.data.access;
              localStorage.setItem('access', this.access);
              await this.fetchUser();
            } catch (e) {
              this.logout();
            }
          } else {
            this.logout(); // pas de refresh → on déconnecte
          }
        }
      }
    }
  },
});
