/***********************************
**       CONTROLLER MODULE        **
***********************************/
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';

/** Estado global de la APP
 *  - Buscar objetos
 *  - Objeto de receta 
 *  - Objeto de lista de la compra
 *  - Recetas favoritas
 */
const state = {}; // Creamos el objeto state que va a contener todos los datos


/************************
**  SEARCH CONTROLLER  **
************************/
const controlSearch = async () => {
    // 1. Hacemos consulta desde la vista
    const query = searchView.getInput();

    if (query) {
        // 2. Creamos nuevo objeto search y lo añadimos a state
        state.search = new Search(query);

        // 3. Preparar la interfaz de usuario con los resultados
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Buscar recetas
            await state.search.getResults();

            // 5. Mostrar resultador en la interfaz de usuario
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (error) {
            alert('Something went wrong with the search');
            clearLoader();
        }
    }
}

// EVENT LISTENERS de search controller
// Botón del buscador
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // Para que no recargue la página al pulsar el botón de búsqueda
    controlSearch();
});
// Botón de paginación
elements.searchResPages.addEventListener('click', e => {
    // Element.closest() - https://developer.mozilla.org/es/docs/Web/API/Element/closest
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});


/************************
**  RECIPE CONTROLLER  **
************************/
const controlRecipe = async () => {
    // 1. Obtenemos la ID de la url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // 2. Preparamos la IU, borrando las recetas y mostrando el icono de precarga
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // 3. Destacamos el elemento de búsqueda seleccionado
        if (state.search) searchView.highlightSelected(id);

        // 4. Creamos un nuevo objeto receta
        state.recipe = new Recipe(id);
        
        try {
            // 5. Obtenemos los datos y parseamos los ingredientes
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // 6. Calculamos el tiempo de preparación y las porciones por persona
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 7. Mostramos la receta por pantalla (borramos el icono de precarga primero)
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (error) {
            console.log(error);
            alert('Error processing recipe!');
            /** Try-catch para cazar las excepciones y nos salte un mensaje emergente si hay error.
            *   Nótese especial atención en el await esperando la promesa de forma asíncrona dentro del 'try'.
            */    
        }
    }
};

// EVENT LISTENERS de recipe controller
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); // Lo mismo que lo de abajo, pero en una misma línea
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);


/************************
**   LIST CONTROLLER   **
************************/
const controlList = () => {
    // 1. Creamos una nueva lista SI no existe ninguna
    if (!state.list) state.list = new List();

    // 2. Añadimos cada ingrediente en la lista de la compra de la interfaz de usuario
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// EVENT LISTENERS de list controller
// Manejo de los eventos borrar y actualizar elementos de la lista de la compra
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid; // closest() es la clave para que cuando pulses siempre sea en 'shopping__item' y no el span o el link

    // Manejo del botón de eliminar
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // 1. Borramos el elemento del objeto state
        state.list.deleteItem(id);

        // 2. Borramos el elemento de la IU
        listView.deleteItem(id);

    // Manejor de los botones de actualizar la cantidad de elementos de la lista
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


/**********************
**  LIKE CONTROLLER  **
***********************/
const controlLike = () => {
    // Si no existe ninguna receta favorita, creamos una nueva
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id; // Muy importante, gestión de guardar recetas a favoritos será por la ID
    
    // Tenemos SÓLO 2 posibilidades al dar al botón de Me Gusta:
    // 1. El usuario NO tiene la receta actual en la lista de favoritos
    if (!state.likes.isLiked(currentID)) {
        // 1.1. Añadimos Me Gusta al objeto state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // 1.2. Cambiamos de estado al botón Me Gusta
        likesView.toggleLikeBtn(true);

        // 1.3. Añadimos el Me Gusta a la IU
        likesView.renderLike(newLike);

    // 2. El usuario SÍ tiene la receta actual en la lista de favoritos
    } else {
        // 2.1. Borramos el Me Gusta del objeto state
        state.likes.deleteLike(currentID);

        // 2.2. Cambiamos de estado al botón Me Gusta
        likesView.toggleLikeBtn(false);

        // 2.3. Borramos el Me Gusta de la IU
        likesView.deleteLike(currentID);

    }

    // Método de la vista de Me Gusta para hacer visible o invisible el botón de la lista de favoritos
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// EVENT LISTENERS de like controller
// Restaurar las recetas favoritas al cargar la página (localStorage)
window.addEventListener('load', () => {
    state.likes = new Likes();

    // 1. Restauramos los Me Gustas
    state.likes.readStorage();

    // 2. Cambiamos de estado al botón de Me Gusta
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // 3. Mostramos por pantalla los Me Gustas
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Manejo de los botones de las recetas
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrementa los ingredientes al aumentar las porciones por persona
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Incrementa los ingredientes al aumentar las porciones por persona
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Botón de añadir ingredientes a la lista de la compra (List controller)
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Botón de Me Gusta (Like controller)
        controlLike();
    }
});