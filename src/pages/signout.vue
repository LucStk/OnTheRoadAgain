<script setup lang="ts">
  const auth = useAuthStore();
  const router = useRouter();

onMounted(() => {
  auth.logout();
  router.push('/');
});
</script>
