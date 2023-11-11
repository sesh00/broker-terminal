<template>
  <div class="app-container">
    <div class="navigation-menu">
      <h1>Меню</h1>
      <ul>
        <li @click="navigateTo('/')">Логин</li>
        <li @click="navigateTo('/main')">Торговля</li>
        <li @click="navigateTo('/admin')">Статистика</li>
      </ul>
    </div>
    <div class="content">
      <!-- Твой контент здесь -->
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
}

.navigation-menu {
  min-width: 200px;
  padding: 20px;
  background-color: #fff; /* Цвет фона меню */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Тень */
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row; /* Изменение направления расположения элементов на горизонтальное */
}

li {
  margin-right: 10px; /* Добавлен отступ между кнопками */
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

li:hover {
  background-color: #f2f2f2; /* Цвет фона при наведении */
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
