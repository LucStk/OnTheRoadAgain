<script setup lang="ts">
    import {logout} from '@repo/auth'
    import { useAuthStore } from '@repo/auth';
    const auth = useAuthStore();
</script>


<template>
    <div class="dropdown relative 
                inline-flex [--auto-close:inside] 
                [--offset:8] [--placement:bottom-end]">

    <button id="dropdown-scrollable" 
            type="button" 
            class="dropdown-toggle flex items-center" 
            aria-haspopup="menu" 
            aria-expanded="false" 
            aria-label="Dropdown">

        <div class="avatar">
            <div class="size-9.5 rounded-full">
                <img  v-if="auth.isUserLoaded && auth.photo_profil" :src="auth.photo_profil.value"></img>
                <span v-else class="text-4xl icon-[solar--user-circle-bold-duotone]"></span>
            </div>
        </div>
    </button>
    <ul class="dropdown-menu 
                dropdown-open:opacity-100 
                hidden min-w-60" 
        role="menu" 
        aria-orientation="vertical" 
        aria-labelledby="dropdown-avatar">
    <!--TODO : Quand l'utilisateur logout, la bar ne se refresh pas-->
    <template v-if="auth.isUserLoaded">
        <li  class="dropdown-header gap-2">
            <div class="avatar">
                <div class="size-9.5 rounded-full">
                    <img v-if="auth.photo_profil" :src="auth.photo_profil.value"></img>
                    <span v-else class="text-4xl icon-[solar--user-circle-bold-duotone]"></span>
                </div>
            </div>
            <div>
            <h6 class="text-base-content text-base font-semibold">{{auth.username}}</h6>
            <!--<small class="text-base-content/50">Admin</small>-->
            </div>
        </li>
        <li>
            <a class="dropdown-item" href="/profile">
            <span class="icon-[tabler--user]"></span>
            My Profile
            </a>
        </li>
        <li class="dropdown-footer gap-2">
            <button class="btn btn-error btn-soft btn-block" @click="logout">
            <span class="icon-[tabler--logout]"></span>
            Sign out
            </button>
        </li>

    </template>
    <template v-else>
        <li class="dropdown-footer gap-2">
            <a class="btn btn-base-100 btn-soft btn-block" href="login">
            <span class="icon-[tabler--logout]"></span>
            Sign in
            </a>
        </li>

    </template>
        
    </ul>

</div>
</template>

