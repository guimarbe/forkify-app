/*******************************
**         VIEW MODULE        **
********************************/
import {elements} from './base';

// Cogemos el valor del buscador, ya que es un campo de entrada
export const getInput = () => elements.searchInput.value;

// Limpiamos el campo 'value' del buscador (es un <input>)
export const clearInput = () => {
    elements.searchInput.value = '';
};

// Limpiamos las recetas del buscador que se muestran por pantalla
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

// Marcamos de forma destacada la receta seleccionada
export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active'); // Añadimos una clase, no un selector. Por eso va sin "."
};

/** Esto es un poco confuso, por lo que se va a explicar a continuación:
*   String obtenida del API forkify: 'Pasta with tomato and spinach'
*   acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
*   acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
*   acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
*   acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato', 'and']
*   acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato', 'and'] // Alcanza el límite, por eso no pasa 'espinach'
*/
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // Devuelve el resultado acortado y con puntos suspensivos
        return `${newTitle.join(' ')}...`;
    }
    return title;
} 

// Función con código embebido para mostrar por pantalla los elementos encontrados
const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}" alt="${recipe.title}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

// Creación de los botones de paginación de la búsqueda. type: 'prev' o 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

// Render de los botones. La llamada a esta función está en el interior de la función 'renderResults'
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    // Botón para ir a la página siguiente
    if (page === 1) {
        button = createButton(page, 'next');

    // Ambos botones
    } else if (page < pages) {
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;

    // Botón para ir a la página anterior
    } else if (page === pages) {
        button = createButton(page, 'prev');
    }
    
    // Insertamos los botones en el documento HTML
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// Paginación de los elementos
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Mostramos por pantalla el resultado de la página actual
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // Renderizado de los botones de paginación
    renderButtons(page, recipes.length, resPerPage);
};

// NOTA: Separamos SIEMPRE cada función para cada funcionalidad diferente