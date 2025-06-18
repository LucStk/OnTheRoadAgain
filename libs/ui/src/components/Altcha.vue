<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

// Importing altcha package will introduce a new element <altcha-widget>
import 'altcha';

const altchaWidget = ref<HTMLElement | null>(null);
const props = defineProps({
  payload: {
    type: String,
    required: false,
  }
});
const emit = defineEmits<{(e: 'update:payload', value: string): void;}>();
const internalValue = ref(props.payload);

watch(internalValue, (v) => {emit('update:payload', v || '');});

const verifyWithBackend = async (payload: string) => {
  try {
    const response = await fetch('/api/verify-altcha/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ payload })
    });

    const result = await response.json();
    if (result.success) {
      console.log('Altcha vérifié côté serveur.');
    } else {
      console.warn('Échec de la vérification Altcha côté serveur.');
      internalValue.value = '';
    }
  } catch (error) {
    console.error('Erreur côté client pendant la vérification Altcha :', error);
    internalValue.value = '';
  }
};


const onStateChange = (ev: CustomEvent | Event) => {
  if ('detail' in ev) {
    const { payload, state } = ev.detail;
    if (state === 'verified' && payload) {
      internalValue.value = payload;
      verifyWithBackend(payload);
    } else {
      internalValue.value = '';
    }
  }
};

onMounted(() => {
  if (altchaWidget.value) {
    altchaWidget.value.addEventListener('statechange', onStateChange);
  }
});

onUnmounted(() => {
  if (altchaWidget.value) {
    altchaWidget.value.removeEventListener('statechange', onStateChange);
  }
});
</script>

<template>
  <!-- Configure your `challengeurl` and remove the `test` attribute, see docs: https://altcha.org/docs/v2/widget-integration/ -->
  <altcha-widget
    ref="altchaWidget"
    style="--altcha-max-width:100%"
    class="text-black"
    debug
    test
  ></altcha-widget>
</template>