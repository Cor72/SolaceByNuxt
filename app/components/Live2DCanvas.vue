<template>
  <div class="live2d-wrapper">
    <canvas ref="liveCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display/cubism4'

window.PIXI = PIXI

const liveCanvas = ref(null)
let app = null
let model = null

onMounted(async () => {
  const canvas = liveCanvas.value

  if (!canvas) {
    console.error('Canvas 元素未找到')
    return
  }

  const width = canvas.parentElement.offsetWidth
  const height = canvas.parentElement.offsetHeight

  app = new PIXI.Application({
    view: canvas,
    width: width,
    height: height,
    autoStart: true,
    backgroundAlpha: 0,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
  })

  try {
    model = await Live2DModel.from('/HeiJiao/yachiyo.model3.json')

    const scale = Math.min(width / model.width, height / model.height) * 0.8
    model.scale.set(scale)
    model.x = (width - model.width * scale) / 2
    model.y = (height - model.height * scale) / 2

    app.stage.addChild(model)
  } catch (error) {
    console.error('模型加载失败:', error)
  }
})

onUnmounted(() => {
  model?.destroy()
  app?.destroy(true, { children: true })
})
</script>

<style scoped>
.live2d-wrapper {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 300px;
  height: 400px;
  pointer-events: none;
  z-index: 9998;
}
</style>
