<script setup>
import { ref, useTemplateRef } from 'vue'
import Modal from './Modal.vue'
import ImageCropper from './ImageCropper.vue'
import VideoCropper from './VideoCropper.vue'

const { handleSelectImage, sectionId, sectionImageId, genericImage, thumbnailUrl, aspectRatio } =
  defineProps([
    'handleSelectImage',
    'sectionId',
    'sectionImageId',
    'genericImage',
    'thumbnailUrl',
    'aspectRatio',
  ])

const fileInput = useTemplateRef('fileInput')
const isModalOpen = ref(false)
const fileType = ref('')
const fileSrc = ref('')
const imageCropperRef = ref(null)
const videoCropperRef = ref(null)

const openModal = () => (isModalOpen.value = true)
const closeModal = () => {
  isModalOpen.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleButtonClick = () => {
  closeModal()
  fileSrc.value = ''
  fileInput.value.click()
}

const inputOnChange = (event) => {
  if (event.target.files && event.target.files.length > 0) {
    fileType.value = event.target.files[0].type.split('/')[0]
    console.log('fileType', fileType.value)
    if (fileType.value === 'image') {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        fileSrc.value = reader.result?.toString() || ''
      })
      reader.readAsDataURL(event.target.files[0])
    } else if (fileType.value === 'video') {
      fileSrc.value = URL.createObjectURL(event.target.files[0])
    }
  }
  openModal()
}

const onComplete = () => {
  console.log('onComplete', imageCropperRef.value)
  if (imageCropperRef.value) {
    const croppedImage = imageCropperRef.value.getResult().canvas.toDataURL()
    handleSelectImage(croppedImage, croppedImage, sectionId, sectionImageId)
  } else {
    const thumbnailUrl = videoCropperRef.value.thumbnail
    handleSelectImage(fileSrc.value, thumbnailUrl, sectionId, sectionImageId)
  }
  closeModal()
}
</script>
<template>
  <div className="!p-0 w-20 cursor-pointer" @click="handleButtonClick">
    <input
      type="file"
      accept="image/*,video/*"
      @change="(event) => inputOnChange(event)"
      ref="fileInput"
      style="display: none"
    />
    <img :src="thumbnailUrl ?? genericImage" alt="" className="w-full object-cover" />
  </div>
  <Modal :isOpen="isModalOpen" :onClose="closeModal" title="Ajusta la imagen">
    <ImageCropper
      v-if="fileType === 'image'"
      :imgSrc="fileSrc"
      :aspectRatio="aspectRatio"
      ref="imageCropperRef"
    />
    <VideoCropper v-if="fileType === 'video'" ref="videoCropperRef" :videoSrc="fileSrc" />

    <div className="py-2 flex justify-end gap-3">
      <button className="px-5 h-10 bg-red-400 hover:bg-red-600 rounded" @click="closeModal">
        Cerrar
      </button>
      <button className="px-5 h-10 bg-green-400 hover:bg-green-600 rounded" @click="onComplete">
        Confirmar
      </button>
    </div>
  </Modal>
</template>
