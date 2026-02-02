import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Transaction } from '../hooks/useTransactions';

interface ExpensePieChartProps {
    transactions: Transaction[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#0ea5e9'];

export const ExpensePieChart = ({ transactions }: ExpensePieChartProps) => {
    const data = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const categoryTotals: Record<string, number> = {};

        expenses.forEach(t => {
            if (categoryTotals[t.category]) {
                categoryTotals[t.category] += t.amount;
            } else {
                categoryTotals[t.category] = t.amount;
            }
        });

        return Object.entries(categoryTotals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]);

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-slate-400">
                <p>지출 내역이 없습니다.</p>
                <p className="text-sm">내역을 추가하면 통계가 표시됩니다.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">지출 분석</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => `${value.toLocaleString()}원`}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
