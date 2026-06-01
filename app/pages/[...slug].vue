<template>
  <div class="blog-layout">
    
    <!-- ==================== 1. 顶部导航栏 ==================== -->
    <!-- 添加 head-hidden 类来控制隐藏 -->
    <header class="top-nav" :class="{ 'head-hidden': !isHeaderVisible }">
      <div class="nav-inner">
        <div class="nav-content">
          <span class="nav-title">A Cup of Tea</span>
        </div>
        
        <!-- 右侧：可以放首页链接等 -->
        <div class="nav-links">
          <nuxt-link to="/">返回首页</nuxt-link>
        </div>
      </div>
    </header>

    <!-- ==================== 2. 主体区域 ==================== -->
    <div class="main-container">
      
      <!-- 左侧：目录 -->
      <aside class="toc-aside">
        <div class="toc-title">目录</div>
        <!-- 循环渲染目录 -->
        <ul class="toc-list">
          <li v-for="link in toc" :key="link.id" :class="{ 'active': activeId === link.id }">
            <a :href="`#${link.id}`">{{ link.text }}</a>
          </li>
        </ul>
      </aside>

      <!-- 右侧：正文内容 -->
      <div class="article-wrapper">
        <!-- 文章头部信息 -->
        <header class="article-header">
          <h1 class="article-title">{{ article?.title }}</h1>
          <p class="article-meta">发布于：{{ article?.date }}</p>
        </header>

        <!-- 正文渲染：使用 prose 样式 -->
        <article class="prose lg:prose-lg">
          <ContentRenderer :value="article" />
        </article>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const slug = route.params.slug

// 1. 获取文章数据
const { data: article } = await useAsyncData(`doc-${slug}`, () => {
  return queryCollection('content').path(`/${slug}`).first()
})

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

// 2. 提取目录
// Nuxt Content 会自动解析 md 中的标题生成 toc
const toc = computed(() => {
  return article.value?.body?.toc?.links || []
})

// 3. 滚动监听逻辑 (顶部隐藏 & 目录高亮)
const isHeaderVisible = ref(true)
const activeId = ref('')
let lastScrollY = 0

const handleScroll = () => {
  const currentScrollY = window.scrollY

  // (1) 顶部导航栏隐藏逻辑
  // 如果向下滑动超过 100px 且比上次位置低，则隐藏
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    isHeaderVisible.value = false
  } else {
    isHeaderVisible.value = true
  }
  lastScrollY = currentScrollY

  // (2) 目录高亮逻辑 (简单版：检测哪个标题在视口内)
  const headings = document.querySelectorAll('article h1, article h2, article h3')
  let currentActive = ''
  
  headings.forEach(heading => {
    // 如果标题顶部位置距离视口顶部小于 150px
    if (heading.getBoundingClientRect().top <= 150) {
      currentActive = heading.getAttribute('id')
    }
  })
  activeId.value = currentActive
}

// 挂载和卸载监听器
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* --- 1. 顶部导航栏样式 --- */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  border-bottom: 1px solid #eee;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
  display: flex;
  align-items: center;
  padding: 0 40px;
}

/* 隐藏状态：向上移动自身高度 */
.top-nav.head-hidden {
  transform: translateY(-100%);
}

.nav-inner {
  width: 100%;
  max-width: 1400px; /* 限制最大宽度，和下面内容对齐 */
  margin: 0 auto;
  display: flex;
  justify-content: space-between; /* 左右分布 */
  align-items: center;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.nav-links a {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

/* --- 2. 主体布局样式 --- */
.main-container {
  /* 顶部留出导航栏的高度 */
  margin-top: 60px;
  /* 开启 Flex 布局 */
  display: flex;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding: 40px 20px;
}

/* --- 左侧目录样式 --- */
.toc-aside {
  width: 250px;
  /* 固定定位，跟随滚动 */
  position: sticky;
  top: 100px; /* 距离顶部的距离 */
  height: fit-content;
  flex-shrink: 0; /* 不被压缩 */
  padding-right: 20px;
  border-right: 1px solid #eee;
}

.toc-title {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 15px;
  color: #333;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin-bottom: 10px;
}

.toc-list a {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  padding: 4px 0;
  border-left: 2px solid transparent;
  padding-left: 10px;
  transition: all 0.2s;
}

.toc-list a:hover {
  color: #000;
}

/* 当前激活的目录项 */
.toc-list li.active a {
  color: #4A90E2; /* 你的主题蓝色 */
  border-left-color: #4A90E2;
  font-weight: bold;
}

/* --- 右侧正文样式 --- */
.article-wrapper {
  flex: 1; /* 占据剩余空间 */
  background: #fff;
  padding: 40px 60px;
  border-radius: 8px;
  min-height: calc(100vh - 140px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}

.article-header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.article-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 10px;
}

.article-meta {
  color: #888;
  font-size: 0.9rem;
}

/* --- 响应式处理 (手机端隐藏目录) --- */
@media (max-width: 1024px) {
  .toc-aside {
    display: none;
  }
  .article-wrapper {
    padding: 20px;
  }
}
</style>