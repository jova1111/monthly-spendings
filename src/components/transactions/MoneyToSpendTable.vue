<template>
  <div>
    <table class="transactions">
      <tr class="table-header">
        <th>Money to spend</th>
        <th>Money spent</th>
        <th>Money left</th>
      </tr>
      <tr>
        <td
          style="cursor:pointer"
          @click="editable ? editing = true : editing = false"
          v-if="!editing"
        >
          <a>{{ moneyToSpend.value | numberWithCommas }}</a>
        </td>
        <td v-else @keyup.esc="returnOldMoneyToSpend" @keyup.enter="editMoneyToSpend">
          <div class="inputs-container">
            <input
              v-autofocus
              type="text"
              v-model="moneyToSpend.value"
              placeholder="Enter value..."
              class="form-control small-form-control"
            />
            <input type="button" class="violet btn" @click="editMoneyToSpend" value="OK">
            <input type="button" class="btn btn-default" @click="returnOldMoneyToSpend" value="Cancel">
          </div>
        </td>
        <td>{{ totalMoneySpent | numberWithCommas }}</td>
        <td>{{ moneyToSpend.value - totalMoneySpent | numberWithCommas }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  import { PlannedMonthlyMoney } from '@/models/planned-monthly-money';
  import plannedMonthlyMoneyService from '@/services/planned-monthly-money-service';

  export default {
    props: {
      transactions: Array,
      money: Object,
      editable: Boolean
    },

    computed: {
      totalMoneySpent: function() {
        return this.transactions
          .map(transaction => transaction.amount)
          .reduce((a, b) => a + b, 0);
      }
    },

    data() {
      return {
        editing: false,
        moneyToSpend: new PlannedMonthlyMoney,
        initialValue: 0,
        processStartEventName: 'started-processing',
        processFinishEventName: 'finished-processing'
      };
    },

    created() {
        if (this.money) {
          this.moneyToSpend = this.money;
          this.initialValue = this.money.value;
        }
    },

    methods: {
      editMoneyToSpend() {
        if (this.initialValue == this.moneyToSpend.value) {
          return;
        }

        this.$emit(this.processStartEventName);

        if (this.moneyToSpend.id == -1) {
          plannedMonthlyMoneyService
          .create(this.moneyToSpend)
          .then(newPlannedMoney => {
            this.editing = false;
            this.moneyToSpend = newPlannedMoney;
            this.initialValue = newPlannedMoney.value;
            this.$toasted.success("Successfully created monthly spendings plan!");
            this.$emit(this.processFinishEventName);
          })
          .catch(error => {
            this.$toasted.error(error);
            this.$emit(this.processFinishEventName);
          });
        } else {
          plannedMonthlyMoneyService
            .edit(this.moneyToSpend)
            .then(editedPlannedMoney => {
              this.editing = false;
              this.moneyToSpend = editedPlannedMoney;
              this.initialValue = editedPlannedMoney.value;
              this.$toasted.success("Successfully edited monthly planned spendings!");
              this.$emit(this.processFinishEventName);
            })
            .catch(error => {
              this.$toasted.error(error);
              this.$emit(this.processFinishEventName);
            });
        }
      },

      returnOldMoneyToSpend() {
        this.moneyToSpend.value = this.initialValue;
        this.editing = false;
      }
    }
  };
</script>

<style scoped>
  .small-form-control {
    display: inline;
    width: 80%;
  }

  .inputs-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
</style>
