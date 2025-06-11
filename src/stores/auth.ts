import { defineStore } from 'pinia';

export interface User {
  username: string;
  photo_profil?: string;
  bio?: string;
  ville?: string;
  pays?: string;
  date_naissance?: string;
  email?: string;
}

export interface AuthState {
  access: string | null;
  refresh: string | null;
  user: User | null;
  isUserLoaded: boolean;  // <--- ajout
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    user: null,
    isUserLoaded: false,
  }),

  actions: {
    async login(username: string, password: string): Promise<boolean> {
      try {
        const res = await api.post<{ access: string; refresh: string }>('token/', { username, password });

        this.access = res.data.access;
        this.refresh = res.data.refresh;

        localStorage.setItem('access', this.access);
        localStorage.setItem('refresh', this.refresh);

        // On ne fetch pas ici pour éviter les problèmes d'état dans les composants
        return true;
      } catch (err: unknown) {
        console.error('Login failed', err);
        return false;
      }
    },

    logout(): boolean {
      this.access = null;
      this.refresh = null;
      this.user = null;
      this.isUserLoaded = false;

      localStorage.removeItem('access');
      localStorage.removeItem('refresh');

      return true;
    },

    async fetchUser(): Promise<void> {
      try {
        this.isUserLoaded = false;
        const res = await api.get<User>('profile/');
        if (res.data && res.data.username) {
          this.user = res.data;
        } else {
          this.user = null;
        }
      } catch (err) {
        console.warn("fetchUser failed, user non instancié", err);
        this.user = null;
      } finally {
        this.isUserLoaded = true;
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