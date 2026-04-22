import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { token, logout } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food' });

    // Fetch expenses on load
    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const fetchExpenses = async () => {
        try {
            const res = await axios.get('/expenses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(res.data);
        } catch (err) {
            console.error("Error fetching expenses", err);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/expense', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ title: '', amount: '', category: 'Food' }); // Reset form
            fetchExpenses(); // Refresh list
        } catch (err) {
            alert("Failed to add expense");
        }
    };

    // Bonus feature: Calculate total [cite: 54]
    const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="dashboard-container">
            <header>
                <h2>My Expenses</h2>
                <button onClick={logout}>Logout</button>
            </header>

            {/* Part D: Add Expense Form [cite: 49] */}
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
                </select>
                <button type="submit">Add Expense</button>
            </form>

            <h3>Total Spent: ${totalAmount}</h3>

            {/* Part D: View Expenses [cite: 51] */}
            <div className="expense-list">
                {expenses.map(exp => (
                    <div key={exp._id} className="expense-item">
                        <span>{new Date(exp.date).toLocaleDateString()}</span>
                        <strong>{exp.title}</strong>
                        <span>{exp.category}</span>
                        <span className="amount">${exp.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;