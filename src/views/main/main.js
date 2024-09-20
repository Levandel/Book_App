import { AbstractView } from "../../common/view.js";
import { Header } from "../../components/header/header.js"
import onChange from "on-change";
import { Search } from "../../components/search/search.js";
import { CardList } from "../../components/card-list/card-list.js";

export class MainView extends AbstractView {
    state = {
        list: [],
        numFound: 0,
        loading: false,
        searchQuery: undefined,
        offset: 0
    }

    constructor(appState) {
        super();
        this.appState = appState;
        this.appState = onChange(this.appState, this.appStateHook.bind(this));
        this.state = onChange(this.state, this.stateHook.bind(this));
        this.setTitle('Поиск книг');
    }

    appStateHook(path) {
        if(path === 'favorites'){
            this.render();
        }
    }

    async stateHook(path) {
        if(path === 'searchQuery'){
            this.state.loading = true;
            this.state.list = "";
            const data = await this.loadList(this.state.searchQuery, this.state.offset);
            this.state.numFound = data.numFound;
            this.state.list = data.docs;
            this.state.loading = false;
        }
        if(path === "list" || path === "loading" || path === "numFound"){
            this.render();
        }
    }

    async loadList (q, offset) {
        const res = await fetch(`https://openlibrary.org/search.json?q=${q}&offset=${offset}`);
        return res.json();
    }

    destroy(){
        onChange.unsubscribe(this.appState);
        onChange.unsubscribe(this.state);
    }

    render() {
        this.app.innerHTML = ""; 
        this.app.innerHTML = `<h1> Найдено книг: ${this.state.numFound} </h1>`;
        const main = document.createElement('div');
        this.app.append(main);
        this.renderHeader();
        this.renderSearch();
        this.renderCardList();
    }

    renderHeader() {
        const header = new Header(this.appState).render();
        this.app.prepend(header);
    }

    renderSearch() {
        const search = new Search(this.state).render();
        this.app.append(search);
    }

    renderCardList() {
        const cardList = new CardList(this.appState, this.state).render();
        this.app.append(cardList);
    }
}

