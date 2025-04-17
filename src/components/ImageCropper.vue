<script setup>
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const { imgSrc, aspectRatio } = defineProps(['imgSrc', 'aspectRatio'])
const cropperRef = ref(null)

const getResult = () => {
  if (cropperRef.value) {
    return cropperRef.value.getResult()
  }
}

defineExpose({
  getResult,
})
</script>
<template>
  <Cropper
    v-show="imgSrc"
    :src="imgSrc"
    :stencil="true"
    :scalable="true"
    :zoomable="true"
    :aspect-ratio="aspectRatio"
    :contain="true"
    :stencil-props="{
      aspectRatio: aspectRatio,
    }"
    ref="cropperRef"
  />
</template>
