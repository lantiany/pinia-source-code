
import {defineStore}  from '../pinia/index';

export const useStore = defineStore('storeId2', {
  state(){
    return {
      counter: 2
    }
  },
  getters: {
    doubleCounter(){
      return this.counter * 2;
    }
  },
  actions: {
    increment(){
      this.counter++;
    }
  }
})