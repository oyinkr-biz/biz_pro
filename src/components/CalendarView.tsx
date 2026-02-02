import { useMemo } from 'react';
import {
    startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, format, isSameMonth, isSameDay,
    addMonths, subMonths, parseISO
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Transaction } from '../hooks/useTransactions';
import { cn } from '../lib/utils';

interface CalendarViewProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    transactions: Transaction[];
    onSelectDate: (date: Date) => void;
    selectedDate: Date;
}

export const CalendarView = ({
    currentDate,
    onDateChange,
    transactions,
    onSelectDate,
    selectedDate
}: CalendarViewProps) => {

    // Generate calendar days
    const days = useMemo(() => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentDate]);

    // Calculate daily totals
    const dailyData = useMemo(() => {
        const data: Record<string, { income: number; expense: number }> = {};

        transactions.forEach(t => {
            const dateKey = t.date; // YYYY-MM-DD
            if (!data[dateKey]) {
                data[dateKey] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                data[dateKey].income += t.amount;
            } else {
                data[dateKey].expense += t.amount;
            }
        });

        return data;
    }, [transactions]);

    // Calculate monthly totals for the summary header
    const monthlySummary = useMemo(() => {
        let income = 0;
        let expense = 0;

        transactions.forEach(t => {
            const tDate = parseISO(t.date);
            if (isSameMonth(tDate, currentDate)) {
                if (t.type === 'income') income += t.amount;
                else expense += t.amount;
            }
        });

        return { income, expense, total: income - expense };
    }, [transactions, currentDate]);

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className="space-y-4">
            {/* Header: Month Navigator & Summary */}
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Month Navigator */}
                <div className="bg-emerald-500 text-white p-4 flex items-center justify-between">
                    <button onClick={() => onDateChange(subMonths(currentDate, 1))} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-bold">
                        {format(currentDate, 'yyyy년 M월', { locale: ko })}
                    </h2>
                    <button onClick={() => onDateChange(addMonths(currentDate, 1))} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Monthly Summary */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 text-center py-4 bg-white">
                    <div>
                        <div className="text-xs text-slate-500 mb-1">수입</div>
                        <div className="text-emerald-600 font-bold text-sm sm:text-base">{monthlySummary.income.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 mb-1">지출</div>
                        <div className="text-rose-600 font-bold text-sm sm:text-base">{monthlySummary.expense.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 mb-1">합계</div>
                        <div className={cn("font-bold text-sm sm:text-base", monthlySummary.total >= 0 ? "text-slate-900" : "text-rose-600")}>
                            {monthlySummary.total.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-2 sm:p-4">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map((day, i) => (
                        <div key={day} className={cn(
                            "text-center text-xs font-semibold py-2",
                            i === 0 ? "text-rose-500" : i === 6 ? "text-blue-500" : "text-slate-500"
                        )}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-y-2 sm:gap-2">
                    {days.map((day) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const data = dailyData[dateKey];
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => onSelectDate(day)}
                                className={cn(
                                    "min-h-[60px] sm:min-h-[80px] p-1 rounded-xl border transition-all cursor-pointer relative flex flex-col items-center",
                                    isSelected ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 z-10" : "border-transparent hover:bg-slate-50",
                                    !isCurrentMonth && "opacity-30"
                                )}
                            >
                                <span className={cn(
                                    "text-xs mb-1 w-6 h-6 flex items-center justify-center rounded-full",
                                    isToday ? "bg-slate-900 text-white font-bold" :
                                        (day.getDay() === 0 ? "text-rose-500" : day.getDay() === 6 ? "text-blue-500" : "text-slate-700")
                                )}>
                                    {format(day, 'd')}
                                </span>

                                <div className="flex flex-col items-center gap-0.5 w-full">
                                    {data?.income > 0 && (
                                        <div className="text-[10px] sm:text-xs text-emerald-600 font-medium truncate w-full text-center">
                                            +{data.income > 999999 ? '99+' : (data.income / 10000 >= 1 ? `${Math.round(data.income / 10000)}만` : data.income.toLocaleString())}
                                        </div>
                                    )}
                                    {data?.expense > 0 && (
                                        <div className="text-[10px] sm:text-xs text-rose-600 font-medium truncate w-full text-center">
                                            -{data.expense > 999999 ? '99+' : (data.expense / 10000 >= 1 ? `${Math.round(data.expense / 10000)}만` : data.expense.toLocaleString())}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
