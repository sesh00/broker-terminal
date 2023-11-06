<template>
  <div>
    <ul>
      <li><router-link to="/">Главная</router-link></li>
      <li><router-link to="/main">Торговая страница</router-link></li>
      <li><router-link to="/admin">Админская страница</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  text-align: left;
}
</style>