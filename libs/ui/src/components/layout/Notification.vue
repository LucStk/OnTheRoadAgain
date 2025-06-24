<template>
  <Menu as="div" class="relative inline-flex">
    <MenuButton
      class="btn btn-text btn-circle size-10 aria-expanded:bg-base-content/10"
      aria-label="Dropdown"
    >
    
      <div class="indicator">
        <span class="indicator-item bg-error size-2 rounded-full"></span>
        <BellIcon class="size-6 text-blue-white" />
      </div>
    </MenuButton>

    <MenuItems
        class="absolute z-10 mt-10 w-80 left-1/2 
        -translate-x-4/5
        origin-top rounded-md 
        bg-base-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
    >
        <div class="px-4 py-3 border-b border-base-content/10">
            <h6 class="text-base-content text-base text-center">Notifications</h6>
        </div>

        <div class="max-h-56 overflow-y-auto text-base-content/80">
            <!-- Notification items -->
            <MenuItem v-for="(notif, idx) in notifications" :key="idx">
            <div class="flex items-center gap-3 px-4 py-2 hover:bg-base-200">
                <div class="avatar" :class="notif.avatarClass">
                <div class="w-10 rounded-full">
                    <img v-if="notif.img" :src="notif.img" :alt="notif.alt" />
                    <div v-else class="bg-neutral text-neutral-content w-10 rounded-full p-2">
                    <span :class="notif.icon"></span>
                    </div>
                </div>
                </div>
                <div class="w-60">
                <h6 class="truncate text-base">{{ notif.title }}</h6>
                <small class="text-base-content/50 truncate">{{ notif.message }}</small>
                </div>
            </div>
        </MenuItem>
    </div>

    <div class="border-t border-base-content/10">
        <a
        href="#"
        class="flex items-center justify-center gap-1 px-4 py-2 hover:bg-base-200"
        >
        <span class="icon-[tabler--eye] size-4"></span>
        View all
        </a>
    </div>
    </MenuItems>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem} from '@headlessui/vue'
import { BellIcon } from '@heroicons/vue/24/solid'

const notifications = [
  {
    img: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png',
    alt: 'avatar 1',
    title: 'Charles Franklin',
    message: 'Accepted your connection',
    avatarClass: 'avatar-away-bottom',
  },
  {
    img: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-2.png',
    alt: 'avatar 2',
    title: 'Martian added moved Charts & Maps task to the done board.',
    message: 'Today 10:00 AM',
    avatarClass: 'avatar',
  },
  {
    img: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-8.png',
    alt: 'avatar 8',
    title: 'New Message',
    message: 'You have new message from Natalie',
    avatarClass: 'avatar-online-bottom',
  },
  {
    icon: 'icon-[tabler--user]',
    title: 'Application has been approved 🚀',
    message: 'Your ABC project application has been approved.',
    avatarClass: 'avatar-placeholder',
  },
  {
    img: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-10.png',
    alt: 'avatar 10',
    title: 'New message from Jane',
    message: 'Your have new message from Jane',
    avatarClass: 'avatar',
  },
  {
    img: 'https://cdn.flyonui.com/fy-assets/avatar/avatar-3.png',
    alt: 'avatar 3',
    title: 'Barry Commented on App review task.',
    message: 'Today 8:32 AM',
    avatarClass: 'avatar',
  },
]
</script>
