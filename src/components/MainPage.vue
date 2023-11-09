<template>
  <div>
    <Navbar />
    <h1>Торговля</h1>
    <p v-if="brokerData">Добро пожаловать, {{ brokerData.name }}!</p>
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


    <h1>Брокерский счет</h1>
    <table v-if="brokerData">
      <thead>
      <tr>
        <th>Брокер</th>
        <th>Валюта</th>
        <th>Акции</th>
        <th>Баланс</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{ brokerData.name }}</td>
        <td>{{ brokerData.initialFunds }}</td>
        <td>
          <ul>
            <li v-for="stock in brokerData.stocks" :key="stock.symbol">
              <div class="stock-info">
                <span class="stock-name">{{ stock.symbol }}</span>
                <span class="quantity">Quantity: {{ stock.quantity }}</span>
                <span class="price">Price: {{ stock.purchasePrice }}</span>
                <span class="pnl">PNL: {{ calculateProfitLoss(stock) }}</span>
              </div>
            </li>
          </ul>
        </td>
        <td>{{ calculateBalance(brokerData) }}</td>
      </tr>
      </tbody>
    </table>
    <p v-else>No broker data available.</p>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { mapState, mapActions } from "vuex";
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
    this.loadBrokerData();

  },

  methods: {

    ...mapActions(["loadBrokerData"]),
    calculateProfitLoss(stock) {
      const currentPrice = this.stockData.find(s => s.symbol === stock.symbol)?.historicalDataElement[2] || 0;
      return (currentPrice - stock.purchasePrice) * stock.quantity;
    },
    calculateBalance(broker) {
      const currencyBalance = broker.initialFunds;
      const stockBalance = broker.stocks.reduce((total, stock) => total + this.calculateProfitLoss(stock), 0);
      return currencyBalance + stockBalance;
    },


    async updateStockList(newStockData) {
      try {

        const response = await this.$axios.get('http://localhost:3001/stocks');
        const stocks = response.data;
        const filteredStocks = []
        for (const stock in stocks){
          if (stocks[stock].trading ) {
            filteredStocks.push(stock)
          }
        }

        newStockData = newStockData.filter(function (stockData) {
          return filteredStocks.includes(stockData.symbol);
        });

        return newStockData;
      } catch (error) {
        console.error("Ошибка при запросе к серверу:", error);
        this.loginError = "Произошла ошибка при запросе к серверу";
      }
    },


    initializeWebSocket() {
      this.socket = io('http://localhost:3001');

      this.socket.on('updateStockData', async (newStockData) => {
        this.$store.commit('updateStockData', await this.updateStockList(newStockData));
      });

      this.socket.on('updateCurrentDate', (newDate) => {
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
  table-layout: fixed; /* Added property to make the table layout fixed */
}

th, td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
  width: 100px; /* Set a fixed width for the columns (adjust as needed) */
  word-wrap: break-word; /* Enable word wrapping within cells */
}

th {
  background-color: #f2f2f2;
}
.stock-info span {
  margin-bottom: 5px;
}

.stock-name {
  font-weight: bold;
}

.stock-info {
  display: flex;
  flex-direction: column;
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

