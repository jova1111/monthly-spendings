export class Category {
  constructor(json) {
      if (!json) {
          this.id = -1;
          this.name = '';
          this.creationDate = '';
      } else {
          this.id = json.id;
          this.name = json.name;
          this.creationDate = json.creationDate;
      }
  }
}
