import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    /** De forma asíncrona, creamos el método getResults para hacer una consulta a la API de forkify.
    *   Utilizamos el operador await para esperar un Promise del async (https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/await)
    *   Luego, con axios hacemos un fetch. Todo esto dentro de un try/catch por si la consulta es errónea.
    */
    async getResults() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`); // Funciona como el fetch, pero aporta más cosas
            this.result = res.data.recipes;
        } catch(error) {
            alert(error);
        }
    }
}