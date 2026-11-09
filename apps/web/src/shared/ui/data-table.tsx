import type { ReactNode } from "react";

export interface DataTableColumn<Row> {
  key: string;
  header: string;
  cell: (row: Row) => ReactNode;
  align?: "left" | "right";
}

/** 연속된 행을 같은 key로 묶고, 묶음마다 공통 정보를 한 번만 보여준다. */
export interface DataTableGroup<Row> {
  key: (row: Row) => string;
  header: (row: Row) => ReactNode;
}

interface DataTableProps<Row> {
  caption: string;
  columns: DataTableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row) => string;
  emptyMessage: string;
  group?: DataTableGroup<Row>;
}

function groupRows<Row>(rows: Row[], group: DataTableGroup<Row> | undefined) {
  if (group === undefined) {
    return [{ key: "all", first: rows[0], rows }];
  }
  const groups: { key: string; first: Row; rows: Row[] }[] = [];
  for (const row of rows) {
    const key = group.key(row);
    const last = groups.at(-1);
    if (last !== undefined && last.key === key) {
      last.rows.push(row);
    } else {
      groups.push({ key, first: row, rows: [row] });
    }
  }
  return groups;
}

export function DataTable<Row>({ caption, columns, emptyMessage, getRowKey, group, rows }: DataTableProps<Row>) {
  const align = (column: DataTableColumn<Row>) => ({ textAlign: column.align ?? "left" }) as const;

  return (
    <div className="overflow-hidden rounded-panel border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm tabular-nums">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-surface-subtle text-xs text-text">
            <tr>
              {columns.map((column) => (
                <th
                  className="whitespace-nowrap border-b border-border-strong px-3 py-2 font-semibold"
                  key={column.key}
                  scope="col"
                  style={align(column)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          {rows.length === 0 ? (
            <tbody>
              <tr>
                <td className="px-4 py-8 text-center text-sm text-text-muted" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            </tbody>
          ) : (
            groupRows(rows, group).map((rowGroup) => (
              <tbody className="divide-y divide-border border-b border-border last:border-b-0" key={rowGroup.key}>
                {group !== undefined && rowGroup.first !== undefined ? (
                  <tr className="bg-accent-soft/60">
                    <th className="px-3 py-2 text-left font-normal" colSpan={columns.length} scope="rowgroup">
                      {group.header(rowGroup.first)}
                    </th>
                  </tr>
                ) : null}
                {rowGroup.rows.map((row) => (
                  <tr
                    className="transition-colors even:bg-surface-subtle/50 hover:bg-surface-subtle focus-within:bg-accent-soft motion-reduce:transition-none"
                    key={getRowKey(row)}
                  >
                    {columns.map((column) => (
                      <td className="px-3 py-2 align-middle text-text" key={column.key} style={align(column)}>
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))
          )}
        </table>
      </div>
    </div>
  );
}
