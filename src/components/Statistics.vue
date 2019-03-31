<template>
    <div v-if="isLoaded">
        <div class="chart-container">
            <chart :chartdata="chartData" :options="chartOptions"></chart>
        </div>
    </div>
    <spinner v-else></spinner>
</template>

<script>
    import transactionService from '../services/transaction-service'
    import LineChart from './LineChart'
    import LoadingSpinner from './LoadingSpinner'

    export default {
        components: {
            'spinner': LoadingSpinner,
            'chart': LineChart
        },
        computed: {
            categoriesWithTotals: function() {
                let categoriesWithTotals = [];
                Object.entries(this.transactionsGroupedByCategory).forEach(entry => {
                    let categoryName = entry[0];
                    let transactions = entry[1];
                    let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    
                    transactions.forEach(transaction => {
                        let month = new Date(transaction.created_at).getMonth();
                        data[month] += transaction.moneyspent;
                    });

                    let randomColor = this.getRandomColor();
                    categoriesWithTotals.push({
                        label: categoryName,
                        backgroundColor: randomColor,
                        fill:false,
                        borderWidth: 3,
                        borderColor: randomColor,
                        showLine: true,
                        hidden: true,
                        data
                    });

                });
                
                categoriesWithTotals[0].hidden = false;
                return categoriesWithTotals;
            }
        },

        data() {
            return {
                transactionsGroupedByCategory: [],
                isLoaded: false,
                chartData: {
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        datasets: [
                        ]
                },
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        },

        mounted: function() {
            transactionService.getGroupedByMonthByYear(this.$route.params.year)
                .then(response=> {
                    this.transactionsGroupedByCategory = response;
                    this.chartData.datasets = this.categoriesWithTotals;
                    this.isLoaded = true;
                }).catch(error=> {
                    alert(error);
                });
        },

        methods: {
            getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }
        }
    }
</script>

<style scoped>
    .chart-container {
        margin-left: auto;
        margin-right: auto;
        width: 85%;
    }
</style>
