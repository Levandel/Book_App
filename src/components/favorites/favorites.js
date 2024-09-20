import { AbstractView } from "../../common/view.js";
import { Header } from "../../components/header/header.js"
import onChange from "on-change";
import { CardList } from "../../components/card-list/card-list.js";

export class FavoritesView extends AbstractView {

    constructor(appState) {
        super();
        this.appState = appState;
        this.appState = onChange(this.appState, this.appStateHook.bind(this));
        this.setTitle('Моя корзина');
    }

    appStateHook(path) {
        if(path === 'favorites'){
            this.render();
        }
    }

    destroy(){
        onChange.unsubscribe(this.appState);
    }

    render() {
        this.app.innerHTML = ""; 
        if(this.appState.favorites.length === 0){
            this.app.innerHTML = `<h1> Корзина пуста </h1>`;
        }else{
            this.app.innerHTML = `<h1> Корзина </h1>`;
        }
        this.renderHeader();
        this.renderCardList();
    }

    renderHeader() {
        const header = new Header(this.appState).render();
        this.app.prepend(header);
    }

    renderCardList() {
        const cardList = new CardList(this.appState, { list: this.appState.favorites }).render();
        this.app.append(cardList);
    }
}