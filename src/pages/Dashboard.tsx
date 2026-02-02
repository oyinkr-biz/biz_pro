import { useState } from 'react';
import { Plus, Wallet, Trash2, Calendar as CalendarIcon, AlignJustify } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionForm } from '../components/TransactionForm';
import { ExpensePieChart } from '../components/ExpensePieChart';
import { CalendarView } from '../components/CalendarView';
import { cn } from '../lib/utils';

type Tab = 'calendar' | 'list' | 'chart';

export const Dashboard = () => {
    const { transactions, addTransaction, deleteTransaction, balance } = useTransactions();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState<Tab>('calendar');

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Filter transactions for the selected date (for the list below calendar)
    const selectedDateTransactions = transactions.filter(t =>
        isSameDay(parseISO(t.date), selectedDate)
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-10 font-sans">
            <div className="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl min-h-screen bg-white shadow-xl overflow-hidden relative flex flex-col">

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    {/* Top Header Section */}
                    <div className="bg-white p-4 sticky top-0 z-10 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-200">
                                    <Wallet className="text-white" size={20} />
                                </div>
                                <h1 className="text-xl font-extrabold text-slate-800">똑똑한 가계부</h1>
                            </div>
                            <div className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                자산: {balance.toLocaleString()}원
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-slate-100 rounded-xl">
                            <button
                                onClick={() => setCurrentTab('calendar')}
                                className={cn(
                                    "flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                                    currentTab === 'calendar' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <CalendarIcon size={16} /> 달력
                            </button>
                            <button
                                onClick={() => setCurrentTab('list')}
                                className={cn(
                                    "flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                                    currentTab === 'list' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <AlignJustify size={16} /> 전체내역
                            </button>
                            <button
                                onClick={() => setCurrentTab('chart')}
                                className={cn(
                                    "flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                                    currentTab === 'chart' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <span>📊</span> 통계
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-6">
                        {currentTab === 'calendar' && (
                            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                <CalendarView
                                    currentDate={currentMonth}
                                    onDateChange={setCurrentMonth}
                                    transactions={transactions}
                                    selectedDate={selectedDate}
                                    onSelectDate={setSelectedDate}
                                />

                                <div className="bg-slate-50 rounded-3xl p-5 min-h-[200px]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-700">
                                            {format(selectedDate, 'M월 d일 (E)', { locale: ko })} 상세 내역
                                        </h3>
                                        <button
                                            onClick={() => setIsFormOpen(true)}
                                            className="text-xs bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-full font-bold hover:bg-emerald-200 transition-colors"
                                        >
                                            + 내역 추가
                                        </button>
                                    </div>

                                    {selectedDateTransactions.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400 text-sm">
                                            이 날의 내역이 없습니다.
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedDateTransactions.map((t) => (
                                                <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                                                            t.type === 'income' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                                                        )}>
                                                            {t.type === 'income' ? '💰' : '💸'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{t.description || t.category}</div>
                                                            <div className="text-xs text-slate-500">{t.category}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "font-bold",
                                                            t.type === 'income' ? "text-emerald-600" : "text-slate-900"
                                                        )}>
                                                            {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                                                        </div>
                                                        <button
                                                            onClick={() => deleteTransaction(t.id)}
                                                            className="text-slate-300 hover:text-rose-500"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentTab === 'list' && (
                            <div className="space-y-3 animate-in slide-in-from-right-5 duration-300">
                                <h2 className="text-lg font-bold text-slate-900 mb-2">전체 내역 리스트</h2>
                                {transactions.length === 0 ? (
                                    <div className="text-center py-20 text-slate-400">
                                        기록된 내역이 없습니다.
                                    </div>
                                ) : (
                                    transactions.map((t) => (
                                        <div key={t.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="text-xs font-bold text-slate-400 w-12 text-center leading-tight">
                                                    {t.date.slice(5)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{t.description || t.category}</div>
                                                    <div className="text-xs text-slate-500">{t.category}</div>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "font-bold",
                                                t.type === 'income' ? "text-emerald-600" : "text-slate-900"
                                            )}>
                                                {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}원
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {currentTab === 'chart' && (
                            <div className="animate-in slide-in-from-right-5 duration-300 space-y-6">
                                <ExpensePieChart transactions={transactions} />
                            </div>
                        )}
                    </div>
                </main>

                {/* Floating Action Button (Mobile) */}
                <div className="fixed bottom-6 right-6 md:hidden z-30">
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-300 flex items-center justify-center hover:bg-emerald-600 transition-transform active:scale-95"
                    >
                        <Plus size={28} />
                    </button>
                </div>
            </div>

            {/* Manual Input Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
                    <div
                        className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-5 duration-300"
                        style={{ maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {format(selectedDate, 'M월 d일')} 내역 추가
                            </h2>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                        <TransactionForm
                            initialDate={format(selectedDate, 'yyyy-MM-dd')}
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


