import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Send } from 'lucide-react';

const SendMoney = () => {
    const { token, user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [receiverEmail, setReceiverEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setUsers(data);
                }
            } catch (err) {
                console.error('Failed to fetch users', err);
            }
        };
        fetchUsers();
    }, [token]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('http://localhost:5000/api/account/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ receiverEmail, amount: Number(amount) })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Transfer failed');

            setMessage('Transfer successful!');
            setAmount('');
            setReceiverEmail('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.4s ease-out', maxWidth: '600px', margin: '0 auto', paddingTop: '2rem' }}>
            <div className="card auth-card" style={{ maxWidth: '100%', padding: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Send size={24} />
                    </div>
                    <div>
                        <h2 className="card-title" style={{ margin: 0 }}>Send Money</h2>
                        <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.2rem' }}>Transfer funds to anyone instantly.</p>
                    </div>
                </div>

                {error && <div className="text-danger form-group" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
                {message && <div className="text-success form-group" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{message}</div>}

                <form onSubmit={handleTransfer}>
                    <div className="form-group">
                        <label className="form-label">Recipient</label>
                        <select
                            className="form-control"
                            value={receiverEmail}
                            onChange={(e) => setReceiverEmail(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a user to pay</option>
                            {users.map(u => (
                                <option key={u.id} value={u.email}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount (₹)</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
                            <input
                                type="number"
                                className="form-control"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                                required
                                placeholder="0.00"
                                style={{ paddingLeft: '2rem', fontSize: '1.2rem', fontWeight: 600 }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-4" disabled={loading} style={{ height: '54px' }}>
                        {loading ? 'Processing...' : 'Send Payment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SendMoney;
