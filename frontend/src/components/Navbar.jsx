import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, LogOut, Send, FileText, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <Wallet className="navbar-icon" />
                    <span>PaySwift</span>
                </Link>
                {user && (
                    <div ref={menuRef}>
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle navigation menu"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>

                        <div className={`navbar-links ${isMenuOpen ? 'mobile-open' : ''}`}>
                            <div className="nav-links-group">
                                <Link to="/" className={`nav-link ${isActive('/') ? 'text-primary' : ''}`}>
                                    <Wallet className="icon-sm" /> Dashboard
                                </Link>
                                <Link to="/transfer" className={`nav-link ${isActive('/transfer') ? 'text-primary' : ''}`}>
                                    <Send className="icon-sm" /> Send Money
                                </Link>
                                <Link to="/statement" className={`nav-link ${isActive('/statement') ? 'text-primary' : ''}`}>
                                    <FileText className="icon-sm" /> Statement
                                </Link>
                            </div>

                            <div className="nav-actions-group">
                                <button onClick={handleLogout} className="btn-logout">
                                    <LogOut className="icon-sm" /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
