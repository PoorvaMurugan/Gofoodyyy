"use client";

import React from "react";

interface Column<T> {
    header: string;
    accessor?: keyof T;
    cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
}

export function DataTable<T>({
    columns,
    data,
    loading,
}: DataTableProps<T>) {
    return (
        <div className="bg-white border border-gray-200 rounded-md">
            <div className="overflow-x-auto">
                <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className="px-4 py-3 text-left font-medium text-gray-600"
                                    >
                                        {column.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="text-center py-6 text-gray-500"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        {columns.map((column, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="px-4 py-3 text-gray-800"
                                            >
                                                {column.cell
                                                    ? column.cell(row)
                                                    : column.accessor
                                                        ? (row[column.accessor] as React.ReactNode)
                                                        : null}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}