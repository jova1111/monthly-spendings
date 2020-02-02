export class PlannedMonthlyMoney {
  constructor(json) {
      if (!json) {
          this.id = -1;
          this.value = 0;
          this.creationDate = '';
      } else {
          this.id = json.id;
          this.value = json.value;
          this.creationDate = json.creationDate;
      }
  }
}
