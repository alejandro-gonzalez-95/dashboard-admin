<script setup>
import '../css/Modal.css'
const { isOpen, onClose, title } = defineProps(['isOpen', 'onClose', 'title'])
console.log('title', title)
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="{ onClose }">
    <div class="modal-content" @click="(e) => e.stopPropagation()">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-button" @click="onClose">&times;</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <!-- <button v-on:click="onClose">Cerrar</button> -->
      </div>
    </div>
  </div>
</template>
