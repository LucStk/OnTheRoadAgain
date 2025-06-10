<script setup lang="ts">
  const auth = useAuthStore();
  const router = useRouter();

  auth.logout()
  router.push('/profile')
</script>
