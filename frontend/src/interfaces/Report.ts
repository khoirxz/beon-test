export interface ReportProps {
  month: string;
  total_income: string;
  total_expense: string;
  balance: number;
  income_details: IncomeDetail[];
  expense_details: ExpenseDetail[];
}

export interface IncomeDetail {
  id: string;
  payment_date: string;
  total_payment: number;
  status: string;
  billing_period: string;
}

export interface ExpenseDetail {
  id: string;
  expense_date: string;
  expense_total: number;
  description: string;
}
