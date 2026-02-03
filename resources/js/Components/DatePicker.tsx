'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Locale Indonesia
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover';
import { cn } from '@/Lib/utils';

interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

export function DatePicker({
    value,
    onChange,
    className,
    placeholder = 'Pilih tanggal',
    disabled = false,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    disabled={disabled}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? (
                        format(value, 'EEEE, dd MMMM yyyy', { locale: id })
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(date) => {
                        onChange?.(date);
                        setOpen(false); // Auto close setelah pilih tanggal
                    }}
                    initialFocus
                    locale={id}
                />
            </PopoverContent>
        </Popover>
    );
}
