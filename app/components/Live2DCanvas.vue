<template>
  <div class="live2d-wrapper" v-show="visible">
    <canvas ref="liveCanvas"></canvas>
  </div>
  <!-- 切换按钮：始终可见 -->
  <div class="live2d-toggle" @click="toggle">
    <span>{{ visible ? '隐藏' : '显示' }}</span>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display/cubism4'

window.PIXI = PIXI

const liveCanvas = ref(null)
const visible = ref(true)
let app = null
let model = null

/**
 * 模型拖拽方法
 */
function draggable(m) {
  m.buttonMode = true
  m.on('pointerdown', (e) => {
    m.dragging = true
    m._pointerX = e.data.global.x - m.x
    m._pointerY = e.data.global.y - m.y
  })
  m.on('pointermove', (e) => {
    if (m.dragging) {
      m.position.x = e.data.global.x - m._pointerX
      m.position.y = e.data.global.y - m._pointerY
    }
  })
  m.on('pointerupoutside', () => (m.dragging = false))
  m.on('pointerup', () => (m.dragging = false))
}

/**
 * 加载模型到 canvas
 */
async function loadModel() {
  const canvas = liveCanvas.value
  if (!canvas) return

  const width = canvas.parentElement.offsetWidth
  const height = canvas.parentElement.offsetHeight

  // 如果 app 已存在，先清除舞台上的旧模型
  if (model) {
    app.stage.removeChild(model)
    model.destroy()
    model = null
  }

  try {
    model = await Live2DModel.from('/HeiJiao/yachiyo.model3.json')

    const scale = Math.min(width / model.width, height / model.height) * 0.8
    model.scale.set(scale)
    model.x = (width - model.width * scale) / 2
    model.y = (height - model.height * scale) / 2

    app.stage.addChild(model)
    draggable(model)
  } catch (error) {
    console.error('模型加载失败:', error)
  }
}

/**
 * 切换显隐：隐藏时销毁模型，显示时重新加载
 */
async function toggle() {
  visible.value = !visible.value
  if (visible.value) {
    await nextTick()
    await loadModel()
  } else {
    // 隐藏时销毁模型释放资源
    if (model) {
      app.stage.removeChild(model)
      model.destroy()
      model = null
    }
  }
}

onMounted(async () => {
  const canvas = liveCanvas.value
  if (!canvas) return

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

  await loadModel()
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

.live2d-wrapper canvas {
  pointer-events: auto;
}

/* 切换按钮 */
.live2d-toggle {
  position: fixed;
  bottom: 45px;
  right: 45px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 182, 193, 0.3);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 9999;
  font-size: 0.85rem;
  color: #ff6b9d;
  transition: all 0.3s;
}

.live2d-toggle:hover {
  background: rgba(255, 182, 193, 0.3);
}

/* 手机端适配 */
@media screen and (max-width: 768px) {
  .live2d-wrapper {
    width: 200px;
    height: 280px;
    bottom: 70px;
    transform: translate(-50%, -50%);
  }

  .live2d-toggle {
    bottom: 20px;
    right: 20px;
    padding: 4px 10px;
    font-size: 0.8rem;
  }
}
</style>
