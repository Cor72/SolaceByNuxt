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
/* 默认样式：PC 端显示 */
.live2d-wrapper {
  position: fixed;
  bottom: 120px;
  right: 120px;
  width: 600px;
  height: 800px;
  pointer-events: none;
  z-index: 9998;
}

/* 手机端适配：当屏幕宽度小于 768px 时触发 */
@media screen and (max-width: 768px) {
  .live2d-wrapper {
    /* 手机端缩小模型尺寸 */
    width: 200px;   /* 手机端固定宽度，可根据需要调整 */
    height: 280px;  /* 手机端固定高度，大致保持比例 */
    
    /* 手机端位置调整，避免挡住主要内容 */
    bottom: 70px;   /* 离底部近一点 */
    transform: translate(-50%, -50%);
  }
}
</style>
