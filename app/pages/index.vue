<template>
  <!-- ==================== 第一部分：全屏封面（遮罩层） ==================== -->
  <Transition name="fade">
    <div class="cover-section" v-if="showCover" @click="showCover = false">
      <!-- 1. 背景图 -->
      <img src="/top/topground.jpg" class="bg-img" />
      
      <!-- 3. 中间的标题内容 -->
      <div class="cover-content">
        <h1 class="title">A cup of Tea</h1>
        <p class="subtitle">Loved by Cor72</p>
      </div>
    </div>
  </Transition>

  <!-- ==================== 第二部分：博客/导航内容 ==================== -->
  <div class="background-section">
    <!-- 壁纸背景 -->
    <img src="/Background/1.jpg" class="bg-image" alt="background" />
    <!-- 灰色遮罩 -->
    <div class="bg-overlay"></div>
  </div>

  <!-- 实时时钟 -->
  <div class="clock">
    <div class="time">{{ currentTime }}</div>
    <div class="text">Do What You Love </div>
  </div>

  <!-- Live2D 角色 -->
  <!-- <Live2DCanvas /> -->
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const showCover = ref(true)
const currentTime = ref('00:00:00')

let timer: number | undefined

const updateTime = () => {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${h}:${m}:${s}`
}

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden; 
  overflow-y: hidden;
}

/* 渐隐动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2.5s ease;
  transition-delay: 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 封面样式 */
.cover-section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  cursor: pointer;
}
.cover-section::after{
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 1001;
}
.cover-content {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 1002;
}
.cover-content .title {
  font-size: 3.5em;
}
.cover-content .subtitle {
  font-size: 1.3em;
  letter-spacing: 0.05em;
}

.cover-section .bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 壁纸背景样式 */
.background-section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-section .bg-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.background-section .bg-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
    radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);
}

/* 实时时钟样式 */
.clock {
  position: absolute;
  top: 23%;
  left: 52%;
  transform: translate(-50%, -50%);
  z-index: 10;
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
}
.clock .time {
  color: rgba(255, 255, 255, 0.85);
  font-family: "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-weight: 100;
  font-size: clamp(3rem, 8vw, 6rem);
  letter-spacing: 0.05em;
  font-variant-numeric: tabular-nums; /* 等宽数字，避免跳动 */
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.35);
}
.clock .text {
  color: rgba(255, 255, 255, 0.75);
  font-size: 24px;
  text-align: center;
  letter-spacing: 0.05em;
}



</style>