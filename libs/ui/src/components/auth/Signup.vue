
<template>
  <Teleport to="body">
    <div v-if="uistore.showSignup" class="overlay">
      <div class="relative w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <ButtonClose :onclick="() => uistore.hideSignupModal()"/>

        <h2 class="text-2xl font-semibold mb-6 text-center text-black">Créer un utilisateur</h2>
        <SignupForm />

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">

  import { useUIStore } from '@repo/ui'

  import ButtonClose from "../layout/ButtonClose.vue";
  import SignupForm from "./SignupForm.vue";

  const uistore = useUIStore()

</script>


