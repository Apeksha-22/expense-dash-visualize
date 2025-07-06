
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // Format: "2025-07"
}

export const CATEGORIES = {
  'Food & Dining': '🍽️',
  'Housing': '🏠',
  'Transportation': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Healthcare': '🏥',
  'Education': '📚',
  'Utilities': '⚡',
  'Travel': '✈️',
  'Other': '📦'
};
