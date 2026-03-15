import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const Statement = ({ limit }) => {
    const { token } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStatement = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/account/statement', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.message);

                setTransactions(limit ? data.slice(0, limit) : data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStatement();
    }, [token, limit]);

    if (loading) return <Loader message="Loading statement..." />;
    if (error) return <div className="text-danger">{error}</div>;
    if (transactions.length === 0) return <div>No transactions found.</div>;

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => {
                        const dateStr = new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                        return (
                            <tr key={tx.id}>
                                <td>{dateStr}</td>
                                <td>
                                    <span className={`badge ${tx.type === 'Credit' ? 'badge-credit' : 'badge-debit'}`}>
                                        {tx.type}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 600 }}>₹{Number(tx.amount).toLocaleString('en-IN')}</td>
                                <td>{tx.sender}</td>
                                <td>{tx.receiver}</td>
                                <td style={{ fontWeight: 600 }}>₹{Number(tx.balanceAfter).toLocaleString('en-IN')}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Statement;
