import { defineStore } from 'pinia'
import { ref, reactive, toRefs, computed } from 'vue'
import { api, BACKEND_MEDIA_URL } from './api'

export interface User {
  username: string;
  email?: string;
  user_thumbnail?: string;
  bio?: string;
  ville?: string;
  pays?: string;
  date_naissance?: string;
}

function initialUser(): User {
  return {
    username: 'Invité',
    user_thumbnail: undefined,
    bio: undefined,
    ville: undefined,
    pays: undefined,
    date_naissance: undefined,
    email: undefined,
  }
}

export const useAuthStore = defineStore("auth", () => {
  const _access = ref<string>("")
  const access = {
  get value() {
    return _access.value
  },
  set value(val: string) {
    if (typeof val !== 'string') {
      console.warn("[AuthStore] Tentative d'affecter une valeur non-string à access :", val)
    }
    _access.value = val
    }
  }

  const _isUserLoaded = ref<boolean>(false)
  const isUserLoaded = computed({
    get: () => _isUserLoaded.value,
    set: (val: boolean) => { _isUserLoaded.value = val }
  })

  const photo_profil = computed({
    get: () => (user.user_thumbnail ? `${BACKEND_MEDIA_URL}${user.user_thumbnail}` : null),
    set: (val: string) => { user.user_thumbnail = val }
  })    
  // utilisateur réactif champ par champ
  
  
  const user = reactive<User>(initialUser())

  async function login(email: string, password: string): Promise<boolean> {
    try {
        const data = {"email":email,"password":password};
        const res = await api.post<{ access: string }>('/token/get/', data);
        access.value = res.data.access;
        await fetchUser();
        return true;
      } catch (err) {
        console.error('Login failed', err);
        throw err
      }
  }
  async function signup(values: any): Promise<boolean> {
    try {
      const res = await api.post<{ access: string }>('/signup/', values);
      access.value = res.data.access;
      await fetchUser();
      return true;
    } catch (err) {
      console.error('Signup failed', err);
      throw err
    }
  }

  function resetStore() {
    access.value = ''
    _isUserLoaded.value = false
    Object.assign(user, initialUser()) // reset propre du user
  }

  async function fetchUser(): Promise<void> {
        try {
          const res = await api.get<User>('/profile/me/');
          Object.assign(user, res.data);
        } catch (err) {
          console.log("Fetch user failed");
          console.error(err);
        }
        _isUserLoaded.value = true
      }
  async function patchUser(values: any): Promise<void> {
    try {
      console.log("ok")
      const res = await api.patch<{ access: string }>('/profile/update-profile/', values);
      console.log(res)
    } catch (err) {
      console.error('Patch user failed', err);
      throw err
    }
  }

  return {
    login,
    signup,
    fetchUser,
    patchUser,
    photo_profil,
    isUserLoaded,
    _isUserLoaded,
    access,
    _access,
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