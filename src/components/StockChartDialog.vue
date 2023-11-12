<template>
  <div class="stock-chart-dialog">
    <button class="close-button" @click="closeDialog">&times;</button>
    <h2>{{ stockSymbol }} Price Chart</h2>
    <div :id="chartId" class="chart-container"></div>
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import stockModule from 'highcharts/modules/stock';
import io from "socket.io-client";

stockModule(Highcharts);

export default {
  props: {
    stockSymbol: String,
  },
  data() {
    return {
      historicalData: [],
      fullHistoricalData: [],
      chartId: 'stock-chart',
      chart: null,
      currentDate: null,
    };
  },
  watch: {
    stockSymbol: function(newSymbol, oldSymbol) {
        this.fetchHistoricalData();
    },
  },
  methods: {
    initializeWebSocket() {
      this.socket = io('http://localhost:3001');
      this.socket.on('updateCurrentDate', (newDate) => {

        this.currentDate = new Date(newDate).getTime();

        this.filterHistoricalData();
        this.updateChart();
      });
      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });
    },
    filterHistoricalData() {
      this.historicalData = this.fullHistoricalData.filter(candle => candle.x <= this.currentDate);
    },


    closeDialog() {
      this.$emit("closeDialog");
    },
    async fetchHistoricalData() {
      try {
        // Fetch historical data
        const response = await this.$axios.get(`http://localhost:3001/stocks/${this.stockSymbol}/historical-data`);

        if (response.data?.dataset?.data) {
          this.fullHistoricalData = response.data.dataset.data.map(candle => ({
            x: new Date(candle[0]).getTime(),
            open: Number(candle[1]),
            high: Number(candle[2]),
            low: Number(candle[3]),
            close: Number(candle[4]),
          }));

          this.fullHistoricalData.sort((a, b) => a.x - b.x);
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    },
    updateChart() {
      if (this.chart) {
        this.chart.series[0].setData(this.historicalData);
      } else {
        this.createChart();
      }
    },
    createChart() {
      this.chart = new Highcharts.stockChart(this.chartId, {
        chart: {
          width: 1000,
        },
        rangeSelector: {
          selected: 1,
        },
        title: {
          text: 'Stock Price Chart',
        },
        series: [{
          type: 'candlestick',
          name: 'Stock Price',
          data: this.historicalData,
        }],
      });
    },
  },
  mounted() {
    console.log("StockChartDialog mounted with stock symbol:", this.stockSymbol);

    this.fetchHistoricalData();
    this.initializeWebSocket();

  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>

<style scoped>
.stock-chart-dialog {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.stock-chart-dialog.open {
  transform: translateX(0);
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
  color: red;
}

.chart-container {
  width: 100%;
  height: 500px;
}
</style>
