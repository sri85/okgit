import { DataRow } from "../../types";
import createTable from "./createTable";
import printTable from "./printTable";

export function renderTable<T>(
    headers: string[],
    items: T[],
    toRow: (item: T) => DataRow,
    options: { printEmpty?: boolean } = {}
): void {
    if (items.length === 0 && options.printEmpty === false) {
        return;
    }
    const table = createTable(headers);
    for (const item of items) {
        table.push(toRow(item).map(String));
    }
    printTable(table);
}
