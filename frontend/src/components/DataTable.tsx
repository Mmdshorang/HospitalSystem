import React, { useMemo, useState } from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  cell?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  rowKey?: (row: T, index: number) => string;
  loading?: boolean;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  initialPageSize?: number;
}

function DataTable<T>({
  data,
  columns,
  rowKey,
  loading = false,
  emptyMessage = "داده‌ای برای نمایش وجود ندارد",
  pageSizeOptions = [5, 10, 20],
  initialPageSize = 10,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const handleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(col.key);
      setSortAsc(true);
    }
    setPage(1);
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;
    const getVal = (row: T) =>
      col.accessor ? col.accessor(row) : (row as any)[col.key];
    const arr = [...data];
    arr.sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      const sa = typeof va === "string" ? va : JSON.stringify(va ?? "");
      const sb = typeof vb === "string" ? vb : JSON.stringify(vb ?? "");
      return (
        sa.localeCompare(sb, "fa", { numeric: true, sensitivity: "base" }) *
        (sortAsc ? 1 : -1)
      );
    });
    return arr;
  }, [data, columns, sortKey, sortAsc]);

  const total = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = sortedData.slice(start, end);

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-right text-sm font-semibold text-gray-700 whitespace-nowrap ${
                    col.className ?? ""
                  }`}
                >
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1 transition ${
                      col.sortable ? "hover:text-gray-900" : "cursor-default"
                    }`}
                    onClick={() => handleSort(col)}
                  >
                    <span>{col.header}</span>
                    {col.sortable && sortKey === col.key && (
                      <span className="text-gray-500 text-xs">
                        {sortAsc ? "▲" : "▼"}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td
                  className="px-6 py-10 text-center text-gray-500"
                  colSpan={columns.length}
                >
                  در حال بارگذاری...
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-10 text-center text-gray-500"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => (
                <tr
                  key={rowKey ? rowKey(row, idx) : String(idx)}
                  className="transition hover:bg-gray-50"
                >
                  {columns.map((col) => {
                    const value = col.accessor
                      ? col.accessor(row)
                      : (row as any)[col.key];
                    return (
                      <td
                        key={col.key}
                        className={`px-6 py-4 text-gray-700 whitespace-nowrap ${
                          col.className ?? ""
                        }`}
                      >
                        {col.cell ? col.cell(value, row) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>نمایش</span>
          <select
            className="px-2 py-1 border rounded-lg bg-white shadow-inner focus:ring focus:ring-blue-200"
            value={pageSize}
            onChange={(e) => {
              const ps = Number(e.target.value);
              setPageSize(ps);
              setPage(1);
            }}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span>رکورد</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <button
            className="px-3 py-1 rounded-lg border transition hover:bg-gray-100 disabled:opacity-40"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            قبلی
          </button>

          <span className="text-gray-700">
            صفحه {currentPage} از {totalPages}
          </span>

          <button
            className="px-3 py-1 rounded-lg border transition hover:bg-gray-100 disabled:opacity-40"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
