<template>
    <div v-if="isLoaded" class="main-container">
        <div class="chart-container">
            <chart :chartdata="chartData" :options="chartOptions"></chart>
        </div>

        <category-table class="center-middle category-table" :transactions="allTransactionsForYear"></category-table>
    </div>
    <spinner v-else></spinner>
</template>

<script>
    import transactionService from '../services/transaction-service'
    import LineChart from './LineChart'
    import LoadingSpinner from './LoadingSpinner'
    import CategoryTable from './CategoryTable'

    export default {
        components: {
            'spinner': LoadingSpinner,
            'chart': LineChart,
            'category-table': CategoryTable
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
                allTransactionsForYear: [],
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
                .then(response => {
                    this.transactionsGroupedByCategory = response;
                    this.chartData.datasets = this.categoriesWithTotals; 
                }).catch(error => {
                    alert(error);
                });

            transactionService.getAllTransactionsForYear(this.$route.params.year)
                .then(response => {
                    this.allTransactionsForYear = response;
                    this.isLoaded = true;
                }).catch(error => {
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

    .category-table {
        margin-top: 50px;
        width: 70%;
    }

    .main-container {
        margin-left: 50px;
        margin-right: 50px;
        margin-bottom: 50px;
    }

    .center-middle {
        margin-left: auto;
        margin-right: auto;
    }
</style>
