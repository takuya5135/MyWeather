"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface DateRangeProps {
    startDate: string // YYYY-MM-DD
    endDate: string   // YYYY-MM-DD
    onStartDateChange: (date: string) => void
    onEndDateChange: (date: string) => void
}

export function DateRangePicker({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange
}: DateRangeProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-sm">
            <div className="w-full">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                    開始日
                </label>
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="w-full"
                />
            </div>
            <div className="w-full">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                    終了日
                </label>
                <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    min={startDate} // Prevent end date before start date
                    className="w-full"
                />
            </div>
        </div>
    )
}
