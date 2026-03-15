import { Loader2 } from 'lucide-react';

const Loader = ({ message = "Loading...", fullScreen = false }) => {
    const containerClass = fullScreen
        ? "loader-container full-screen"
        : "loader-container";

    return (
        <div className={containerClass}>
            <Loader2 className="spinner-icon" />
            <span className="loader-text">{message}</span>
        </div>
    );
};

export default Loader;
