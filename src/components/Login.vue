<template>
  <div class="login-container">
    <label for="brokerName">Введите имя брокера:</label>
    <input v-model="brokerName" type="text" id="brokerName" />
    <button @click="login">Войти</button>
    <p v-if="loginError">{{ loginError }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      brokerName: "",
      loginError: "",
    };
  },
  methods: {
    async login() {
      try {
        const success = await this.$store.dispatch('loadBrokerData', this.brokerName);

        if (success) {
          this.$router.push('/main');
        } else {
          this.loginError = 'Неверное имя брокера';
        }
      } catch (error) {
        console.error('Ошибка при запросе к серверу:', error.message);
        this.loginError = 'Ошибка при запросе к серверу';
      }
    },
  },
};
</script>

<style scoped>
/* Стили для компонента Login */
.login-container {
  margin-top: 60px; /* Измените значение отступа по вашему усмотрению */
}
</style>
