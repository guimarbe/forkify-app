export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Persistencia de datos en el almacenamiento local del navegador web (localStorage)
        this.persistData();

        return like;
    }

    deleteLike(id) {
        // Idéntico al de List.js
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Persistencia de datos en localStorage
        this.persistData();
    }

    // Booleano para saber si ya le han dado Me Gusta
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    // Persistencia de datos
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes)); // Lo transforma en string
    }

    // Leemos los datos almacenados en localStorage
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // Restauramos los Me Gustas desde localStorage
        if (storage) this.likes = storage;
    }
}