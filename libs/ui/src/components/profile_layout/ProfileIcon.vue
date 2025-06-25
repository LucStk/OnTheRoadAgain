<template>
  <div class="avatar mx-auto justify-center">
    <div class="size-15 rounded-full overflow-hidden bg-base-200 relative">
      <img
        v-if="imgSrc"
        :src="imgSrc"
        alt="User avatar"
        class="object-cover w-full h-full"
      />
      <UserCircleIcon
        v-else
        class="w-full h-full text-base-content"
        aria-hidden="true"
      />
      <ModifyIcon class="absolute bottom-0 right-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { inject} from 'vue'
  import type { Ref } from 'vue'
  import { UserCircleIcon } from '@heroicons/vue/24/solid'
  import ModifyIcon from './ModifyIcon.vue'

  // Inject depuis un parent (probablement un ref<string | null>)
  const imgSrc = inject<Ref<string | null>>('imgSrc')

</script>