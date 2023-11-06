<template>
  <div>
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
        const response = await this.$axios.get('http://localhost:3001/brokers');
        const brokers = response.data.brokers;

        const brokerExists = brokers.some(broker => broker.name === this.brokerName);

        if (brokerExists) {
          this.$store.dispatch('updateBrokerName', this.brokerName);
          this.$router.push('/main');
        } else {
          this.loginError = "Неправильное имя брокера";
        }
      } catch (error) {
        console.error("Ошибка при запросе к серверу:", error);
        this.loginError = "Произошла ошибка при запросе к серверу";
      }
    },
  },
};
</script>

<style scoped>
/* Стили для компонента Login */
</style>
