<template>
  <div>
    <Navbar />
    <h1>Торговля</h1>
    <p v-if="brokerData">Добро пожаловать, {{ brokerData.name }}!</p>
    <p v-else>Loading...</p>

    <div class="quantity-input">
      <label for="quantity" class="quantity-label">Quantity:</label>
      <input type="number" id="quantity" v-model="quantityInput" min="1" step="1" class="quantity-field" />
    </div>

    <table v-if="stockData">
      <thead>
      <tr>
        <th>Symbol</th>
        <th>Open</th>
        <th>Close</th>
        <th>High</th>
        <th>Low</th>
        <th>Date</th>
        <th>Actions</th>
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
        <td>
          <button class="action-button buy-button" @click="buyStock(brokerData.name, stock.symbol, 1, stock.historicalDataElement[3])">Buy</button>
          <button class="action-button sell-button" @click="sellStock(brokerData.name, stock.symbol, 1, stock.historicalDataElement[3])">Sell</button>
          <button class="action-button chart-button" @click="openChartDialog(stock.symbol)">Open Chart</button>
        </td>
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

    <!-- Stock Chart Dialog -->
    <StockChartDialog
        v-if="selectedStockSymbol !== null"
        :stockSymbol="selectedStockSymbol"
        @closeDialog="closeChartDialog"
    />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import StockChartDialog from "@/components/StockChartDialog.vue";
import { mapState, mapActions } from "vuex";

import io from 'socket.io-client';

export default {
  components: {
    Navbar,
    StockChartDialog,
  },
  computed: {
    ...mapState(["brokerData", "stockData"]),
  },
  data() {
    return {
      socket: null,
      quantityInput: 1,
      selectedStockSymbol: null,
    };
  },
  created() {
    this.initializeWebSocket();
    this.loadBrokerData(this.brokerData.name);
  },
  methods: {
    ...mapActions(["fetchAllBrokers", "loadBrokerData"]),

    async buyStock(name, symbol, quantity, price) {
      try {
        const response = await this.$axios.post(`http://localhost:3001/brokers/${name}/buy-stock/${symbol}/${this.quantityInput}/${price}`);
        await this.loadBrokerData(this.brokerData.name);
      } catch (error) {
        console.error("Error buying stock:", error);
      }
    },

    async sellStock(name, symbol, quantity, price) {
      try {
        const response = await this.$axios.post(`http://localhost:3001/brokers/${name}/sell-stock/${symbol}/${this.quantityInput}/${price}`);
        await this.loadBrokerData(this.brokerData.name);
        console.log(response.data);
      } catch (error) {
        console.error("Error selling stock:", error);
      }
    },

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
      this.socket.on('updateCurrentDate', (newDate) => {});
      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });
    },

    openChartDialog(stockSymbol) {
      // Close the existing chart dialog if one is open
      if (this.selectedStockSymbol !== null) {
        this.closeChartDialog();
      }

      // Open the chart dialog for the selected stock symbol
      this.selectedStockSymbol = stockSymbol;
    },


    closeChartDialog() {
      this.selectedStockSymbol = null;
    },
  },
};
</script>

<style scoped>
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

.action-button {
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.buy-button {
  background-color: #2ecc71; /* Green color for Buy button */
  color: #ffffff; /* White text color */
}

.sell-button {
  background-color: #e74c3c; /* Red color for Sell button */
  color: #ffffff; /* White text color */
}

.chart-button {
  background-color: #3498db; /* Blue color for Chart button */
  color: #ffffff; /* White text color */
}

.action-button:hover {
  background-color: #34495e; /* Darker shade on hover */
}
.quantity-input {
  margin-top: 10px;
}

.quantity-label {
  font-size: 16px;
  font-weight: bold;
  margin-right: 5px;
}

.quantity-field {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 70px;
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