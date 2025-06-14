import { defineStore } from 'pinia';

export const useIndexStore = defineStore('selected', {
  state: () => ({
    index: null as number | null,
  }),

  actions: {
    change_index(index: number) {
      this.index = index;
    },
  },
});
