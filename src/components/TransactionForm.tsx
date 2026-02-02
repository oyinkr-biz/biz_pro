import React, { useState, useRef } from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';
import type { TransactionType } from '../hooks/useTransactions';

interface TransactionFormProps {
    initialDate?: string;
    onSubmit: (data: {
        date: string;
        amount: number;
        type: TransactionType;
        category: string;
        description: string;
        photos?: string[];
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
    const [photos, setPhotos] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newPhotos: string[] = [];
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        setPhotos(prev => [...prev, reader.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: Number(formData.amount),
            photos
        });
    };

    const EXPENSE_CATEGORIES = [
        '식비', '카페/간식', '교통/차량', '쇼핑',
        '취미/여가', '주거/통신', '의료/건강', '생활',
        '경조사/회비', '교육', '자녀/육아', '기타'
    ];

    const INCOME_CATEGORIES = [
        '월급', '용돈', '부수입', '상여금', '금융소득', '기타'
    ];

    const currentCategories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

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
                        onChange={(e) => setFormData({
                            ...formData,
                            type: e.target.value as TransactionType,
                            category: '' // Reset category on type change
                        })}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                <div className="grid grid-cols-3 gap-2">
                    {currentCategories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat })}
                            className={`py-2 px-1 text-xs sm:text-sm rounded-lg border transition-colors ${formData.category === cat
                                    ? (formData.type === 'income' ? 'bg-emerald-100 border-emerald-500 text-emerald-700 font-bold' : 'bg-indigo-100 border-indigo-500 text-indigo-700 font-bold')
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                {/* Fallback for direct input if needed, or keeping it strict */}
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

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사진 첨부 (영수증, 인증샷)</label>
                <div className="flex flex-wrap gap-2">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                            <img src={photo} alt="preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-colors bg-slate-50"
                    >
                        <Camera size={24} />
                        <span className="text-[10px] mt-1">사진 추가</span>
                    </button>
                </div>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                    취소
                </button>
                <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                    저장하기
                </button>
            </div>
        </form>
    );
};
