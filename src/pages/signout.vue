<script setup lang="ts">
  const auth = useAuthStore();
  const router = useRouter();

onMounted(() => {
  auth.resetStore();
  router.push('/');
});
</script>
