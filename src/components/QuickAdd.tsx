
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORIES, Transaction } from "@/types/transaction";
import { toast } from "@/hooks/use-toast";

interface QuickAddProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const QuickAdd: React.FC<QuickAddProps> = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'expense' as 'income' | 'expense'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const transaction = {
      amount: formData.type === 'expense' ? -Math.abs(parseFloat(formData.amount)) : parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      type: formData.type,
      date: new Date().toISOString().split('T')[0]
    };

    onAddTransaction(transaction);
    setFormData({ amount: '', description: '', category: '', type: 'expense' });
    
    toast({
      title: "Success",
      description: "Transaction added successfully"
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Quick Add</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="quick-amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="quick-amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="pl-8"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="quick-description">Description</Label>
            <Input
              id="quick-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What was this for?"
            />
          </div>
          
          <div>
            <Label htmlFor="quick-category">Category</Label>
            <select
              id="quick-category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select category</option>
              {Object.keys(CATEGORIES).map(category => (
                <option key={category} value={category}>
                  {CATEGORIES[category as keyof typeof CATEGORIES]} {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'expense' }))}
                className="mr-2"
              />
              Expense
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'income' }))}
                className="mr-2"
              />
              Income
            </label>
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickAdd;
