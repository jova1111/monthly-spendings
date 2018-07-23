export class Transaction{
    constructor(json){
        if(!json){
            this.description = '';
            this.moneyspent = '';
            this.date='';
            this.id='';
        }
        else {
            this.description = json.description;
            this.moneyspent = json.moneyspent;
            this.date = json.created_at;
            this.id = json.id;
        }
    }
    
}