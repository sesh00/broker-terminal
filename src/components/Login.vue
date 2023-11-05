<template>
  <div>
    <label for="brokerName">Введите имя брокера:</label>
    <input v-model="brokerName" type="text" id="brokerName" />
    <button @click="login">Войти</button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      brokerName: "",
    };
  },
  methods: {
    login() {
      // Обновляем состояние брокера в хранилище Vuex
      this.$store.dispatch('updateBrokerName', this.brokerName);
      // Перенаправляем пользователя на главную страницу
      this.$router.push('/main'); // Добавлен параметр params

    },
  },
};
</script>

<style scoped>
/* Стили для компонента Login */
</style>
