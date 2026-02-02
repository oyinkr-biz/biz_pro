import { useState, useEffect } from 'react';

const DEFAULT_EXPENSE_CATEGORIES = [
    '식비', '카페/간식', '교통/차량', '쇼핑',
    '취미/여가', '주거/통신', '의료/건강', '생활',
    '경조사/회비', '교육', '자녀/육아', '기타'
];

const DEFAULT_INCOME_CATEGORIES = [
    '월급', '용돈', '부수입', '상여금', '금융소득', '기타'
];

export const useCategories = () => {
    const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
    const [incomeCategories, setIncomeCategories] = useState<string[]>([]);

    useEffect(() => {
        const savedExpense = localStorage.getItem('expense_categories');
        const savedIncome = localStorage.getItem('income_categories');

        if (savedExpense) {
            setExpenseCategories(JSON.parse(savedExpense));
        } else {
            setExpenseCategories(DEFAULT_EXPENSE_CATEGORIES);
        }

        if (savedIncome) {
            setIncomeCategories(JSON.parse(savedIncome));
        } else {
            setIncomeCategories(DEFAULT_INCOME_CATEGORIES);
        }
    }, []);

    const updateExpenseCategory = (index: number, newName: string) => {
        const newCats = [...expenseCategories];
        newCats[index] = newName;
        setExpenseCategories(newCats);
        localStorage.setItem('expense_categories', JSON.stringify(newCats));
    };

    const updateIncomeCategory = (index: number, newName: string) => {
        const newCats = [...incomeCategories];
        newCats[index] = newName;
        setIncomeCategories(newCats);
        localStorage.setItem('income_categories', JSON.stringify(newCats));
    };

    return {
        expenseCategories,
        incomeCategories,
        updateExpenseCategory,
        updateIncomeCategory
    };
};
