<template>
  <div>
    <Navbar />
    <h1>Торговля</h1>
    <p v-if="brokerData">Привет, {{ brokerData.name }}!</p>
    <p v-else>Loading...</p>
    <table v-if="stockData">
      <thead>
      <tr>
        <th>Symbol</th>
        <th>Open</th>
        <th>Close</th>
        <th>High</th>
        <th>Low</th>
        <th>Date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="stock in stockData" :key="stock.symbol">
        <td>{{ stock.symbol }}</td>
        <td>{{ stock.historicalDataElement[1] }}</td>
        <td>{{ stock.historicalDataElement[2] }}</td>
        <td>{{ stock.historicalDataElement[3] }}</td>
        <td>{{ stock.historicalDataElement[4] }}</td>
        <td>{{ stock.historicalDataElement[0] }}</td>
      </tr>
      </tbody>
    </table>
    <p v-else>No stock data available.</p>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { mapState } from "vuex";
import io from 'socket.io-client';

export default {
  components: {
    Navbar,
  },
  computed: {
    ...mapState(["brokerData", "stockData"]),
  },
  data() {
    return {
      socket: null,
    };
  },
  created() {
    this.initializeWebSocket();
  },

  methods: {
    initializeWebSocket() {
      this.socket = io('http://localhost:3001');

      this.socket.on('updateStockData', (newStockData) => {
        this.$store.commit('updateStockData', newStockData);
        console.log('Current newStockData Updated:', newStockData);
      });

      this.socket.on('updateCurrentDate', (newDate) => {
        console.log('Current Date Updated:', newDate);
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });
    },
  },
};
</script>

<style scoped>
/* Styles for MainPage.vue */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>
