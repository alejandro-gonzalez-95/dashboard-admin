<script setup>
import { ref, computed, onMounted } from 'vue'

const { videoSrc } = defineProps(['videoSrc'])

const cropArea = ref({
  x: 50,
  y: 50,
  width: 200,
  height: 150,
})
const isCropping = ref(false)
const startCoords = ref({ x: 0, y: 0 })

const videoPlayer = ref(null)
const canvas = ref(null)
const aspectRatio = ref(0)
const thumbnail = ref(null)

defineExpose({
  thumbnail,
})

const cropAreaStyles = computed(() => ({
  position: 'absolute',
  top: `${cropArea.value.y}px`,
  left: `${cropArea.value.x}px`,
  width: `${cropArea.value.width}px`,
  height: `${cropArea.value.height}px`,
  border: '2px dashed red',
  cursor: 'move',
}))

const videoPlayerStyles = computed(() => ({
  aspectRatio: aspectRatio.value,
}))

onMounted(() => {
  console.log('VideoCropper montado')
  videoPlayer.value.onloadedmetadata = () => {
    videoPlayer.value.currentTime = 1
    const { videoWidth, videoHeight } = videoPlayer.value
    aspectRatio.value = (videoWidth / videoHeight).toFixed(2) // Redondea a 2 decimales
    console.log('Dimensiones del video:', videoWidth, videoHeight, aspectRatio.value)
  }

  videoPlayer.value.oncanplay = () => {
    const canvas = document.createElement('canvas')
    canvas.width = videoPlayer.value.videoWidth
    canvas.height = videoPlayer.value.videoHeight
    const ctx = canvas.getContext('2d')

    ctx.drawImage(videoPlayer.value, 0, 0, canvas.width, canvas.height)
    thumbnail.value = canvas.toDataURL('image/png') // Convierte el frame en imagen
    // URL.revokeObjectURL(videoFile.value)
  }
})

// Control de la reproducción
function onPlay() {
  console.log('Video está reproduciéndose')
}

function onPause() {
  console.log('Video pausado')
}

// Funciones para el recorte
function startCrop(event) {
  isCropping.value = true
  startCoords.value = { x: event.clientX, y: event.clientY }
}

function resizeCrop(event) {
  if (!isCropping.value) return

  const dx = event.clientX - startCoords.value.x
  const dy = event.clientY - startCoords.value.y

  cropArea.value.x += dx
  cropArea.value.y += dy

  cropArea.value.x = cropArea.value.x < 0 ? 0 : cropArea.value.x
  cropArea.value.y = cropArea.value.y < 0 ? 0 : cropArea.value.y

  startCoords.value = { x: event.clientX, y: event.clientY }
}

function checkOver(event) {
  const videoRect = videoPlayer.value.getBoundingClientRect()

  const cropRect = {
    x: cropArea.value.x + videoRect.left,
    y: cropArea.value.y + videoRect.top,
    width: cropArea.value.width,
    height: cropArea.value.height,
  }

  const isMouseOverCropArea =
    event.clientX >= cropRect.x &&
    event.clientX <= cropRect.x + cropRect.width &&
    event.clientY >= cropRect.y &&
    event.clientY <= cropRect.y + cropRect.height

  console.log('isMouseOverCropArea:', isMouseOverCropArea)
  if (!isMouseOverCropArea) {
    endCrop()
  }
}

function endCrop() {
  isCropping.value = false
}

// Función para aplicar el recorte
function applyCrop() {
  const video = videoPlayer.value
  const ctx = canvas.value.getContext('2d')

  // Ajustar el tamaño del canvas según las dimensiones del área de recorte
  canvas.value.width = cropArea.value.width
  canvas.value.height = cropArea.value.height

  // Pausar el video para tomar la captura
  video.pause()
  // Dibujar el recorte en el canvas
  ctx.drawImage(
    video,
    cropArea.value.x,
    cropArea.value.y,
    cropArea.value.width,
    cropArea.value.height,
    0,
    0,
    cropArea.value.width,
    cropArea.value.height,
  )

  // Mostrar el canvas con el recorte
  const croppedVideoSrc = canvas.value.toDataURL()
  console.log('Resultado del recorte:', croppedVideoSrc)
}
</script>

<template>
  <div class="video-cropper" @mousemove="checkOver">
    <!-- Reproductor de video -->
    <video
      ref="videoPlayer"
      controls
      :src="videoSrc"
      @play="onPlay"
      @pause="onPause"
      class="video-player"
      :style="videoPlayerStyles"
    ></video>

    <!-- Contenedor para el área de recorte -->
    <!-- <div
      class="crop-area"
      :style="cropAreaStyles"
      @mousedown="startCrop"
      @mousemove="resizeCrop"
      @mouseup="endCrop"
    ></div> -->

    <!-- Botón para aplicar recorte
    <button @click="applyCrop">Aplicar recorte</button> -->

    <!-- Contenedor para mostrar el resultado del recorte -->
    <!-- <canvas ref="canvas" style="display: none"></canvas> -->
  </div>
</template>

<style scoped>
.video-cropper {
  position: relative;
  width: 100%;
  margin: auto;
  margin-top: 10px;
}

.video-player {
  width: 100%;
  max-height: 100%;
  margin: auto;
}

.crop-area {
  background: rgba(255, 0, 0, 0.3);
  cursor: move;
}
</style>
