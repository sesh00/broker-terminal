<template>
  <div>
    <Navbar />
    <h1>Статистика</h1>
    <table v-if="allBrokers.length">
      <thead>
      <tr>
        <th>Брокер</th>
        <th>Валюта</th>
        <th>Акции</th>
        <th>Баланс</th> <!-- New column for balance -->
      </tr>
      </thead>
      <tbody>
      <tr v-for="broker in allBrokers" :key="broker.name">
        <td>{{ broker.name }}</td>
        <td>{{ broker.initialFunds }}</td>
        <td>
          <ul>
            <li v-for="stock in broker.stocks" :key="stock.symbol">
              <div class="stock-info">
                <span class="stock-name">{{ stock.symbol }}</span>
                <span class="quantity">Quantity: {{ stock.quantity }}</span>
                <span class="price">Price: {{ stock.purchasePrice }}</span>
                <span class="pnl">PNL: {{ calculateProfitLoss(stock) }}</span>
              </div>
            </li>
          </ul>
        </td>
        <td>{{ calculateBalance(broker) }}</td> <!-- Display balance -->
      </tr>
      </tbody>
    </table>
    <p v-else>No broker data available.</p>
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
    ...mapState(["allBrokers", "stockData"]),
  },
  created() {
    this.fetchAllBrokers();
  },
  methods: {
    ...mapActions(["fetchAllBrokers"]),
    calculateProfitLoss(stock) {
      const currentPrice = this.stockData.find(s => s.symbol === stock.symbol)?.historicalDataElement[2] || 0;
      return (currentPrice - stock.purchasePrice) * stock.quantity;
    },
    calculateBalance(broker) {
      const currencyBalance = broker.initialFunds;
      const stockBalance = broker.stocks.reduce((total, stock) => total + this.calculateProfitLoss(stock), 0);
      return currencyBalance + stockBalance;
    },
  },
};
</script>

<style scoped>
/* Styles for компонента AdminPage */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: fixed;
}

th, td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
  word-wrap: break-word;
}

th {
  background-color: #f2f2f2;
}

.stock-info {
  display: flex;
  flex-direction: column;
}

.stock-info span {
  margin-bottom: 5px;
}

.stock-name {
  font-weight: bold;
}

.quantity {
  color: #3498db; /* Set color for Quantity */
}

.price {
  color: #2ecc71; /* Set color for Price */
}

.pnl {
  color: #e74c3c; /* Set color for PNL */
}
</style>
