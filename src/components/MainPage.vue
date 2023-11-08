<template>
  <div>
    <Navbar />
    <h1>Торговля</h1>
    <p v-if="brokerData">Привет, {{ brokerData.name }}!</p>
    <p v-else>Loading...</p>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
  computed: {
    brokerData() {
      return this.$store.state.brokerData;
    },
  },
  created() {

  },
  methods: {
    // ...
  }
};
</script>

<style scoped>
/* Стили для компонента MainPage */
</style>
