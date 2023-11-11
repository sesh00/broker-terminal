<template>
  <div class="login-container">
    <h1>Добро пожаловать!</h1>
    <div class="input-container">
      <input v-model="brokerName" type="text" id="brokerName" placeholder="Введите имя брокера" />
    </div>
    <button @click="login">Войти</button>
    <p v-if="loginError" class="error-message">{{ loginError }}</p>
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
.login-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 14px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

.error-message {
  color: #e74c3c;
}
</style>
