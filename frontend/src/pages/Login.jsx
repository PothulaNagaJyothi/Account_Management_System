import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 404) {
        alert("You don't have an account. Please create one.");
        navigate("/signup");
        return;
      }

      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div style={{ animation: "fadeIn 0.5s ease-out" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--primary)",
            }}
          >
            <LogIn size={36} />
            <span>PaySwift</span>
          </div>
        </div>

        <div className="card auth-card">
          <h2
            className="card-title text-center"
            style={{ marginBottom: "0.5rem" }}
          >
            Welcome back
          </h2>
          <p
            className="text-muted text-center"
            style={{ marginBottom: "2rem" }}
          >
            Enter your credentials to access your account
          </p>

          {error && (
            <div
              className="text-danger text-center form-group"
              style={{
                padding: "0.75rem",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: "8px",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-4"
              disabled={isLoading}
              style={{ height: "48px" }}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Log In
                  <LogIn size={20} />
                </>
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <p className="text-muted" style={{ fontSize: "0.95rem" }}>
              New to PaySwift?{" "}
              <Link to="/signup" className="text-primary">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
