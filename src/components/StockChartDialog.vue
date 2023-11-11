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

stockModule(Highcharts);

export default {
  props: {
    stockSymbol: String,
  },
  data() {
    return {
      historicalData: [],
      chartId: 'stock-chart', // Add an ID for the chart container
      chart: null,
    };
  },
  watch: {
    stockSymbol: function(newSymbol, oldSymbol) {
      if (oldSymbol !== null) {
        this.fetchHistoricalData(); // Fetch and update the chart when the symbol changes
      }
    },
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    async fetchHistoricalData() {
      try {
        const response = await this.$axios.get(`http://localhost:3001/stocks/${this.stockSymbol}/historical-data`);
        if (response.data?.dataset?.data) {
          this.historicalData = response.data.dataset.data.map(candle => ({
            x: new Date(candle[0]).getTime(),
            open: Number(candle[1]),
            high: Number(candle[2]),
            low: Number(candle[3]),
            close: Number(candle[4]),
          }));

          // Sort the data by date in ascending order
          this.historicalData.sort((a, b) => a.x - b.x);

          this.updateChart();
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    },
    updateChart() {
      if (this.chart) {
        // Update the series data
        this.chart.series[0].setData(this.historicalData);
      } else {
        // Create the chart if it doesn't exist
        this.createChart();
      }
    },
    createChart() {
      this.chart = new Highcharts.stockChart(this.chartId, {
        chart: {
          width: 1000, // Set the width of the chart
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
    this.fetchHistoricalData(); // Fetch data and create the chart on component mount
  },
};
</script>

<style scoped>
.stock-chart-dialog {
  max-width: 1200px; /* Increase the max-width of the dialog */
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
  width: 100%; /* Set the width of the chart container to 100% */
  height: 500px; /* Adjust the height as needed */
}
</style>
