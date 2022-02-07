<template>
  <div>
    <label for="select-graph-mode">Graph data:</label>
    <select
      id="select-graph-mode"
      class="center-middle form-control"
      v-model="selectedGraphData"
      @change="changeGraphMode"
    >
      <option :key="graphMode.value" v-for="graphMode in graphDataModes">
        {{ graphMode.selectOption }}
      </option>
    </select>
    <chart
      class="center-middle"
      :chart-data="parsedChartData"
      :options="chartOptions"
    ></chart>
  </div>
</template>

<script>
import commonData from "@/mixins/common-data";
import LineChart from "@/components/statistics/LineChart";

export default {
  components: {
    chart: LineChart,
  },

  mixins: [commonData],

  props: {
    chartData: Object,
  },

  data() {
    return {
      graphDataModes: {
        QUARTALS: { value: "quartals", selectOption: "By quartals" },
        MONTHS: { value: "months", selectOption: "By months" },
      },
      selectedGraphData: "",
      parsedChartData: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return tooltipItem.yLabel.toLocaleString("sr-RS");
            },
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (label, index, labels) {
                  if (label >= 1000) {
                    return label / 1000 + "k";
                  } else {
                    return label;
                  }
                },
              },
            },
          ],
        },
      },
    };
  },

  mounted() {
    this.selectedGraphData = this.graphDataModes.MONTHS.selectOption;
    this.parsedChartData = this.getGraphData(this.graphDataModes.MONTHS.value);
  },

  methods: {
    getGraphData(graphMode) {
      let graphDatasets = [];
      let data = [];
      let labels = [];
      if (graphMode == this.graphDataModes.QUARTALS.value) {
        labels = ["Q1", "Q2", "Q3", "Q4"];
      } else {
        labels = this.monthNames;
      }

      Object.entries(this.chartData).forEach((entry) => {
        let labelName = entry[0];
        let spendingsByMonth = entry[1]; // object where key is the month number and value is total spendings for that month

        if (graphMode == this.graphDataModes.QUARTALS.value) {
          data = [0, 0, 0, 0];
          Object.entries(spendingsByMonth).forEach((entry) => {
            if (entry[0] < 4) {
              data[0] += entry[1];
            } else if (entry[0] >= 4 && entry[0] < 9) {
              data[1] += entry[1];
            } else if (entry[0] >= 4 && entry[0] < 9) {
              data[2] += entry[1];
            } else {
              data[3] += entry[1];
            }
          });
        } else {
          data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          Object.entries(spendingsByMonth).forEach((entry) => {
            data[entry[0] - 1] = entry[1];
          });
        }

        let randomColor = this.getRandomColor();
        graphDatasets.push({
          label: labelName,
          backgroundColor: randomColor,
          fill: false,
          borderWidth: 3,
          borderColor: randomColor,
          showLine: true,
          hidden: true,
          data,
        });
      });
      if (graphDatasets.length > 0) {
        graphDatasets[0].hidden = false;
      }

      return {
        labels,
        datasets: graphDatasets,
      };
    },

    changeGraphMode() {
      if (this.selectedGraphData == this.graphDataModes.MONTHS.selectOption) {
        this.parsedChartData = this.getGraphData(
          this.graphDataModes.MONTHS.value
        );
      } else if (
        this.selectedGraphData == this.graphDataModes.QUARTALS.selectOption
      ) {
        this.parsedChartData = this.getGraphData(
          this.graphDataModes.QUARTALS.value
        );
      }
    },

    getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
};
</script>

<style scoped>
#select-graph-mode {
  width: 30%;
  margin-bottom: 15px;
}

.center-middle {
  margin-left: auto;
  margin-right: auto;
}

@media only screen and (max-width: 768px) {
  #select-graph-mode {
    width: 150px;
    margin-bottom: 10px;
  }
}
</style>
