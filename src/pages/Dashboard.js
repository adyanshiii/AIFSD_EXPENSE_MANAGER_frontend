import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { token, logout } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food' });

    // Define fetchExpenses with useCallback to avoid re-creation loops
    const fetchExpenses = useCallback(async () => {
        if (!token) return; // Don't fetch if token isn't available yet
        try {
            const res = await axios.get('/expenses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(res.data);
        } catch (err) {
            console.error("Error fetching expenses", err);
        }
    }, [token]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/expense', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ title: '', amount: '', category: 'Food' });
            fetchExpenses(); // Part D: Refresh list after adding [cite: 49, 51]
        } catch (err) {
            alert("Failed to add expense");
        }
    };

    // Part D: Optional Bonus - Show total expense amount [cite: 54]
    const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="dashboard-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>My Expenses</h2>
                <button onClick={logout} style={{ background: '#ff4d4d', color: 'white' }}>Logout</button>
            </header>

            <form onSubmit={handleAddExpense} className="expense-form">
                <input type="text" placeholder="Title" value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                <input type="number" placeholder="Amount" value={formData.amount} 
                    onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Bills">Bills</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                </select>
                <button type="submit">Add Expense</button>
            </form>

            <h3 style={{ margin: '20px 0', color: '#2c3e50' }}>
                Total Spent: ${totalAmount.toFixed(2)}
            </h3>

            <div className="expense-list">
                {expenses.length === 0 ? <p>No expenses recorded yet.</p> : 
                    expenses.map(exp => (
                        <div key={exp._id} className="expense-item" style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                            <span>{new Date(exp.date).toLocaleDateString()}</span>
                            <strong style={{ margin: '0 15px' }}>{exp.title}</strong>
                            <span style={{ color: '#7f8c8d', fontStyle: 'italic' }}>{exp.category}</span>
                            <span className="amount" style={{ float: 'right', fontWeight: 'bold' }}>${exp.amount}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Dashboard;