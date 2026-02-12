<template>
  <div class="home-page">
    <h1>数独学习游戏</h1>
    <p>一个适合小学生的数独游戏，支持多种难度和尺寸</p>
    <NuxtLink to="/game" class="start-button">开始游戏</NuxtLink>
    <div class="features">
      <div class="feature">
        <h3>多种难度</h3>
        <p>简单、中等、困难三种难度级别</p>
      </div>
      <div class="feature">
        <h3>多种尺寸</h3>
        <p>4×4, 9×9, 16×16三种面板大小</p>
      </div>
      <div class="feature">
        <h3>操作灵活</h3>
        <p>支持点击和拖拽两种输入方式</p>
      </div>
      <div class="feature">
        <h3>打印功能</h3>
        <p>生成可打印的数独练习纸</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: {
    name: 'default',
    customProperty: 'customValue'
  }
});
</script>

<style scoped>
.home-page {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.start-button {
  display: inline-block;
  background-color: #1890ff;
  color: white;
  padding: 12px 30px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 40px;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: #40a9ff;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.feature {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  margin-top: 0;
  color: #1890ff;
}

@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
