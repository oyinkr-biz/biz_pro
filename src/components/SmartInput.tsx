import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { TransactionType } from '../hooks/useTransactions';

interface SmartInputProps {
    onAdd: (data: {
        date: string;
        amount: number;
        type: TransactionType;
        category: string;
        description: string;
    }) => void;
}

export const SmartInput: React.FC<SmartInputProps> = ({ onAdd }) => {
    const [input, setInput] = useState('');
    const [parsedData, setParsedData] = useState<{
        date: string;
        amount: number;
        description: string;
    } | null>(null);

    const parseInput = (text: string) => {
        // Basic heuristics for Korean payment SMS
        let amount = 0;
        let description = '';
        let date = new Date().toISOString().split('T')[0]; // Default to today

        // Extract Amount (e.g., 10,000원, 5000원)
        const amountMatch = text.match(/([0-9,]+)원/);
        if (amountMatch) {
            amount = parseInt(amountMatch[1].replace(/,/g, ''), 10);
        }

        // Extract Date (e.g., 02/02, 2월 2일) - Very basic implementation
        // Assuming current year
        const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})/);
        if (dateMatch) {
            const year = new Date().getFullYear();
            const month = dateMatch[1].padStart(2, '0');
            const day = dateMatch[2].padStart(2, '0');
            date = `${year}-${month}-${day}`;
        }

        // Extract Description (This is hard, taking remaining text or specific pattern)
        // Common format: [Web발신] ... amount ... place ...
        // Let's just try to find the place. Usually comes after amount or at the end.
        // For now, we use the whole text if not complex parsing, or leave blank for user manual input.
        // Let's just take the raw input as description if simple, or strip known patterns.
        description = text.replace(/\[Web발신\]/, '').replace(/[0-9,]+원/, '').replace(/(\d{1,2})\/(\d{1,2})/, '').trim();
        if (description.length > 20) description = description.substring(0, 20) + '...';

        if (amount > 0) {
            setParsedData({ amount, date, description });
        } else {
            setParsedData(null);
        }
    };

    const handleApply = () => {
        if (parsedData) {
            onAdd({
                ...parsedData,
                type: 'expense', // Default to expense for SMS
                category: '미분류',
            });
            setInput('');
            setParsedData(null);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setInput(val);
        parseInput(val);
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
                <Sparkles size={18} />
                <span>스마트 붙여넣기</span>
            </div>
            <textarea
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                rows={3}
                placeholder="문자를 복사해서 여기에 붙여넣으세요..."
                value={input}
                onChange={handleChange}
            />

            {parsedData && (
                <div className="bg-indigo-50 p-3 rounded-xl flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-2">
                    <div>
                        <div className="font-bold text-indigo-900">{parsedData.amount.toLocaleString()}원</div>
                        <div className="text-indigo-700 text-xs">{parsedData.date} · {parsedData.description}</div>
                    </div>
                    <button
                        onClick={handleApply}
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <ArrowRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};
