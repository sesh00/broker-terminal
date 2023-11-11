<template>
  <div class="stock-chart-dialog">
    <h2>{{ stockSymbol }} Price Chart</h2>
    <button class="close-button" @click="closeDialog">&times;</button>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import io from 'socket.io-client';

export default {
  props: {
    stockSymbol: String,
  },
  data() {
    return {
      socket: null,
      historicalData: [],
      chart: null,
    };
  },
  created() {
    this.fetchHistoricalData();
    // Commented out to prevent WebSocket initialization
    // this.initializeWebSocket();
  },
  beforeDestroy() {
    // Commented out to prevent WebSocket disconnection
    // this.socket.disconnect();
  },

  watch: {
    stockSymbol: function(newSymbol, oldSymbol) {
      if (oldSymbol !== null) {
        this.destroyChart();
      }
      this.fetchHistoricalData();
    },
  },

  methods: {

    closeDialog() {
      // Ensure the chart is destroyed before emitting the close event
      this.destroyChart();
      this.$emit("closeDialog");
    },

    destroyChart() {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    },
    async fetchHistoricalData() {
      try {
        const response = await this.$axios.get(`http://localhost:3001/stocks/${this.stockSymbol}/historical-data`);
        // Check if data is available before mapping
        if (response.data?.dataset?.data) {
          this.historicalData = response.data.dataset.data.map(candle => ({
            x: new Date(candle[0]).getTime(),
            y: Number(candle[4]), // Adjust to use the closing price or any other relevant data
          }));
          this.createChart();
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    },
    initializeWebSocket() {
      this.socket = io('http://localhost:3001');
      this.socket.on('updateStockData', async (newStockData) => {
        //await this.updateHistoricalData(newStockData);
      });
    },
    async updateHistoricalData(newStockData) {
      // Process and update historical data with new stock data
      // Example: Assuming newStockData is an array of updated stock data
      this.historicalData.push(...newStockData);

      // Update the chart
      //this.updateChart();
    },
    createChart() {
      this.destroyChart();
      const ctx = this.$refs.chartCanvas.getContext("2d");
      this.chart = new Chart(ctx, {
        type: "line", // Change to line chart
        data: {
          datasets: [{
            data: this.historicalData,
            label: 'Stock Price',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
          }]
        },
        options: {
          scales: {
            x: {
              type: 'linear', // Change to linear scale for time values
            },
            y: {
              beginAtZero: false,
            },
          },
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              enabled: true,
            },
            title: {
              display: true,
              text: 'Stock Price Chart',
            },
          },
        },
      });
    },
    updateChart() {
      // Implement update logic if needed
    },
  },
};
</script>

<style scoped>
.stock-chart-dialog {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
}

.close-button:hover {
  color: red; /* Change color on hover if desired */
}
</style>
