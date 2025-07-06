
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, DollarSign, Calendar, FileText } from "lucide-react";
import { Transaction, CATEGORIES } from "@/types/transaction";

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
  initialData?: Transaction | null;
  mode: 'add' | 'edit';
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  mode
}) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (initialData) {
      setAmount(Math.abs(initialData.amount).toString());
      setDate(initialData.date);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setType(initialData.type);
    } else {
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      date,
      description: description.trim(),
      category,
      type
    });

    // Reset form
    setAmount('');
    setDate('');
    setDescription('');
    setCategory('Other');
    setType('expense');
    setErrors({});
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {mode === 'edit' ? 'Edit Transaction' : 'Add New Transaction'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Transaction Type
            </Label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={type === 'expense'}
                  onChange={(e) => setType(e.target.value as 'expense')}
                  className="mr-2 text-red-600"
                />
                <span className="text-red-600">💸 Expense</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={type === 'income'}
                  onChange={(e) => setType(e.target.value as 'income')}
                  className="mr-2 text-green-600"
                />
                <span className="text-green-600">💰 Income</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`${errors.amount ? 'border-red-500' : ''}`}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${errors.date ? 'border-red-500' : ''}`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : ''}`}
            >
              {Object.keys(CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORIES[cat as keyof typeof CATEGORIES]} {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${errors.description ? 'border-red-500' : ''} resize-none`}
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className={`flex-1 text-white ${
                type === 'income' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                  : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
              }`}
            >
              {mode === 'edit' ? 'Update Transaction' : 'Add Transaction'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
