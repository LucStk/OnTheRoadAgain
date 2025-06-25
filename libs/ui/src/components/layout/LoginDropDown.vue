<script setup lang="ts">
import { logout } from '@repo/auth'
import { useAuthStore } from '@repo/auth'
import { useUIStore } from '@repo/ui'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { UserCircleIcon } from '@heroicons/vue/24/solid'



const auth = useAuthStore()
const uistore = useUIStore()
</script>

<template>
  <Menu as="div" class="relative inline-flex">
    <MenuButton id="dropdown-login" class="flex items-center cursor-pointer" aria-label="Dropdown">
      <div class="avatar">
        <div class="size-9.5 rounded-full overflow-hidden bg-base-200">
          <img
            v-if="auth.isUserLoaded && auth.photo_profil"
            :src="auth.photo_profil"
            alt="User avatar"
            class="object-cover w-full h-full"
          />
          <UserCircleIcon
            v-else
            class="w-full h-full text-base-content"
            aria-hidden="true"
          />
        </div>
      </div>
    </MenuButton>

      <MenuItems
      id="dropdown-login-menu"
        class="absolute mt-10 right-0 min-w-60 origin-top rounded-md bg-base-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2 z-20"
      >
        <template v-if="auth.isUserLoaded">
          <div class="flex items-center gap-2 px-3 py-2 border-b border-base-content/10">
            <div class="avatar">
              <div class="size-9.5 rounded-full overflow-hidden bg-base-200">
                <img
                  v-if="auth.photo_profil"
                  :src="auth.photo_profil"
                  alt="User avatar"
                  class="object-cover w-full h-full"
                />
                <UserCircleIcon
                  v-else
                  class="w-full h-full text-base-content"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div>
              <h6 class="text-base-content text-base font-semibold">{{ auth.username }}</h6>
            </div>
          </div>

          <MenuItem>
            <a href="/profile" class="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-md">
              <span class="icon-[tabler--user]"></span>
              My Profile
            </a>
          </MenuItem>

          <div class="pt-2 border-t border-base-content/10 mt-2">
            <MenuItem>
              <button
                @click="logout"
                class="btn btn-error btn-soft btn-block flex items-center gap-2"
              >
                <span class="icon-[tabler--logout]"></span>
                Sign out
              </button>
            </MenuItem>
          </div>
        </template>

        <template v-else>
          <MenuItem>
            <button
              id="login-button"
              class="btn btn-base-100 btn-soft btn-block flex items-center gap-2"
              @click="uistore.showLoginModal()"
                >
              <span class="icon-[tabler--logout]"></span>
              Sign in
             
            </button>
          </MenuItem>
        </template>
      </MenuItems>
  </Menu>
</template>
