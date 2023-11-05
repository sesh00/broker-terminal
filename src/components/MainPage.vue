<template>
  <div>
    <h1>Торговая страница</h1>
    <p>Привет, {{ brokerName }}!</p>
    <!-- Основной функционал торговли и отображение информации -->
  </div>
</template>

<script>
export default {
  computed: {
    brokerName() {
      return this.$store.state.brokerName;
    },
  },
};
</script>

<style scoped>
/* Стили для компонента MainPage */
</style>
