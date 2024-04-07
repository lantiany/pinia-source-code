

import { computed, ref } from 'vue';
import { defineStore } from '../pinia/index';

export const useStore = defineStore('storeId1', () => {
  const counter = ref(1);

  const doubleCounter = () => {
    console.log('doubleCounter');
    return counter.value *=  2
  }

  const computedCounter = computed(() => {
    return counter.value * 10;
  })
  return {
    counter,
    doubleCounter,
    computedCounter
  }
});

