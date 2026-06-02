<template>
  <!-- ==================== 第一部分：全屏封面 ==================== -->
  <div class="cover-section">
    <!-- 1. 背景图 -->
    <img src="/top/topground.jpg" class="bg-img" />
    
    <!-- 3. 中间的标题内容 -->
    <div class="cover-content">
      <h1 class="title">A cup of Tea</h1>
      <p class="subtitle">Loved by Cor72</p>
    </div>

    <!-- 4. 底部的向下箭头 -->
    <div class="scroll-down-hint" @click="scrollToContent">
  <div class="arrow-icon">
    <svg viewBox="0 0 24 24" width="50" height="50" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </div>
    </div>
  </div>

  <!-- ==================== 第二部分：博客/导航内容 ==================== -->
  <div class="content-section" ref="contentArea">
    <div class="container">
      <h2>博客文章</h2>
      
    <div class="post-item">
      <!-- 使用 NuxtLink 进行路由跳转，to="/blog/文件名" -->
      <nuxt-link to="/blog/my-first-post">
        <h3>我的第一篇博客</h3>
        <p>这是摘要内容...</p>
      </nuxt-link>
    </div>
    </div>
  </div>

  <!-- Live2D 角色 -->
  <Live2DCanvas />
</template>

<script setup lang="ts">
const contentArea = ref<HTMLElement | null>(null);

const scrollToContent = () => {
  contentArea.value?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<!-- 全局样式：只写一次，用于重置和设置网页底色 -->
<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden; 
/* background: linear-gradient(25deg, #89CFF0 0%, #A2D2FF 30%, #FFF9C4 100%); */
/* background: linear-gradient(25deg, #4A90E2 0%, #89CFF0 50%, #FFF9C4 100%); */
/* background: linear-gradient(25deg, #A1C4FD 0%, #C2E9FB 50%, #FFF5E1 100%); */
background: linear-gradient(28deg, #5395df 0%, #89CFF0 40%, #ffffff 100%);
}
</style>

<!-- 组件样式： scoped 只作用于当前组件 -->
<style scoped>
/* --- 第一屏封面样式 --- */
.cover-section {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.bg-img {
  position: absolute;
  top: -70px; /* 建议改为0，除非你想特意把图片往下挪 */
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
  /* 图片底部渐变透明，露出 body 的蓝色背景 */
  mask-image: linear-gradient(to bottom, black 0%, black 50%, transparent 100%); 
  -webkit-mask-image: linear-gradient(to bottom, black 0%, black 50%, transparent 100%); /* 兼容写法 */
}

.cover-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: translateY(-30px); 
}

.title {
  font-size: 4rem;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  letter-spacing: 5px;
}

.subtitle {
  color: rgba(255,255,255,0.9);
  margin-top: 10px;
  letter-spacing: 2px;
}

/* --- 向下箭头样式 --- */
.scroll-down-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.8); /* 在蓝色背景上，白色箭头更清晰 */
  font-size: 14px;
  cursor: pointer;
  padding-bottom: 30px;
  transition: color 0.3s;
}

.scroll-down-hint:hover {
  color: #fff;
}

.arrow-icon {
  font-size: 24px;
  margin-top: 5px;
  animation: bounce 2s infinite; 
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* --- 第二屏内容样式 --- */
.content-section {
  min-height: 100vh; 
  /* background: rgba(255, 255, 255, 0.1);  */
  
  padding: 60px 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

/* 第二屏的文章卡片 */
.post-item {
  /* 在蓝色背景上，给卡片加一点毛玻璃效果会很好看 */
  background: rgba(255, 255, 255, 0.85); 
  backdrop-filter: blur(5px);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.post-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
</style>