<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
    <h2 class="text-2xl font-semibold text-center">Créer un utilisateur</h2>

    <!-- Champ Username -->
    <div class="input-floating w-full">
      <input
        v-model="form.username"
        type="text"
        placeholder="Jiji"
        class="input w-full"
        :class="{ 'border-red-500': errors.username }"
      />
      <label class="input-floating-label">Username</label>
      <p v-if="errors.username" class="helper-text text-red-500 text-sm">{{ errors.username }}</p>
    </div>

    <!-- Champ Email -->
    <div class="input-floating w-full">
      <input
        v-model="form.email"
        type="email"
        placeholder="jean@example.com"
        class="input w-full"
        :class="{ 'border-red-500': errors.email }"
      />
      <label class="input-floating-label">Email</label>
      <p v-if="errors.email" class="helper-text text-red-500 text-sm">{{ errors.email }}</p>
    </div>

    <!-- Champ Mot de passe -->
    <div class="input-floating w-full">
      <input
        v-model="form.password"
        type="password"
        placeholder="••••••••"
        class="input w-full"
        :class="{ 'border-red-500': errors.password }"
      />
      <label class="input-floating-label">Mot de passe</label>
      <p v-if="errors.password" class="helper-text text-red-500 text-sm">{{ errors.password }}</p>
    </div>

    <!-- Bouton -->
    <button class="btn btn-primary w-full" @click="handleSubmit">Créer l'utilisateur</button>
  </div>
</template>

<script setup lang="ts">  
  definePage({
    meta: {requiresGuest: true,},
  })
  const router = useRouter();

  const form = reactive({
    username: '',
    email: '',
    password: '',
  })

  const errors = reactive({
    username: '',
    email: '',
    password: '',
  })

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  // TODO : mettre un second mdp de vérification
  // TODO : Demander un mdp fort
  // TODO : Mettre un CATCHA pour purger les bots
  // TODO : Proposer une authentification par google où autre
  // TODO : Envoyer un mail pour confirmer l'inscription
  
  async function handleSubmit() {
    errors.username = ''
    errors.email = ''
    errors.password = ''
    const auth = useAuthStore();

    let valid = true

    if (!form.username) {
      errors.username = 'Username est requis'
      valid = false
    }

    if (!form.email || !validateEmail(form.email)) {
      errors.email = 'Email invalide'
      valid = false
    }

    if (!form.password || form.password.length < 6) {
      errors.password = 'Mot de passe trop court'
      valid = false
    }

    if (!valid) { return}

    const res = await api.post<{access : string}>("signup/", form);
    
    auth.isUserLoaded = true;
    auth.access = res.data.access;
    //Chargement de l'user
    await auth.fetchUser();
    console.log('Utilisateur créé:', { ...form })
    //Redirection
    router.push('/profile');
  }
</script>