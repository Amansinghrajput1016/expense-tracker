import { useEffect, useMemo, useState } from 'react'
import './App.css'

const categories = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Other',
]

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('aman-expenses')
    return saved ? JSON.parse(saved) : []
  })

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    localStorage.setItem('aman-expenses', JSON.stringify(expenses))
  }, [expenses])

  const total = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  }, [expenses])

  const categoryTotals = useMemo(() => {
    return categories.map((category) => ({
      category,
      total: expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + Number(expense.amount), 0),
    }))
  }, [expenses])

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0) {
      return
    }

    const newExpense = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
    }

    setExpenses([newExpense, ...expenses])

    setForm({
      title: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
    })
  }

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">PROJECT 01</p>
          <h1>Expense Tracker</h1>
          <p className="subtitle">
            Track your spending, understand your habits, and stay in control.
          </p>
        </div>

        <div className="total-card">
          <span>Total spending</span>
          <strong>₹{total.toLocaleString('en-IN')}</strong>
        </div>
      </header>

      <main className="dashboard">
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">ADD EXPENSE</p>
              <h2>Record a purchase</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Expense
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Grocery shopping"
                required
              />
            </label>

            <label>
              Amount
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 500"
                min="1"
                step="0.01"
                required
              />
            </label>

            <div className="form-row">
              <label>
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <button type="submit" className="primary-button">
              Add expense
            </button>
          </form>
        </section>

        <section className="panel summary-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">BREAKDOWN</p>
              <h2>By category</h2>
            </div>
          </div>

          <div className="category-list">
            {categoryTotals.map((item) => (
              <div className="category-row" key={item.category}>
                <span>{item.category}</span>
                <strong>
                  ₹{item.total.toLocaleString('en-IN')}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel expenses-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">TRANSACTIONS</p>
              <h2>Recent expenses</h2>
            </div>

            <span className="count">
              {expenses.length} {expenses.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {expenses.length === 0 ? (
            <div className="empty-state">
              <h3>No expenses yet.</h3>
              <p>Add your first expense using the form above.</p>
            </div>
          ) : (
            <div className="expense-list">
              {expenses.map((expense) => (
                <article className="expense-item" key={expense.id}>
                  <div>
                    <h3>{expense.title}</h3>
                    <p>
                      {expense.category} · {expense.date}
                    </p>
                  </div>

                  <div className="expense-actions">
                    <strong>
                      ₹{expense.amount.toLocaleString('en-IN')}
                    </strong>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteExpense(expense.id)}
                      aria-label={`Delete ${expense.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App