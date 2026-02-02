import { useState } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { SmartInput } from '../components/SmartInput';
import { TransactionForm } from '../components/TransactionForm';
import { cn } from '../lib/utils';

export const Dashboard = () => {
    const { transactions, addTransaction, deleteTransaction, totalIncome, totalExpense, balance } = useTransactions();
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 md:pb-10">
            <div className="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl min-h-screen bg-white shadow-xl overflow-hidden">
                {/* Header */}
                <header className="px-6 py-6 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <Wallet className="text-white" size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900">똑똑한 가계부</h1>
                    </div>
                    <div className="text-sm text-slate-500">
                        {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
                    </div>
                </header>

                <main className="p-6 space-y-6">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
                        <div className="text-indigo-100 text-sm font-medium mb-1">총 자산 현황</div>
                        <div className="text-3xl font-bold mb-6">{balance.toLocaleString()}원</div>

                        <div className="flex gap-4">
                            <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                                <div className="flex items-center gap-2 text-emerald-200 text-xs font-medium mb-1">
                                    <TrendingUp size={14} /> 수입
                                </div>
                                <div className="font-semibold text-lg">+{totalIncome.toLocaleString()}</div>
                            </div>
                            <div className="flex-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                                <div className="flex items-center gap-2 text-rose-200 text-xs font-medium mb-1">
                                    <TrendingDown size={14} /> 지출
                                </div>
                                <div className="font-semibold text-lg">-{totalExpense.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {/* Smart Input */}
                    <SmartInput onAdd={addTransaction} />

                    {/* Manual Add Button (Mobile Only visible here if wanted, or separate) */}
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-500 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                    >
                        <Plus size={20} />
                        직접 내역 추가하기
                    </button>

                    {/* Recent Transactions */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">최근 내역</h2>
                        <div className="space-y-3">
                            {transactions.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    <p>아직 내역이 없습니다.</p>
                                    <p className="text-sm mt-1">위의 입력창을 통해 첫 내역을 추가해보세요!</p>
                                </div>
                            ) : (
                                transactions.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                                                t.type === 'income' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                                            )}>
                                                {t.type === 'income' ? '💰' : '💸'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{t.description || t.category}</div>
                                                <div className="text-xs text-slate-500">{t.date} · {t.category}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "font-bold",
                                                t.type === 'income' ? "text-emerald-600" : "text-slate-900"
                                            )}>
                                                {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}원
                                            </div>
                                            <button
                                                onClick={() => deleteTransaction(t.id)}
                                                className="text-slate-300 hover:text-rose-500 transition-colors md:opacity-0 md:group-hover:opacity-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Manual Input Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 md:rounded-2xl animate-in slide-in-from-bottom-5">
                        <h2 className="text-lg font-bold mb-4">새로운 내역 추가</h2>
                        <TransactionForm
                            onSubmit={(data) => {
                                addTransaction(data);
                                setIsFormOpen(false);
                            }}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
