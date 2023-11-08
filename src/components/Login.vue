<template>
  <div class="login-container">
    <h1>Добро пожаловать!</h1>
    <label for="brokerName">Введите имя брокера:</label><br><br>
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

</style>
