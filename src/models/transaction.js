export class Transaction{
    constructor(json){
        if(!json){
            this.description = '';
            this.moneyspent = '';
            this.date='';
            this.id='';
            this.category = {
                id: -1,
                name: 'No category'
            };
        }
        else {
            this.description = json.description;
            this.moneyspent = json.moneyspent;
            this.date = json.created_at;
            this.id = json.id;
            if(!json.transaction_category) {
                this.category = {
                    id: -1,
                    name: 'No category'
                };
            } else {
                this.category = json.transaction_category;
            }
        }
    }
    
}