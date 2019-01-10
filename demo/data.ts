/* eslint no-magic-numbers: 0 */
import * as R from 'ramda';
import { ColumnType } from 'dash-table/components/Table/props';

const N_DATA = 100000;

export interface IDataMock {
    columns: any[];
    data: any[];
}

export const generateMockData = (rows: number) => unpackIntoColumnsAndData([
    {
        id: 'rows',
        type: ColumnType.Number,
        editable: false,
        data: gendata(i => i, rows)
    },

    {
        id: 'ccc',
        name: ['City', 'Canada', 'Toronto'],
        type: ColumnType.Number,
        data: gendata(i => i, rows)
    },

    {
        id: 'ddd',
        name: ['City', 'Canada', 'Montréal'],
        type: ColumnType.Number,
        data: gendata(i => i * 100, rows)
    },

    {
        id: 'eee',
        name: ['City', 'America', 'New York City'],
        type: ColumnType.Number,
        data: gendata(i => i, rows)
    },

    {
        id: 'fff',
        name: ['City', 'America', 'Boston'],
        type: ColumnType.Number,
        data: gendata(i => i + 1, rows)
    },

    {
        id: 'ggg',
        name: ['City', 'France', 'Paris'],
        type: ColumnType.Number,
        editable: true,
        data: gendata(i => i * 10, rows)
    },

    {
        id: 'bbb',
        name: ['', 'Weather', 'Climate'],
        type: ColumnType.Text,
        enumeration: true,
        clearable: true,
        data: gendata(
            i => ['Humid', 'Wet', 'Snowy', 'Tropical Beaches'][i % 4],
            rows
        )
    },

    {
        id: 'bbb-readonly',
        name: ['', 'Weather', 'Climate-RO'],
        type: ColumnType.Text,
        // enumeration: true,
        // editable: false,
        data: gendata(
            i => ['Humid', 'Wet', 'Snowy', 'Tropical Beaches'][i % 4],
            rows
        )
    },

    {
        id: 'aaa',
        name: ['', 'Weather', 'Temperature'],
        type: ColumnType.Number,
        number: {
            validation: {
                on_failure: 'prevent'
            }
        },
        data: gendata(i => i + 1, rows)
    },

    {
        id: 'aaa-readonly',
        name: ['', 'Weather', 'Temperature-RO'],
        type: ColumnType.Number,
        editable: false,
        data: gendata(i => i + 1, rows)
    }
]);

export const mockDataSimple = (rows: number) => unpackIntoColumnsAndData([
    {
        id: 'aaa',
        name: 'Temperature',
        type: ColumnType.Number,
        data: gendata(i => i + 1, rows)
    },

    {
        id: 'bbb',
        name: 'Climate',
        type: ColumnType.Text,
        enumeration: true,
        options: ['Humid', 'Wet', 'Snowy', 'Tropical Beaches'].map(i => ({
            label: i,
            value: i
        })),
        clearable: true,
        data: gendata(
            i => ['Humid', 'Wet', 'Snowy', 'Tropical Beaches'][i % 4],
            rows
        )
    }
]);

export const miniData = unpackIntoColumnsAndData([
    {
        id: 'aaa', name: 'cheese', data: [1, 2, 3]
    },
    {
        id: 'bbb', name: 'tomato', data: [3, 2, 1]
    }
]);

function unpackIntoColumnsAndData(columns: any[]): IDataMock {
    const mocked: any = { columns: [], data: [] };

    columns.forEach(col => {
        col.data.forEach((v: any, i: number) => {
            if (!mocked.data[i]) {
                mocked.data[i] = {};
            }
            mocked.data[i][col.id] = v;
        });
        mocked.columns.push(R.dissoc('data', col));
    });
    return mocked;
}

function gendata(func: (i: number) => any, ndata = N_DATA) {
    return R.range(1, ndata).map(func);
}
