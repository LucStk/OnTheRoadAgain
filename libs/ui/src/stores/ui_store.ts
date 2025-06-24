import { defineStore } from 'pinia'
import { ref} from 'vue'


export const useUIStore = defineStore("ui", () => {
  const showLogin = ref<boolean>(false)
  const showSignup = ref<boolean>(true)

  function showLoginModal() {showLogin.value = true; showSignup.value = false}
  function showSignupModal() {showSignup.value = true ; showLogin.value = false}
  function hideLoginModal() {showLogin.value = false }
  function hideSignupModal() {showSignup.value = false}

  return {
    showLoginModal,
    showSignupModal,
    hideLoginModal,
    hideSignupModal,
    showLogin,
    showSignup,
  }
})