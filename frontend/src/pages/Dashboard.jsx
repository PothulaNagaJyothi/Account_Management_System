import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { IndianRupee, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import Statement from './Statement'; // We will include a preview of statements
import Loader from '../components/Loader';

const Dashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/account/balance', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setBalance(data.balance);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, [token]);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                        Welcome back, {user?.name}
                    </h1>
                    <p className="text-muted">Here is what's happening with your money today.</p>
                </div>
            </div>

            <div className="dash-grid">
                <div className="card balance-card">
                    <h3 className="card-title">Total Balance</h3>
                    {loading ? (
                        <div style={{ padding: '2rem 0' }}>
                            <Loader message="Fetching balance..." />
                        </div>
                    ) : error ? (
                        <div className="balance-amount text-danger">{error}</div>
                    ) : (
                        <div className="balance-amount">
                            <Wallet className="icon-lg" />
                            <IndianRupee /> {Number(balance).toLocaleString('en-IN')}
                        </div>
                    )}
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </div>
                    <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>Quick Transfer</h3>
                    <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Send money instantly to anyone in the app.</p>
                    <Link to="/transfer" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
                        Send Money
                    </Link>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem', padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '2rem 2.5rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="card-title" style={{ margin: 0 }}>Recent Activity</h2>
                    <Link to="/statement" className="text-primary" style={{ fontSize: '0.9rem' }}>View all →</Link>
                </div>
                <div style={{ padding: '0' }}>
                    <Statement limit={5} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
