<script setup>
  import { useAuthStore } from '@/stores/auth';

  const auth = useAuthStore();
  const router = useRouter();

  function goToLogin() {
    router.push('/login');
  }
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
            <div v-if="auth.user" class="size-9.5 rounded-full">
                <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png" 
                     alt="avatar 1" />
            </div>
            <div v-else class="size-9.5 rounded-full">
                <span class="text-4xl icon-[solar--user-circle-bold-duotone]"></span>
            </div>
        </div>
    </button>
    <ul v-if="auth.user" class="dropdown-menu 
                dropdown-open:opacity-100 
                hidden min-w-60" 
        role="menu" 
        aria-orientation="vertical" 
        aria-labelledby="dropdown-avatar">

    <!-- Profile -->
    <li  class="dropdown-header gap-2">
        <div class="avatar">
        <div class="w-10 rounded-full">
            <img src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png" alt="avatar" />
        </div>
        </div>
        <div>
        <h6 class="text-base-content text-base font-semibold">John Doe</h6>
        <small class="text-base-content/50">Admin</small>
        </div>
    </li>
    <li>
        <a class="dropdown-item" href="#">
        <span class="icon-[tabler--user]"></span>
        My Profile
        </a>
    </li>
    <li>
        <a class="dropdown-item" href="#">
        <span class="icon-[tabler--help-triangle]"></span>
        FAQs
        </a>
    </li>
    <li class="dropdown-footer gap-2">
        <a class="btn btn-error btn-soft btn-block" href="#">
        <span class="icon-[tabler--logout]"></span>
        Sign out
        </a>
    </li>
    </ul>
    <ul v-else="auth.user" class="dropdown-menu 
            dropdown-open:opacity-100 
            hidden min-w-60" 
    role="menu" 
    aria-orientation="vertical" 
    aria-labelledby="dropdown-avatar">
    
        <li class="dropdown-footer gap-2">
            <a class="btn btn-success btn-soft btn-block" href="login">
            <span class="icon-[tabler--logout]"></span>
            Log in / Sign up
            </a>
        </li>
    </ul>


</div>
</template>

