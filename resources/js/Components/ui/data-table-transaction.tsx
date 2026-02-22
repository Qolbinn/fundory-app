'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Columns3, Trash2 } from 'lucide-react';
import * as React from 'react';
import { Button } from './button';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { Input } from './input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './select';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    meta?: any;
    onCreate?: () => void;
    onBulkDelete?: (ids: number[]) => void;
    searchKey?: string;
    searchPlaceholder?: string;
    filterKey?: string;
}

export function DataTableTransaction<TData, TValue>({
    columns,
    data,
    meta,
    onCreate,
    onBulkDelete,
    searchKey = 'note',
    searchPlaceholder = 'Cari catatan...',
    filterKey = 'category',
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        meta: meta,
    });

    // Helper untuk menangkap ID dari row yang dipilih
    const handleBulkDeleteClick = () => {
        if (!onBulkDelete) return;

        // Ambil row yang dicentang
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const ids = selectedRows.map((row) => (row.original as any).id);

        if (ids.length > 0) {
            onBulkDelete(ids);
            table.resetRowSelection();
        }
    };

    const uniqueFilterOptions = React.useMemo(() => {
        const column = table.getColumn(filterKey);
        if (!column) return [];
        const uniqueValues = Array.from(
            new Set(
                data.map((item: any) => {
                    const val = item[filterKey];
                    return typeof val === 'object' ? val?.name : val;
                }),
            ),
        ).filter(Boolean); // Hapus null/undefined

        return uniqueValues.map((val) => ({
            label: String(val),
            value: String(val),
        }));
    }, [data, filterKey, table]);

    return (
        <div>
            <div className="flex items-center py-4">
                {/* Search */}
                <Input
                    placeholder={searchPlaceholder}
                    value={
                        (table
                            .getColumn(searchKey)
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn(searchKey)
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                {/* Faceted Filter */}
                {table.getColumn(filterKey) &&
                    uniqueFilterOptions.length > 0 && (
                        <DataTableFacetedFilter
                            column={table.getColumn(filterKey)}
                            title="Kategori"
                            options={uniqueFilterOptions}
                        />
                    )}

                {/* --- TOMBOL BULK DELETE (Muncul jika ada yang dipilih) --- */}
                {table.getFilteredSelectedRowModel().rows.length > 0 &&
                    onBulkDelete && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleBulkDeleteClick}
                            className="ml-2 transition-all"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus (
                            {table.getFilteredSelectedRowModel().rows.length})
                        </Button>
                    )}

                {/* Filter Kolom */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <Columns3 className="h-4 w-4" /> View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Add Transaction */}
                {onCreate && (
                    <Button onClick={onCreate} className="ml-2">
                        + Transaksi
                    </Button>
                )}
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <br />

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} dari{' '}
                    {table.getFilteredRowModel().rows.length} baris dipilih.
                </div>

                <div className="flex items-center space-x-6 lg:space-x-8">
                    {/* Rows Per Page Selector */}
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue
                                    placeholder={
                                        table.getState().pagination.pageSize
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem
                                        key={pageSize}
                                        value={`${pageSize}`}
                                    >
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Page Info */}
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </div>

                    {/* Navigasi Buttons */}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            {'<'}
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            {'>'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div> */}
        </div>
    );
}
