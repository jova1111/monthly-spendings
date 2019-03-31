export class Transaction {
    constructor(json) {
        if (!json) {
            this.description = '';
            this.moneyspent = '';
            this.date = '';
            this.id = '';
            this.category = {
                id: -1,
                name: 'No category'
            };
        } else {
            this.description = json.description;
            this.moneyspent = json.moneyspent;
            this.date = new Date(json.created_at).toDateString();
            this.id = json.id;
            this.category = json.transaction_category;
        }
    }
}
