import Table from "cli-table";
import clc from "cli-color";
import { StringTable } from "../../types";

export default function createTable(headers: string[]): StringTable {
    if (Array.isArray(headers)) {
        const tableHeaderColor = clc.xterm(37);
        headers = headers.map(x => `${tableHeaderColor(x)}`);
        return new Table({
            head: headers,
        });
    } else {
        throw new TypeError(
            `Expected type Array , instead got type ${typeof headers}`
        );
    }
}
