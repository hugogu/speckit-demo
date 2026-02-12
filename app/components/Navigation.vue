<template>
  <nav class="navigation">
    <ul>
      <li><NuxtLink to="/">首页</NuxtLink></li>
      <li><NuxtLink to="/game">开始游戏</NuxtLink></li>
      <li><NuxtLink to="/history">历史记录</NuxtLink></li>
      <li><NuxtLink to="/print">打印游戏</NuxtLink></li>
    </ul>
  </nav>
</template>

<style scoped>
.navigation {
  background-color: #f0f0f0;
  padding: 10px 0;
}

ul {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 0;
  margin: 0;
}

li a {
  text-decoration: none;
  color: #1890ff;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 4px;
}

li a:hover {
  background-color: #e6f7ff;
}

li a.router-link-exact-active {
  color: white;
  background-color: #1890ff;
}
</style>
