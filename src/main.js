import {Spreadsheet} from "@/components/spreadsheet/spreadsheet";
import {Header} from "@/components/header/header";
import {Toolbar} from "@/components/toolbar/toolbar";
import {Formula} from "@/components/formula/formula";
import {Table} from "@/components/table/table";
import "./scss/index.scss";

const spreadsheet = new Spreadsheet("#app", {
    components: [Header, Toolbar, Formula, Table]
});

spreadsheet.render();
