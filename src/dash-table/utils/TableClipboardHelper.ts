import * as R from 'ramda';
import SheetClip from 'sheetclip';

import Clipboard from 'core/Clipboard';
import Logger from 'core/Logger';

import { colIsEditable } from 'dash-table/components/derivedState';
import { ActiveCell, Columns, Dataframe, SelectedCells } from 'dash-table/components/Table/props';

export default class TableClipboardHelper {
    public static toClipboard(selectedCells: SelectedCells, columns: Columns, dataframe: Dataframe) {
        const selectedRows = R.uniq(R.pluck(0, selectedCells).sort());
        const selectedCols: any = R.uniq(R.pluck(1, selectedCells).sort());

        const value = R.slice(
            R.head(selectedRows) as any,
            R.last(selectedRows) as any + 1,
            dataframe
        ).map(row =>
            R.props(selectedCols, R.props(R.pluck('id', columns) as any, row) as any)
        ).map(row => R.values(row).join('\t')
        ).join('\r\n');

        Clipboard.set(value);
    }

    public static fromClipboard(
        ev: ClipboardEvent,
        activeCell: ActiveCell,
        columns: Columns,
        dataframe: Dataframe
    ): { dataframe: Dataframe, columns: Columns } | void {
        const text = Clipboard.get(ev);
        Logger.warning('clipboard data: ', text);

        if (!text) {
            return;
        }

        const values = SheetClip.prototype.parse(text);

        let newDataframe = dataframe;
        const newColumns = columns;

        if (values[0].length + activeCell[1] >= columns.length) {
            for (
                let i = columns.length;
                i < values[0].length + activeCell[1];
                i++
            ) {
                newColumns.push({
                    id: `Column ${i + 1}`,
                    type: 'numeric'
                });
                newDataframe.forEach(row => (row[`Column ${i}`] = ''));
            }
        }

        if (values.length + activeCell[0] >= dataframe.length) {
            const emptyRow: any = {};
            columns.forEach(c => (emptyRow[c.id] = ''));
            newDataframe = R.concat(
                newDataframe,
                R.repeat(
                    emptyRow,
                    values.length + activeCell[0] - dataframe.length
                )
            );
        }

        values.forEach((row: any, i: any) =>
            row.forEach((cell: any, j: any) => {
                const iOffset = activeCell[0] + i;
                const jOffset = activeCell[1] + j;
                // let newDataframe = dataframe;
                const col = newColumns[jOffset];
                if (colIsEditable(true, col)) {
                    newDataframe = R.set(
                        R.lensPath([iOffset, col.id]),
                        cell,
                        newDataframe
                    );
                }
            })
        );

        return { dataframe: newDataframe, columns: newColumns };
    }
}