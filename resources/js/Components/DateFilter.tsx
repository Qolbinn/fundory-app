'use client';

import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';
// import { Label } from '@/Components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover';

export default function DateFilter() {
    const [range, setRange] = React.useState<DateRange | undefined>(undefined);

    return (
        <div className="flex items-center gap-3">
            {/* <Label htmlFor="dates" className="px-1">
                Select your stay
            </Label> */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="dates"
                        className="w-56 justify-between font-normal"
                    >
                        {range?.from && range?.to
                            ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                            : 'Select date'}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                >
                    <Calendar
                        mode="range"
                        selected={range}
                        captionLayout="dropdown"
                        onSelect={(range) => {
                            setRange(range);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
