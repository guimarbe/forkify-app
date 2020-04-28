import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    // Getter de las recetas. Las cogemos vía API
    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients; 
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(')
        }
    }

    // Tiempo de preparación
    calcTime() {
        // Asumiendo que necesitamos 15 minutos por cada 3 ingredientes
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    // Porciones por persona
    calcServings() {
        this.servings = 4;
    }

    /** Método para parsear los ingredientes. Recibe un recipe, donde pasamos por bucle map 'ingredients' y sacamos
    *   la posición dentro del vector unitsLong. Una vez lo tiene, lo pasamos a minúsculas y la reemplazamos por 
    *   la palabra de unitsShort en la misma posición del vector original. Quitamos el parentesis con una regular expression.
    *   Ahora, pasamos la string resultante en un objeto ingredients que tiene cantidad, unidad e ingrediente.
    */
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map( el => {
            // 1. Unidades de forma uniforme (primero en minúsculas y luego las acortamos como en unitsShort).
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });
            
            // 2. Eliminamos el paréntesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); // Regexp

            // 3. Parseamos los ingredientes dentro de un objeto ingredientes con los atributos: 'count', 'unit' y 'ingredients'.
            const arrIng = ingredient.split(' '); // Separa las strings por cada espacio, cogiendo palabra por palabra
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); // Preferible a indexOf. Encuentra la posición en el vector de la unidad
            let objIng;

            if (unitIndex > -1) {
                // Tiene unidades
                // ej.: 4 1/2 cups, arrCount es [4, 1/2] -> eval('4+1/2') -> count = 4.5
                // ej.2: 4 cups, arrCount es [4] - Nota: Slice(inicio, fin) crea un nuevo vector desde inicio hasta fin (fin NO incluido)
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+')); // la clave para concatenar strings
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(arrIng[0], 10)) { 
                // No tiene unidades, pero el primer elemento es un número
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // No tiene unidades y el primer elemento NO es un número
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    // Método para actualizar el número de personas por menú. Cambiará la cantidad de ingredientes
    updateServings(type) {
        // Porciones
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredientes
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        // Devolvemos las porciones calculadas
        this.servings = newServings;
    }
}