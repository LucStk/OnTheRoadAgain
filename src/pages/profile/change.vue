
<template>
  <div v-if="user" class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
    <div class="flex-col items-center space-x-4">
      <div class="avatar">
          <div v-if="user.photo_profile" class="size-9.5 rounded-full">
            <!--
              {{user.photo_profile}}
              <img src="{{user.photo_profile}}" 
                    alt="avatar 1" />
            -->  
            Coucou
          </div>
          <div v-else class="size-9.5 rounded-full">
              <span class="text-4xl icon-[solar--user-circle-bold-duotone]"></span>
          </div>
      </div>
      <h2 class="text-2xl font-semibold">{{ user.username }}</h2>

      <form @submit.prevent="handleUpdate">

        <div class="w-96">
          <label class="label-text " for="defaultInput">Ville</label>
          <input type="text" placeholder="Paris" class="input" id="defaultInput" />
        </div>

        <div class="w-96">
          <label class="label-text " for="defaultInput">Pays</label>
          <input type="text" placeholder="France" class="input" id="defaultInput" />
        </div>

        <div class="textarea max-w-sm">
          <div class="textarea-floating grow">
            <textarea class="resize-none" placeholder="Hello!!!" id="textareaFloatingMedium"></textarea>
            <label class="textarea-floating-label" for="textareaFloatingMedium">{{ user.bio }}</label>
          </div>
          <span class="icon-[tabler--message] text-base-content/80 mt-2 mx-4 size-5 shrink-0"></span>
        </div>

        <flat-pickr
            v-model="date"
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

  const date = ref(null);
  const config = {
          wrap: true, // set wrap to true only when using 'input-group'
          altFormat: 'M j, Y',
          altInput: true,
          dateFormat: 'Y-m-d',     
        }

  const auth = useAuthStore();
  const user = auth.user;

  const username = ref('')
  const password = ref('')
  const error = ref("")
  const router = useRouter()
  const loading = ref(false)

  async function handleUpdate() {
    loading.value = true
    error.value = ""

    const success = await auth.login(username.value, password.value)

    loading.value = false

    if (success) {
      console.log("sucess redirection")
      router.push('/profile/')
    } else {
      error.value = 'Nom d’utilisateur ou mot de passe incorrect.'
    }
  }

  
</script>
