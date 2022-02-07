import { Category } from './category';

export class Transaction {
    constructor(json) {
        if (!json) {
            this.description = '';
            this.amount = 0;
            this.creationDate = new Date();
            this.id = -1;
            this.category = new Category;
        } else {
            this.description = json.description;
            this.amount = json.amount;
            this.creationDate = new Date(json.creationDate);
            this.id = json.id;
            this.category = new Category(json.category);
        }
    }
}
