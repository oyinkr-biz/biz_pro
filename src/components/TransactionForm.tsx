import React, { useState } from 'react';
import type { TransactionType } from '../hooks/useTransactions';

interface TransactionFormProps {
    initialDate?: string;
    onSubmit: (data: {
        date: string;
        amount: number;
        type: TransactionType;
        category: string;
        description: string;
    }) => void;
    onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ initialDate, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        date: initialDate || new Date().toISOString().split('T')[0],
        amount: '',
        type: 'expense' as TransactionType,
        category: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: Number(formData.amount),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                <input
                    type="date"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
            </div>

            <div className="flex gap-4">
                <label className="flex-1">
                    <span className="block text-sm font-medium text-gray-700 mb-1">유형</span>
                    <select
                        className="w-full p-2 border rounded-lg"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
                    >
                        <option value="expense">지출</option>
                        <option value="income">수입</option>
                    </select>
                </label>

                <label className="flex-1">
                    <span className="block text-sm font-medium text-gray-700 mb-1">금액</span>
                    <input
                        type="number"
                        required
                        placeholder="0"
                        className="w-full p-2 border rounded-lg"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <input
                    type="text"
                    placeholder="예: 식비, 교통비"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <input
                    type="text"
                    placeholder="메모를 입력하세요"
                    className="w-full p-2 border rounded-lg"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                    취소
                </button>
                <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold"
                >
                    저장하기
                </button>
            </div>
        </form>
    );
};
