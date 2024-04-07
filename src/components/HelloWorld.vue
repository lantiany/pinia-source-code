<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../store/index1';

const store = useStore();
defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <div class="card">
    doubleCounter is {{ store.doubleCounter }}
    <button type="button" @click="count++">count is {{ store.counter }}</button>
    <button type="button" @click="store.increment">increment</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
