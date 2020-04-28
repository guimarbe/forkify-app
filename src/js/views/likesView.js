import {elements} from './base';
import {limitRecipeTitle} from './searchView';

// Cambiamos de estado el botón de Me Gusta
export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

// Mostramos u ocultamos si tenemos elementos en la lista de favoritos
export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

// Función con código embebido para mostrar por pantalla las recetas en la lista de favoritos
export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

// Función para borrar recetas de la lista de favoritos
export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
};