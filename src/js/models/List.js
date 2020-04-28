import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        const index = this.items.findIndex(el => el.id === id);
        // [2,4,8] splice(1, 2) -> devuelve [4, 8], el vector original es [2] -> Elimina los datos del vector original.
        // [2,4,8] slice(1, 1) -> devuelve 4, el vector original es [2,4,8] -> Crea un nuevo vector con los datos cogidos. El vector original queda intacto.
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}