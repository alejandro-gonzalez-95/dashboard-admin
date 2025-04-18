<script setup>
import { onMounted, ref } from 'vue'
import Layout1 from '../../assets/layout1.png'
import Layout2 from '../../assets/layout2.png'
import Layout3 from '../../assets/layout3.png'
import { v4 as uuidv4 } from 'uuid'
import { getFileFromDataURL, getNewSectionsByType } from '../../utils/Utils.js'
import { getFile, getLayoutById, saveLayout } from '../../services/api.service.js'

import FileSelector from '../../components/FileSelector.vue'

const { layoutId } = defineProps(['layoutId'])

const initialLayout = {
  id: layoutId ?? '',
  name: '',
  type: '',
  sections: [],
}

const layout = ref(initialLayout)
const sectionWidthClass = ref('w-full')
const genericImage = ref(Layout1)

onMounted(() => {
  if (layout.value.id) requestGetLayoutById()
})

const requestGetLayoutById = async () => {
  const layoutData = await getLayoutById(layout.value.id)

  const sectionsData = []

  for (const section of layoutData.sections) {
    const sectionImagesData = []

    for (const sectionImage of section.sectionImages) {
      const image = 'image'
      const thumbnailUrl = await getFile(sectionImage.file.name)

      const sectionImageInitialData = { image, thumbnailUrl, ...sectionImage }
      sectionImagesData.push(sectionImageInitialData)
    }

    section.sectionImages = sectionImagesData
    sectionsData.push(section)
  }

  layoutData.sections = sectionsData

  layout.value = layoutData
}

const selectLayoutType = (type) => {
  if (layout.value.type === type) return

  const newSections = getNewSectionsByType(type)

  if (type === '1') genericImage.value = Layout1
  if (type === '2') genericImage.value = Layout2
  if (type === '3') genericImage.value = Layout3

  layout.value.type = type
  layout.value.sections = newSections

  sectionWidthClass.value = 'w-full'
  if (newSections.length === 2) {
    sectionWidthClass.value = 'w-1/2'
  }
  if (newSections.length === 3) {
    sectionWidthClass.value = 'w-1/3'
  }
  if (newSections.length === 4) {
    sectionWidthClass.value = 'w-1/4'
  }
}

const addSectionImage = (sectionToAdd) => {
  const id = sectionToAdd.sectionImages.length + 1
  const newSectionImage = {
    id: id,
    position: id,
    time: 10,
    thumbnailUrl: null,
    image: null,
  }

  sectionToAdd.sectionImages.push(newSectionImage)
}

const removeSectionImage = (sectionId, sectionImageId) => {
  layout.value.sections.forEach((section) => {
    if (section.id === sectionId) {
      section.sectionImages = section.sectionImages.filter(
        (sectionImage) => sectionImage.id !== sectionImageId,
      )
    }
  })
}

//TODO: Agregar para video
const handleSelectImage = async (fileUrl, thumbnail, sectionId, sectionImageId, type, time) => {
  console.log('type', type)
  if (fileUrl) {
    console.log('fileUrl', fileUrl)
    const extension = type.split('/')[1]
    const file = await getFileFromDataURL(fileUrl, `${uuidv4()}.${extension}`, type)

    console.log('file', file)

    layout.value.sections.forEach((section) => {
      if (section.id === sectionId) {
        section.sectionImages.forEach((sectionImage) => {
          if (sectionImage.id === sectionImageId) {
            sectionImage.thumbnailUrl = thumbnail
            sectionImage.image = file
            sectionImage.time = time ? Math.round(time) : sectionImage.time
            sectionImage.type = type.split('/')[0]
          }
        })
      }
    })
  }
}

const handleSubmit = async () => {
  const formData = new FormData()

  const modifiedJson = JSON.parse(JSON.stringify(layout.value))

  modifiedJson.sections.forEach((section) => {
    section.sectionImages = section.sectionImages.map((sectionImage) => {
      const { thumbnailUrl, image, ...rest } = sectionImage // Destructuramos para quitar thumbnailUrl
      return rest // Retornamos el objeto sin thumbnailUrl
    })
  })

  formData.append('json', new Blob([JSON.stringify(modifiedJson)], { type: 'application/json' }))

  const files = getAllImages(layout)
  files.forEach((file) =>
    formData.append(`file-${file.sectionId}-${file.sectionImageId}`, file.image),
  )

  await sendRequest(formData, layout)
}

