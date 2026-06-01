<template>
  <!-- 1. 根容器：负责全屏背景图 -->
  <div class="blog-root">
    
    <!-- 1.1 背景图层 -->
    <div class="background-layer"></div>

    <!-- 1.2 顶部导航栏 (悬浮fixed) -->
    <header class="top-nav" :class="{ 'nav-hidden': isNavHidden }">
      <div class="nav-inner">
        <!-- 左侧Logo+标题 -->
        <div class="nav-brand">
          <img src="/top/topground.jpg" alt="Logo" class="nav-avatar" />
          <span class="nav-title">A Cup of Tea</span>
        </div>
        <!-- 右侧链接 -->
        <div class="nav-actions">
          <nuxt-link to="/" class="nav-link">返回首页</nuxt-link>
        </div>
      </div>
    </header>

    <!-- 1.3 主体内容区 -->
    <div class="main-container">
      
      <!-- 左侧：目录 (sticky定位) -->
      <aside class="sidebar-toc">
        <div class="toc-header">✿ 目录</div>
        <ul class="toc-list">
          <li 
            v-for="link in toc" 
            :key="link.id" 
            :class="{ 'is-active': activeId === link.id }"
          >
            <a :href="`#${link.id}`">{{ link.text }}</a>
          </li>
        </ul>
      </aside>

      <!-- 右侧：文章内容 -->
      <main class="article-container">
        <!-- 文章头部 -->
        <header class="article-header">
          <h1 class="post-title">{{ article?.title }}</h1>
          <div class="post-meta">
            <span class="date">📅 {{ article?.date }}</span>
          </div>
        </header>

        <!-- 文章正文 (Tailwind Prose) -->
        <article class="post-content prose">
          <ContentRenderer :value="article" />
        </article>
        
        <!-- 文章底部 -->
        <footer class="post-footer">
          <div class="decor-line"></div>
          <p>感谢阅读 ✿</p>
        </footer>
      </main>
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// --- 数据获取 ---
const route = useRoute()
const slug = route.params.slug

const { data: article } = await useAsyncData(`doc-${slug}`, () => {
  return queryCollection('content').path(`/${slug}`).first()
})

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

// --- 目录提取 ---
const toc = computed(() => {
  return article.value?.body?.toc?.links || []
})

// --- 滚动交互逻辑 ---
const isNavHidden = ref(false)
const activeId = ref('')
let lastScrollY = 0

const handleScroll = () => {
  const currentScrollY = window.scrollY

  // 1. 导航栏显隐逻辑 (向下滚动隐藏，向上滚动显示)
  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    isNavHidden.value = true
  } else {
    isNavHidden.value = false
  }
  lastScrollY = currentScrollY

  // 2. 目录高亮逻辑
  const headings = document.querySelectorAll('article h2, article h3') // 一般只关注h2, h3
  let current = ''
  
  headings.forEach(heading => {
    // 如果标题距离视口顶部小于 150px
    if (heading.getBoundingClientRect().top <= 150) {
      current = heading.getAttribute('id')
    }
  })
  activeId.value = current
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ==================== 1. 根布局与背景 ==================== */
.blog-root {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.background-layer {
  position: fixed; /* 固定不动 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/top/pageground.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  z-index: -1; /* 置于最底层 */
  
  /* 可选：加一点点蒙版，让文字更清晰 */
  background-color: rgba(255, 255, 255, 0.1);
  background-blend-mode: overlay;
}

/* ==================== 2. 顶部导航栏 ==================== */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 999; /* 比内容区高 */
  
  /* 毛玻璃效果 */
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 182, 193, 0.3);
  box-shadow: 0 2px 20px rgba(255, 182, 193, 0.2);
  
  /* 动画过渡 */
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.top-nav.nav-hidden {
  transform: translateY(-100%);
}

.nav-inner {
  max-width: 1200px; /* 控制宽度与下方内容对齐 */
  height: 100%;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.nav-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ff6b9d;
  letter-spacing: 1px;
}

.nav-link {
  font-size: 0.9rem;
  color: #666;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-link:hover {
  background: rgba(255, 182, 193, 0.2);
  color: #ff6b9d;
}

/* ==================== 3. 主体内容布局 ==================== */
.main-container {
  padding-top: 80px; /* 给导航栏留出空间 */
  padding-bottom: 60px;
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  gap: 30px; /* 目录和正文的间距 */
}

/* ==================== 4. 左侧目录 ==================== */
.sidebar-toc {
  width: 240px;
  flex-shrink: 0;
  
  /* Sticky 定位：跟随滚动 */
  position: sticky;
  top: 100px; /* 距离顶部留出导航栏高度 */
  height: fit-content;
  
  /* 样式 */
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 182, 193, 0.3);
  box-shadow: 0 8px 24px rgba(255, 182, 193, 0.15);
}

.toc-header {
  font-size: 1rem;
  font-weight: bold;
  color: #ff6b9d;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px dashed rgba(255, 182, 193, 0.5);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin-bottom: 6px;
}

.toc-list a {
  display: block;
  font-size: 0.9rem;
  color: #555;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.toc-list a:hover {
  background: rgba(255, 182, 193, 0.15);
  color: #ff6b9d;
  transform: translateX(4px);
}

/* 当前激活项 */
.toc-list li.is-active a {
  background: rgba(255, 182, 193, 0.2);
  color: #ff6b9d;
  font-weight: bold;
  border-left-color: #ff6b9d;
}

/* ==================== 5. 右侧正文 ==================== */
.article-container {
  flex: 1;
  min-width: 0; /* 防止flex溢出 */
  
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  padding: 48px 56px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.article-header {
  margin-bottom: 32px;
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 182, 193, 0.2);
}

.post-title {
  font-size: 2.4rem;
  font-weight: 800;
  color: #333;
  line-height: 1.3;
  margin-bottom: 12px;
}

.post-meta {
  font-size: 0.9rem;
  color: #999;
}

.post-content {
  line-height: 1.8;
  color: #333;
}

/* Markdown 细节美化 (配合 Prose) */
.post-content :deep(h2) {
  border-left: 5px solid #ff6b9d;
  padding-left: 15px;
  margin-top: 2.5rem;
}
.post-content :deep(p) {
  margin-bottom: 1.25rem;
}
.post-content :deep(img) {
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.post-content :deep(a) {
  color: #ff6b9d;
  text-decoration: none;
  border-bottom: 1px dashed #ff6b9d;
}
.post-content :deep(a):hover {
  color: #ff85ad;
}

/* 底部装饰 */
.post-footer {
  margin-top: 60px;
  text-align: center;
  color: #ccc;
  font-size: 0.9rem;
}
.decor-line {
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #ffb6c1, #ff6b9d);
  margin: 0 auto 12px;
  border-radius: 2px;
}

/* ==================== 6. 响应式 ==================== */
@media (max-width: 1024px) {
  .sidebar-toc {
    display: none; /* 平板/手机隐藏目录 */
  }
  .article-container {
    padding: 30px 24px;
  }
  .nav-inner {
    padding: 0 20px;
  }
}
</style>