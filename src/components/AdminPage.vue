<template>
  <div>
    <Navbar />
    <h1>Статистика</h1>
    <div v-for="broker in allBrokers" :key="broker.name">
      <h2>{{ broker.name }}</h2>
      <ul>
        <li v-for="stock in broker.stocks" :key="stock.symbol">
          {{ stock.symbol }} - Quantity: {{ stock.quantity }} - Price: {{ stock.purchasePrice }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Navbar,
  },
  computed: {
    ...mapState(["allBrokers"]),
  },
  created() {
    this.fetchAllBrokers();
  },
  methods: {
    ...mapActions(["fetchAllBrokers"]),
  },
};
</script>

<style scoped>
/* Стили для компонента AdminPage */
</style>
