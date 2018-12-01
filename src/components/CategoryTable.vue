<template>
    <div>
        <table class="transactions">
            <tr class="table-header">
                <th>Category</th>
                <th>Money spent</th>
            </tr>
            <tr v-for="categorySpending in categorySpendings" v-bind:key="categorySpending.name">
                <td>{{ categorySpending.name }}</td>
                <td>{{ categorySpending.total }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        props: [
            'transactions'
        ],

        computed: {
            categorySpendings: function() {
                let result = [];
                this.transactions.reduce(function (res, value) {
                    let categoryName;
                    if(!value.category) {
                        categoryName = "No category";
                    } else {
                        categoryName = value.category.name;
                    }
                    if (!res[categoryName]) {
                        res[categoryName] = {
                            total: 0,
                            name: categoryName
                        };
                        result.push(res[categoryName]);
                    }
                    res[categoryName].total += value.moneyspent;
                    return res;
                }, {});
                return result;
            }
        }
    }
</script>

<style scoped>
    .transactions {
        font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    .transactions td, .transactions th {
        border: 2px solid rgb(202, 202, 202);
        padding: 8px;
    }

    .transactions tr:nth-child(odd){background-color: rgb(240, 240, 255);}

    .transactions tr:nth-child(even){background-color: rgb(222, 222, 255);}

    .transactions tr:first-child {background-color: rgb(124, 124, 225)}

    .transactions tr:hover {background-color: rgb(190, 190, 255);}

    .table-header:hover {
        background-color: rgb(100, 100, 200) !important;
        cursor: pointer;
    }

    .table-header {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: rgb(124, 124, 225);
        color: white;
    }
</style>