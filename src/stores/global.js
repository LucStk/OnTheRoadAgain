import { defineStore } from 'pinia'

export const useIndexStore = defineStore('selected', {
  state: () => ({ 
      index: null,
  }),

  actions: {
    change_index(index){
      this.index = index
  },},

})