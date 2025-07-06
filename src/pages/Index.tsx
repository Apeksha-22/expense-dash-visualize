
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, DollarSign, TrendingDown } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";
import CategoryChart from "@/components/CategoryChart";
import BudgetManager from "@/components/BudgetManager";
import Sidebar from "@/components/Sidebar";
import QuickAdd from "@/components/QuickAdd";
import { Transaction, Budget } from "@/types/transaction";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('finance-transactions');
    const savedBudgets = localStorage.getItem('finance-budgets');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance-budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setShowForm(false);
    toast({
      title: "Transaction Added",
      description: "Your transaction has been successfully added.",
    });
  };

  const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...updatedTransaction, id } : t)
    );
    setEditingTransaction(null);
    setShowForm(false);
    toast({
      title: "Transaction Updated",
      description: "Your transaction has been successfully updated.",
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaction Deleted",
      description: "Your transaction has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  // Budget management functions
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: crypto.randomUUID(),
    };
    setBudgets(prev => [...prev, newBudget]);
    toast({
      title: "Budget Added",
      description: "Your budget has been successfully added.",
    });
  };

  const updateBudget = (id: string, updatedBudget: Omit<Budget, 'id'>) => {
    setBudgets(prev =>
      prev.map(b => b.id === id ? { ...updatedBudget, id } : b)
    );
    toast({
      title: "Budget Updated",
      description: "Your budget has been successfully updated.",
    });
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    toast({
      title: "Budget Deleted",
      description: "Your budget has been successfully deleted.",
      variant: "destructive",
    });
  };

  // Calculate statistics
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalBalance = totalIncome - totalExpenses;
  const transactionCount = transactions.length;

  // Get current month data
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  const monthlyIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Balance
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${totalBalance.toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {totalBalance >= 0 ? '+12%' : '-31%'} from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Monthly Income
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    ${monthlyIncome.toFixed(2)}
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    +5.2% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Monthly Expenses
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    ${monthlyExpenses.toFixed(2)}
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    +31% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Monthly Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpenseChart transactions={transactions} />
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryChart transactions={transactions} />
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Transactions</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('transactions')}
                  >
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList
                  transactions={transactions.slice(0, 5)}
                  onEdit={handleEdit}
                  onDelete={deleteTransaction}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Transactions</span>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-0 shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList
                  transactions={transactions}
                  onEdit={handleEdit}
                  onDelete={deleteTransaction}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Category Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryChart transactions={transactions} />
              </CardContent>
            </Card>
          </div>
        );

      case 'budgets':
        return (
          <BudgetManager
            budgets={budgets}
            transactions={transactions}
            onAddBudget={addBudget}
            onUpdateBudget={updateBudget}
            onDeleteBudget={deleteBudget}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Personal Finance Dashboard
              </h1>
              <p className="text-gray-600">
                Track your expenses and manage your budget effectively
              </p>
            </div>

            {renderContent()}
          </div>

          {/* Quick Add Sidebar */}
          <div className="w-80 p-6 border-l border-gray-200">
            <QuickAdd onAddTransaction={addTransaction} />
          </div>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <TransactionForm
              onSubmit={editingTransaction 
                ? (data) => updateTransaction(editingTransaction.id, data)
                : addTransaction
              }
              onCancel={handleCloseForm}
              initialData={editingTransaction}
              mode={editingTransaction ? 'edit' : 'add'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
