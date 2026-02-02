import { useState, useEffect } from 'react';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: TransactionType;
    category: string;
    description: string;
    photos?: string[];
}

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('transactions');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = {
            ...transaction,
            id: crypto.randomUUID(),
        };
        setTransactions((prev) => [newTransaction, ...prev]);
    };

    const deleteTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const getProcessingData = () => {
        const totalIncome = transactions
            .filter((t) => t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const totalExpense = transactions
            .filter((t) => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const balance = totalIncome - totalExpense;

        return { totalIncome, totalExpense, balance };
    };

    return {
        transactions,
        addTransaction,
        deleteTransaction,
        ...getProcessingData(),
    };
};
