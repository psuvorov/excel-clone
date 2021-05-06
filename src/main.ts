import {Spreadsheet} from "./core/spreadsheet";
import {Header} from "./components/header/header";
import {Toolbar} from "./components/toolbar/toolbar";
import {Formula} from "./components/formula/formula";
import {Table} from "./components/table/table";
import {createStore} from "redux";
import {rootReducer} from "./redux/rootReducer";
import "./scss/index.scss";

const getApplicationState = () => {
    const state = localStorage.getItem("appState");
    if (state)
        return JSON.parse(state);

    return {
        [`${Header.componentName}`]: {
            
        },
        [`${Toolbar.componentName}`]: {
            
        },
        [`${Table.componentName}`]: {
            [`${Table.stateProperties.columnWidths}`]: {},
            [`${Table.stateProperties.rowHeights}`]: {},
            [`${Table.stateProperties.cellContents}`]: {}
        }
    };
};

const store = createStore(rootReducer, getApplicationState());

store.subscribe(() => {
    const appState = store.getState();
    localStorage.setItem("appState", JSON.stringify(appState));
});

new Spreadsheet("#app", {
    components: [Header, Toolbar, Formula, Table],
    store
}).render();
