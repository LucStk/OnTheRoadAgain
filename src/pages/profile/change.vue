
<template>
  <div v-if="user" class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
    <div class="flex-col items-center space-x-4">
      <h2 class="text-2xl font-semibold">{{ user.username }}</h2>


      <ProfilePhoto v-model="img" />
      

      <form @submit.prevent="handleUpdate">

        <div class="w-96">
          <label class="label-text " for="defaultInput">Ville</label>
          <input v-model="form.ville" type="text" placeholder="Paris" class="input" id="defaultInput" />
        </div>

        <div class="w-96">
          <label class="label-text " for="defaultInput">Pays</label>
          <input v-model="form.pays" type="text" placeholder="France" class="input" id="defaultInput" />
        </div>
        <label class="label-text " for="defaultInput">Bio</label>
        <div class="textarea max-w-sm">
          <div class="textarea-floating grow">
            <textarea v-model="form.bio" class="resize-none" placeholder="Ma bio" id="textareaFloatingMedium"></textarea>
          </div>
        </div>
        <label class="label-text " for="defaultInput">Date de naissance</label>
        <flat-pickr
            v-model="form.date_naissance"
            :config="config"                                                          
            class="form-control" 
            placeholder="Select date"               
            name="date">
        </flat-pickr>

        <button type="submit" :disabled="loading" class="btn btn-success btn-block">
          Modifier
        </button>

      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
  definePage({
    meta: {requiresAuth: true,},
  })
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
import ProfilePhoto from '@/components/profile_layout/ProfilePhoto.vue';

  const config = {
          wrap: true, // set wrap to true only when using 'input-group'
          altFormat: 'Y-m-d',
          altInput: true,
          dateFormat: 'Y-m-d',
        }

  const auth = useAuthStore();
  const user = auth.user;
  console.log("date_naissance",user?.date_naissance)

  const img = ref(null)

  const form = reactive({
    date_naissance: user?.date_naissance ? new Date(user.date_naissance) : null,
    bio: user?.bio || "",
    pays: user?.pays || "",
    ville: user?.ville || ""
  })

  const error = ref("")
  const loading = ref(false)

  async function handleUpdate() {
    error.value = ""

    const blob = await (await fetch(img)).blob()
    form["photo_profil"] = blob

    const success = await api.patch("profile/patch/", form);

    if (success) {
      console.log("sucess redirection")
      auth.fetchUser()
    } else {
      error.value = 'Nom d’utilisateur ou mot de passe incorrect.'
    }
  }

  
</script>