const sendRequest = async (formData, layout) => {
  return await saveLayout(formData, layout)
}

const getAllImages = (layout) => {
  return (
    layout.value.sections.flatMap((section) =>
      section.sectionImages.map((sectionImage) => {
        console.log('sectionImage', sectionImage.image)
        return { sectionId: section.id, sectionImageId: sectionImage.id, image: sectionImage.image }
      }),
    ) || []
  )
}
</script>

<template>
  <div>
    <h1 v-if="layout?.id" class="text-2xl font-bold p-2">Editar</h1>
    <h1 v-else class="text-2xl font-bold p-2">Crear</h1>
  </div>

  <div class="flex gap-3 p-2">
    <label htmlFor="name" class="flex items-center text-xl font-bold">Name:</label>
    <input
      id="name"
      type="text"
      placeholder="Name"
      v-model="layout.name"
      class="h-10 w-full rounded-xl p-1 shadow"
    />
  </div>
  <div class="flex flex-col gap-3 p-2">
    <label class="flex items-center text-xl font-bold">Layout:</label>
    <div class="flex flex-wrap justify-between gap-3">
      <div
        :class="{
          'outline outline-2 outline-gray-600': layout.type === '1',
          'rounded cursor-pointer': true,
        }"
        @click="selectLayoutType('1')"
      >
        <img :src="Layout1" alt="layout1" class="w-[300px]" />
      </div>
      <div
        :class="{
          'outline outline-2 outline-gray-600': layout.type === '2',
          'rounded cursor-pointer': true,
        }"
        @click="selectLayoutType('2')"
      >
        <img :src="Layout2" alt="layout2" class="w-[300px]" />
      </div>
      <div
        :class="{
          'outline outline-2 outline-gray-600': layout.type === '3',
          'rounded cursor-pointer': true,
        }"
        @click="selectLayoutType('3')"
      >
        <img :src="Layout3" alt="layout3" class="w-[300px]" />
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-3 p-2">
    <label class="flex items-center text-xl font-bold">Secciones</label>
    <div class="flex flex-wrap w-full">
      <div
        v-for="section in layout?.sections"
        :key="section.id"
        :class="sectionWidthClass + ' p-2'"
      >
        <div class="flex flex-col gap-3 outline outline-2 outline-gray-600 rounded p-2">
          <h1 class="flex justify-center">Posicion {{ section.position }}</h1>
          <div
            v-for="sectionImage in section.sectionImages"
            :key="sectionImage.id"
            class="flex items-center gap-3 w-full"
          >
            <FileSelector
              :handleSelectImage="handleSelectImage"
              :genericImage="genericImage"
              :sectionId="section.id"
              :sectionImageId="sectionImage.id"
              :thumbnailUrl="sectionImage.thumbnailUrl"
              :aspectRatio="section.aspectRatio"
            ></FileSelector>
            <div class="flex gap-3 w-full">
              <input
                id="time"
                type="text"
                placeholder="Tiempo"
                v-model="sectionImage.time"
                class="h-10 w-full rounded-xl p-1 shadow"
              />
              <label for="time" class="flex items-center">Seg</label>
              <button
                class="h-10 w-10 bg-green-400 hover:bg-green-600 rounded-full"
                @click="removeSectionImage(section.id, sectionImage.id)"
              >
                X
              </button>
            </div>
          </div>
          <button
            className="w-full h-10 bg-green-400 hover:bg-green-600 rounded"
            @click="addSectionImage(section)"
          >
            Agregar imagen
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-end p-2">
    <button class="px-5 h-10 bg-green-400 hover:bg-green-600 rounded" @click="handleSubmit">
      Guardar
    </button>
  </div>
</template>
