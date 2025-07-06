
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Budget, CATEGORIES, Transaction } from "@/types/transaction";
import { toast } from "@/hooks/use-toast";

interface BudgetManagerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
  onUpdateBudget: (id: string, budget: Omit<Budget, 'id'>) => void;
  onDeleteBudget: (id: string) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  transactions,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7) // Current month
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.month) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const budgetData = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      month: formData.month
    };

    if (editingBudget) {
      onUpdateBudget(editingBudget.id, budgetData);
    } else {
      onAddBudget(budgetData);
    }

    setFormData({ category: '', amount: '', month: new Date().toISOString().slice(0, 7) });
    setShowForm(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month
    });
    setShowForm(true);
  };

  const getCurrentMonthSpending = (category: string, month: string) => {
    return transactions
      .filter(t => 
        t.type === 'expense' &&
        t.category === category &&
        t.date.startsWith(month)
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Budget Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Budget vs Actual Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual - {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentMonthBudgets.map((budget) => {
              const spent = getCurrentMonthSpending(budget.category, budget.month);
              const percentage = (spent / budget.amount) * 100;
              const isOverBudget = spent > budget.amount;
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {CATEGORIES[budget.category as keyof typeof CATEGORIES]}
                      </span>
                      <span className="font-medium">{budget.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                      </div>
                      <div className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                        {percentage.toFixed(1)}% used
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(budget)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteBudget(budget.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Budget Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingBudget ? 'Edit Budget' : 'Add New Budget'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Category</option>
                    {Object.keys(CATEGORIES).map(category => (
                      <option key={category} value={category}>
                        {CATEGORIES[category as keyof typeof CATEGORIES]} {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="amount">Budget Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingBudget ? 'Update Budget' : 'Add Budget'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingBudget(null);
                      setFormData({ category: '', amount: '', month: currentMonth });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;
