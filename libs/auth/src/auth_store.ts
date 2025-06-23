import { defineStore } from 'pinia'
import { ref, reactive, toRefs } from 'vue'
import { api } from './api'

export interface User {
  username: string;
  photo_profil?: string;
  bio?: string;
  ville?: string;
  pays?: string;
  date_naissance?: string;
  email?: string;
}

function initialUser(): User {
  return {
    username: 'Invité',
    photo_profil: undefined,
    bio: undefined,
    ville: undefined,
    pays: undefined,
    date_naissance: undefined,
    email: undefined,
  }
}

export const useAuthStore = defineStore("auth", () => {
  const access = ref<string>("")
  const isUserLoaded = ref<boolean>(false)
  // utilisateur réactif champ par champ
  const user = reactive<User>(initialUser())

  async function login(email: string, password: string): Promise<boolean> {
    try {
        const data = {"email":email,"password":password};
        const res = await api.post<{ access: string }>('token/', data);
        access.value = res.data.access;
        isUserLoaded.value = true
        await fetchUser();
        return true;
      } catch (err) {
        console.error('Login failed', err);
        throw err
      }
  }

  function resetStore() {
    access.value = ''
    isUserLoaded.value = false
    Object.assign(user, initialUser()) // reset propre du user
  }

  async function fetchUser(): Promise<void> {
    try {
      const res = await api.get<User>('profile/me/');
      Object.assign(user, res.data);
    } catch (err) {
      console.warn('User fetch failed');
      throw err;
    }
  }

  return {
    login, 
    fetchUser,
    isUserLoaded,
    access,
    resetStore,
    ...toRefs(user)  // <-- rend chaque champ exporté individuellement en tant que `ref`
  }
}, {
  // @ts-ignore
  persist: {
    key: 'auth-data',
    omit : ["email"]
  }
})