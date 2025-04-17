<script setup>
import { RouterLink } from 'vue-router'
import layoutImg from '../../assets/layout.png'
import layout1 from '../../assets/layout1.png'
import layout2 from '../../assets/layout2.png'
import layout3 from '../../assets/layout3.png'

import Modal from '../Modal.vue'

const { layout, onView } = defineProps(['layout', 'onView'])
</script>

<template>
  <div class="flex flex-col gap-2 bg-gray-100 border-2 border-gray-200 rounded-xl w-[400px] p-2">
    <div class="w-full p-2">
      <img v-if="layout.type === '1'" :src="layout1" alt="layout" class="rounded-xl" />
      <img v-else-if="layout.type === '2'" :src="layout2" alt="layout" class="rounded-xl" />
      <img v-else-if="layout.type === '3'" :src="layout3" alt="layout" class="rounded-xl" />
      <img v-else :src="layoutImg" alt="layout" class="rounded-xl" />
    </div>
    <div class="p-2">
      <h1>{{ layout.name }}</h1>
    </div>
    <div class="flex gap-2 justify-end p-2">
      <button
        class="bg-green-400 hover:bg-green-600 p-1 px-2 h-10 min-w-10 rounded-xl"
        @click="onView(layout)"
      >
        Ver
      </button>
      <RouterLink :to="`/layout/${layout.id}`">
        <button class="bg-green-400 hover:bg-green-600 p-1 px-2 h-10 min-w-10 rounded-xl">
          Editar
        </button>
      </RouterLink>
    </div>
  </div>
</template>
