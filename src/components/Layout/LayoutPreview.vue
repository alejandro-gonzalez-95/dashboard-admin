<script setup>
import { onMounted, ref } from 'vue'
import { getFile } from '../../services/api.service.js'
import { timeout } from '../../utils/Utils.js'

const { layout } = defineProps(['layout'])

const layoutType = ref(layout.type)
const sections = ref([])
const section1CurrentImage = ref(null)
const section2CurrentImage = ref(null)
const section3CurrentImage = ref(null)

let section1CurrentImagePosition = 0
let section2CurrentImagePosition = 0
let section3CurrentImagePosition = 0

onMounted(() => {
  getImages().then(() => {
    startPreview()
  })
})

const getImages = async () => {
  const sectionsData = []

  for (const sectionData of layout.sections) {
    const section = {
      id: sectionData.id,
      position: sectionData.position,
      aspectRatio: sectionData.aspectRatio,
      currentImagePosition: 0,
      sectionImages: [],
    }

    for (const sectionImageData of sectionData.sectionImages) {
      const image = await getFile(sectionImageData.file.name)

      const sectionImage = {
        position: sectionImageData.position,
        time: sectionImageData.time,
        name: sectionImageData.file.name,
        image: image,
      }

      section.sectionImages.push(sectionImage)
    }

    sectionsData.push(section)
  }

  console.log(sectionsData)
  sections.value = sectionsData

  return sectionsData
}

const startPreview = () => {
  sections.value.forEach((section) => {
    setNextImage(section.id)
  })
}

const setNextImage = async (sectionId) => {
  const section = sections.value.find((section) => section.id === sectionId)
  let newCurrentImagePosition = 0

  if (section.position === 1) newCurrentImagePosition = section1CurrentImagePosition + 1
  if (section.position === 2) newCurrentImagePosition = section2CurrentImagePosition + 1
  if (section.position === 3) newCurrentImagePosition = section3CurrentImagePosition + 1

  if (newCurrentImagePosition > section.sectionImages.length) {
    newCurrentImagePosition = 1
  }

  const currentSectionImage = section.sectionImages.find(
    (sectionImage) => sectionImage.position === newCurrentImagePosition,
  )

  if (section.position === 1) {
    section1CurrentImage.value = currentSectionImage.image
    section1CurrentImagePosition = newCurrentImagePosition
  }
  if (section.position === 2) {
    section2CurrentImage.value = currentSectionImage.image
    section2CurrentImagePosition = newCurrentImagePosition
  }
  if (section.position === 3) {
    section3CurrentImage.value = currentSectionImage.image
    section3CurrentImagePosition = newCurrentImagePosition
  }

  await timeout(currentSectionImage.time * 1000)
  setNextImage(section.id)
}
</script>

<template>
  <div :style="{ aspectRatio: 16 / 9 }" class="w-full bg-amber-100 rounded">
    <div
      v-if="layoutType === '1'"
      :style="{ aspectRatio: 16 / 9 }"
      class="w-full bg-red-100 outline outline-2 outline-gray-400"
    >
      <img :src="section1CurrentImage" class="object-cover w-full" />
    </div>

    <div v-if="layoutType === '2'" class="flex w-full h-full outline outline-2 outline-gray-400">
      <div :style="{ aspectRatio: 8 / 9 }" class="h-full bg-red-100">
        <img :src="section1CurrentImage" class="object-cover w-full" />
      </div>
      <div :style="{ aspectRatio: 8 / 9 }" class="flex flex-col h-full">
        <div :style="{ aspectRatio: 16 / 9 }" class="flex flex-col w-full bg-blue-100">
          <img :src="section2CurrentImage" class="object-cover w-full" />
        </div>
        <div :style="{ aspectRatio: 16 / 9 }" class="flex flex-col w-full bg-green-100">
          <img :src="section3CurrentImage" class="object-cover w-full" />
        </div>
      </div>
    </div>

    <div v-if="layoutType === '3'" class="flex w-full h-full outline outline-2 outline-gray-400">
      <div :style="{ aspectRatio: 8 / 9 }" class="flex flex-col h-full">
        <div :style="{ aspectRatio: 16 / 9 }" class="flex flex-col w-full bg-blue-100">
          <img :src="section1CurrentImage" class="object-cover w-full" />
        </div>
        <div :style="{ aspectRatio: 16 / 9 }" class="flex flex-col w-full bg-green-100">
          <img :src="section3CurrentImage" class="object-cover w-full" />
        </div>
      </div>
      <div :style="{ aspectRatio: 8 / 9 }" class="h-full bg-red-100">
        <img :src="section2CurrentImage" class="object-cover w-full" />
      </div>
    </div>
  </div>
</template>
