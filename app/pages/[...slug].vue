<template>
  <div class="blog-layout">
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

const activeId = ref('')
let lastScrollY = 0
let ticking = false

const handleScroll = () => {
  if (ticking) return
  ticking = true

  requestAnimationFrame(() => {
    const currentScrollY = window.scrollY
    lastScrollY = currentScrollY

    const headings = document.querySelectorAll('article h1, article h2, article h3')
    let currentActive = ''

    headings.forEach(heading => {
      if (heading.getBoundingClientRect().top <= 150) {
        currentActive = heading.getAttribute('id')
      }
    })
    activeId.value = currentActive

    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* --- 背景样式 --- */
.blog-layout {
  min-height: 100vh;
  background-image: url('/top/pageground.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
}

.blog-layout > * {
  position: relative;
  z-index: 1;
}

.nav-inner {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
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

/* --- 2. 主体布局样式 --- */
.main-container {
  padding-top: 40px;
  display: flex;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 40px 80px;
  gap: 40px;
}

/* --- 左侧目录样式 --- */
.toc-aside {
  width: 240px;
  position: sticky;
  top: 40px;
  height: fit-content;
  flex-shrink: 0;
  padding: 24px 20px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 182, 193, 0.3);
  box-shadow: 0 8px 32px rgba(255, 182, 193, 0.1);
}

.toc-title {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 20px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(255, 182, 193, 0.3);
}

.toc-title::before {
  content: '✿';
  font-size: 1.1rem;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin-bottom: 4px;
}

.toc-list a {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  padding: 10px 14px;
  border-radius: 10px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.toc-list a:hover {
  color: #ff6b9d;
  background: linear-gradient(90deg, rgba(255, 182, 193, 0.15), transparent);
  border-left-color: rgba(255, 182, 193, 0.5);
  transform: translateX(4px);
}

/* 当前激活的目录项 */
.toc-list li.active a {
  color: #ff6b9d;
  background: linear-gradient(90deg, rgba(255, 182, 193, 0.2), rgba(192, 132, 252, 0.1));
  border-left-color: #ff6b9d;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.15);
}

/* --- 右侧正文样式 --- */
.article-wrapper {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 48px 64px;
  border-radius: 20px;
  min-height: calc(100vh - 160px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.article-header {
  margin-bottom: 48px;
  padding-bottom: 28px;
  border-bottom: 2px solid rgba(255, 182, 193, 0.2);
  position: relative;
}

.article-header::after {
  content: '✿ ✿ ✿';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 0 16px;
  color: #ffb6c1;
  font-size: 0.8rem;
  letter-spacing: 4px;
}

.article-title {
  font-size: 2.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #333, #555);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  line-height: 1.3;
}

.article-meta {
  color: #999;
  font-size: 0.9rem;
  font-style: italic;
}

/* --- 响应式处理 --- */
@media (max-width: 1024px) {
  .toc-aside {
    display: none;
  }
  .article-wrapper {
    padding: 24px;
    border-radius: 16px;
  }
  .main-container {
    padding: 20px 24px;
  }
}
</style>