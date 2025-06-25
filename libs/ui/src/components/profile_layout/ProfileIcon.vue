<template>

      <div class="avatar mx-auto justify-center">
        <div class="size-15 rounded-full overflow-hidden bg-base-200">
          <img
            v-if="auth.isUserLoaded && auth.photo_profil"
            :src="auth.photo_profil"
            alt="User avatar"
            class="object-cover w-full h-full"
          />
          <UserCircleIcon
            v-else
            class="w-full h-full text-base-content"
            aria-hidden="true"
          />
          <ModifyIcon />
        </div>
      </div>

</template>


<script setup lang="ts">
    import { UserCircleIcon } from '@heroicons/vue/24/solid';
    import { useAuthStore } from '@repo/auth'
    import ModifyIcon from './ModifyIcon.vue';
    const auth = useAuthStore();
    
</script>
