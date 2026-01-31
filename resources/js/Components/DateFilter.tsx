'use client';

import { CalendarIcon, ChevronDownIcon, X } from 'lucide-react';
import * as React from 'react';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/Components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover';
import { cn } from '@/Lib/utils';
import { router, usePage } from '@inertiajs/react';
import {
    endOfMonth,
    endOfWeek,
    endOfYear,
    format,
    isSameDay,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subMonths,
    subWeeks,
    subYears,
} from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar } from './ui/calendar';

export default function DateFilter() {
    // 1. Ambil state awal dari URL (agar tidak reset saat refresh)
    const { url } = usePage();
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const initialStart = queryParams.get('start_date');
    const initialEnd = queryParams.get('end_date');

    const [range, setRange] = React.useState<DateRange | undefined>({
        from: initialStart ? new Date(initialStart) : startOfMonth(new Date()),
        to: initialEnd ? new Date(initialEnd) : new Date(),
    });

    const [month, setMonth] = React.useState<Date>(
        initialStart ? new Date(initialStart) : new Date(),
    );

    // Helper: Push ke URL (Trigger Backend Filtering)
    const applyFilter = (selectedRange: DateRange | undefined) => {
        if (!selectedRange?.from) return;

        const start = format(selectedRange.from, 'yyyy-MM-dd');
        // Jika 'to' kosong, anggap user pilih 1 hari saja
        const end = selectedRange.to
            ? format(selectedRange.to, 'yyyy-MM-dd')
            : start;

        router.get(
            route(route().current() as string),
            { start_date: start, end_date: end },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true, // Ganti history browser biar back button rapi
            },
        );
    };

    // Helper: Reset Filter
    const clearFilter = (e: React.MouseEvent) => {
        e.stopPropagation();
        setRange(undefined);
        setMonth(new Date());
        router.get(
            route(route().current() as string),
            { start_date: undefined, end_date: undefined }, // Hapus params
            { preserveState: true, preserveScroll: true },
        );
    };

    // Helper: Presets Logic
    const presets = [
        {
            label: 'Bulan Ini',
            getValue: () => ({
                from: startOfMonth(new Date()),
                to: endOfMonth(new Date()),
            }),
        },
        {
            label: 'Bulan Lalu',
            getValue: () => {
                const prev = subMonths(new Date(), 1);
                return {
                    from: startOfMonth(prev),
                    to: endOfMonth(prev),
                };
            },
        },
        {
            label: 'Minggu Ini',
            getValue: () => ({
                // weekStartsOn: 1 artinya Senin. Kalau mau Minggu ganti 0.
                from: startOfWeek(new Date(), { weekStartsOn: 1 }),
                to: endOfWeek(new Date(), { weekStartsOn: 1 }),
            }),
        },
        {
            label: 'Minggu Lalu',
            getValue: () => {
                const lastWeek = subWeeks(new Date(), 1);
                return {
                    from: startOfWeek(lastWeek, { weekStartsOn: 1 }),
                    to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
                };
            },
        },
        {
            label: '3 Bulan Terakhir',
            getValue: () => ({
                // Rolling 3 bulan ke belakang dari hari ini
                from: subMonths(new Date(), 3),
                to: new Date(),
            }),
        },
        {
            label: 'Tahun Ini',
            getValue: () => ({
                from: startOfYear(new Date()),
                to: endOfYear(new Date()),
            }),
        },
        {
            label: 'Tahun Lalu',
            getValue: () => {
                const prevYear = subYears(new Date(), 1);
                return {
                    from: startOfYear(prevYear),
                    to: endOfYear(prevYear),
                };
            },
        },
    ];

    // Helper untuk cek apakah preset sama dengan tanggal yang dipilih
    const checkIsActive = (presetVal: DateRange) => {
        if (!range?.from || !range?.to || !presetVal.from || !presetVal.to)
            return false;

        return (
            isSameDay(range.from, presetVal.from) &&
            isSameDay(range.to, presetVal.to)
        );
    };

    return (
        <div className="flex items-center gap-3">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="dates"
                        className="w-max-56 justify-between font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {range?.from && range?.to
                            ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                            : ''}

                        {range?.from && (
                            <div
                                role="button"
                                onClick={clearFilter} // <--- Dipanggil di sini
                                className="z-10 ml-auto rounded-full p-1 hover:bg-slate-200"
                            >
                                <X className="h-3 w-3 text-muted-foreground" />
                            </div>
                        )}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="flex w-auto flex-col overflow-hidden p-0 lg:flex-row"
                    align="start"
                >
                    {/* SIDEBAR PRESETS */}
                    <div className="flex flex-col gap-1 border-r border-border p-2">
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                            Pintasan
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-1">
                            {presets.map((preset) => {
                                const presetValue = preset.getValue();

                                // 1. Cek status aktif
                                const isActive = checkIsActive(presetValue);

                                return (
                                    <Button
                                        key={preset.label}
                                        // 2. Ubah visual jika aktif
                                        variant={
                                            isActive ? 'secondary' : 'ghost'
                                        }
                                        className={cn(
                                            'justify-start text-xs font-normal',
                                            isActive &&
                                                'bg-accent font-medium text-accent-foreground',
                                        )}
                                        onClick={() => {
                                            setRange(presetValue);

                                            // 3. [PENTING] Pindah bulan kalender otomatis
                                            if (presetValue.from) {
                                                setMonth(presetValue.from);
                                            }
                                        }}
                                    >
                                        {preset.label}
                                    </Button>
                                );
                            })}
                            <Button
                                size="sm"
                                onClick={() => applyFilter(range)}
                                disabled={!range?.from}
                            >
                                Terapkan
                            </Button>
                        </div>
                    </div>

                    <div className="p-0">
                        {/* Pick Date */}
                        <Calendar
                            mode="range"
                            defaultMonth={range?.from}
                            selected={range}
                            onSelect={setRange}
                            numberOfMonths={2}
                            locale={id}
                            month={month}
                            onMonthChange={setMonth}
                        />

                        {/* FOOTER ACTIONS */}
                        {/* <div className="flex justify-end gap-2 border-t p-3">
                            <Button
                                size="sm"
                                onClick={() => applyFilter(range)}
                                disabled={!range?.from}
                            >
                                Terapkan
                            </Button>
                        </div> */}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
