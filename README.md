📊 Personal Finance Visualizer
A modern, responsive dashboard to track your expenses, visualize spending categories, and manage monthly budgets — built with Next.js, Tailwind CSS, shadcn/ui, Recharts, and MongoDB.

🚀 Features
✅ Stage 1: Basic Transaction Tracking
Add, edit, and delete transactions (amount, description, date)

Recent transaction list

Monthly bar chart for expense trends

✅ Stage 2: Categories & Visualization
Predefined categories (Food, Rent, Travel, etc.)

Category-wise pie chart

Summary cards (total expenses, income, most recent transactions)

✅ Stage 3: Budgeting
Set monthly category budgets

Visual comparison: Budget vs Actual

Simple financial insights

🛠️ Tech Stack
Frontend: Next.js 14, React, Tailwind CSS (via shadcn/ui)

Charts: Recharts (BarChart, PieChart, etc.)

Backend: API Routes (Next.js), MongoDB (via Mongoose)

Design System: shadcn/ui + Lucide Icons

📷 Screenshots

![image](https://github.com/user-attachments/assets/b0577f89-1a17-4843-a7e8-44ac547315b7)

📦 Installation
<pre>
git clone https://github.com/Apeksha-22/expense-dash-visualize.git
cd expense-dash-visualize
npm install
npm run dev
Then open: http://localhost:3000
</pre>

🌐 Live Demo
🔗 View Deployed Project
https://expense-dash-visualize.vercel.app/

📁 Folder Structure

<pre>
src/
├── components/
│   ├── BudgetManager.tsx
│   ├── CategoryChart.tsx
│   ├── ExpenseChart.tsx
│   ├── QuickAdd.tsx
│   ├── Sidebar.tsx
│   ├── TransactionForm.tsx
│   └── TransactionList.tsx
│   └── ui/
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       └── navigation-menu.tsx
| 
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── pages/
│   ├── Index.tsx
│   └── NotFound.tsx
├── types/
│   └── transaction.ts
├── App.css
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts


</pre>
🔒 Notes
No authentication/login required (as per internship rules)

Fully responsive on mobile & desktop

No external state management (Redux not used)


