import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
});

router.afterEach(async (to, from, failure) => {
  if (!failure) setTimeout(() => window.HSStaticMethods.autoInit(), 100);
});

export default router;            