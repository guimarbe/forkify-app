// Almacenamos las strings de las clases que se van a utilizar con querySelector
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

// Variable auxiliar para crear/eliminar el icono de precarga
export const elementStrings = {
    loader: 'loader'
};

// Creamos el icono de precarga de buscar elementos
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw" />
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

// Eliminamos el icono de precarga de buscar elementos
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};