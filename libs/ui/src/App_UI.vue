<template>
  <!--<Navbar />-->
  bouton
  <Button />
   <RouterView />
</template>

<script>
import Button from './components/Button.vue'
export default {
  name: 'App_UI',
  components: {
    Button, // <--- C'est ce qui manque
  },
}
</script>
