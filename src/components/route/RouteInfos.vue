<template>
    <!-- Bloc gauche -->
    <div class="flex flex-col gap-1">
    <div class="text-xl font-semibold">{{ road.titre_étape }}</div>
    <div class="text-gray-600">{{ road.titre_parcours }}</div>
    <div>Jour {{ road.num_jour }} – Étape {{ road.num_étape }}</div>
    <div>{{ road.denivele }}</div>

    <div class="flex items-center gap-2">
        <div class="avatar">
        <div class="size-10 rounded-full overflow-hidden">
            <img :src="road.photos" alt="avatar" />
        </div>
        </div>
        <span>{{ road.createur }}</span>
    </div>
    </div>
</template>

<script setup>
    const road = inject('road')
</script>
