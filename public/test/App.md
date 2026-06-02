<script>
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display/cubism4';

window.PIXI = PIXI;

let app;
let model;

export default {
  name: 'Live2DDemo',
  async mounted() {
    const canvas = this.$refs.liveCanvas;
    
    if (!canvas) {
      console.error('Canvas 元素未找到');
      return;
    }
    
    const width = canvas.parentElement.offsetWidth;
    const height = canvas.parentElement.offsetHeight;
    
    console.log('Canvas 尺寸:', width, height);
    
    app = new PIXI.Application({
      view: canvas,
      width: width,
      height: height,
      autoStart: true,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });

    try {
      console.log('开始加载模型...');
      model = await Live2DModel.from('/HeiJiao/八千代辉夜姬.model3.json');
      console.log('模型加载完成:', model);

      const scale = Math.min(width / model.width, height / model.height) * 0.8;
      model.scale.set(scale);
      model.x = (width - model.width * scale) / 2;
      model.y = (height - model.height * scale) / 2;

      app.stage.addChild(model);
      console.log('模型已添加到舞台');
    } catch (error) {
      console.error("模型加载失败:", error);
    }
  },
  
  beforeUnmount() {
    model?.destroy();
    app?.destroy(true, { children: true });
  }
}
</script>

<template>
  <div class="app">
     <canvas ref="liveCanvas"></canvas>
  </div>
</template>

<style scoped>
.app {
  /* 确保父容器有高度，否则 canvas 可能高度为 0 */
  width: 100%;
  height: 100vh; 
  background-color: #f1e6aa;
  overflow: hidden;
}
</style>