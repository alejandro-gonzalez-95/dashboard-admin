<script setup>
import { onMounted, ref } from 'vue'

import Card from '../../components/Layout/Card.vue'
import Modal from '../../components/Modal.vue'
import LayoutPreview from '../../components/Layout/LayoutPreview.vue'

import { getAll } from '../../services/api.service'

const layouts = ref([])
const selectedLayout = ref(null)
const isPreviewModalOpen = ref(false)

onMounted(() => {
  console.log('mounted')

  getAllLayouts()
})

const getAllLayouts = async () => {
  const layoutsData = await getAll()
  console.log(layoutsData)
  layouts.value = layoutsData
}

const onView = (screenDevice) => {
  selectedLayout.value = screenDevice
  isPreviewModalOpen.value = true
}

const onClose = () => {
  selectedLayout.value = null
  isPreviewModalOpen.value = false
}
</script>

<template>
  <div class="p-2">
    <h1 class="text-2xl font-bold">Layouts</h1>
  </div>
  <div class="flex flex-wrap justify-between gap-3 p-2">
    <Card v-for="layout in layouts" :key="layout.id" :layout="layout" :onView="onView" />
  </div>
  <Modal
    v-if="selectedLayout"
    :isOpen="isPreviewModalOpen"
    :onClose="onClose"
    :title="`${selectedLayout.name} preview`"
  >
    <LayoutPreview :layout="selectedLayout" />
  </Modal>
</template>
