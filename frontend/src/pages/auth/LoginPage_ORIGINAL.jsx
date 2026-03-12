import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [role, setRole] = useState("CUSTOMER");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !password) { toast.error("Fill in all fields"); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.login({ username, password, role });
      login(data);
      toast.success("Welcome back!");
      navigate(role === "ADMIN" ? "/admin/dashboard" : "/customer/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #040714;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Animated background orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          animation: drift 12s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .orb1 { width: 600px; height: 600px; background: radial-gradient(circle, #1a56ff, #6b21ff); top: -150px; left: -150px; animation-duration: 14s; }
        .orb2 { width: 500px; height: 500px; background: radial-gradient(circle, #7c3aed, #db2777); bottom: -100px; right: -100px; animation-duration: 10s; animation-delay: -5s; }
        .orb3 { width: 300px; height: 300px; background: radial-gradient(circle, #0ea5e9, #06b6d4); top: 50%; left: 50%; transform: translate(-50%, -50%); animation-duration: 16s; animation-delay: -2s; }

        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.08); }
        }

        /* Grid overlay */
        .grid-overlay {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Card */
        .card-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          padding: 16px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .card-wrap.show { opacity: 1; transform: translateY(0); }

        .card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 48px 40px 40px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 48px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12);
        }

        /* Header */
        .car-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
        }
        .car-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #1a56ff, #7c3aed);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
          box-shadow: 0 8px 32px rgba(26,86,255,0.4), 0 0 0 1px rgba(255,255,255,0.1);
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        .title {
          font-family: 'Raleway', sans-serif;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #ffffff;
          text-align: center;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          text-align: center;
          margin-bottom: 36px;
          letter-spacing: 0.3px;
        }

        /* Toggle */
        .toggle-wrap {
          background: rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 4px;
          display: flex;
          margin-bottom: 28px;
          border: 1px solid rgba(255,255,255,0.08);
          position: relative;
        }
        .toggle-slider {
          position: absolute;
          top: 4px;
          left: 4px;
          width: calc(50% - 4px);
          height: calc(100% - 8px);
          background: linear-gradient(135deg, #1a56ff, #7c3aed);
          border-radius: 10px;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 16px rgba(26,86,255,0.4);
        }
        .toggle-slider.admin { transform: translateX(100%); }

        .toggle-btn {
          flex: 1;
          padding: 10px;
          background: none;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s;
          position: relative;
          z-index: 1;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
        }
        .toggle-btn.active { color: #ffffff; }
        .toggle-btn.inactive { color: rgba(255,255,255,0.4); }

        /* Label */
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* Input */
        .input-wrap {
          position: relative;
          margin-bottom: 20px;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          font-size: 16px;
          pointer-events: none;
          transition: color 0.3s;
        }
        .input-field {
          width: 100%;
          padding: 14px 16px 14px 44px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          font-size: 14px;
          color: #ffffff;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.2); }
        .input-field:focus {
          border-color: rgba(26,86,255,0.6);
          background: rgba(26,86,255,0.08);
          box-shadow: 0 0 0 3px rgba(26,86,255,0.15), 0 0 20px rgba(26,86,255,0.1);
        }
        .input-field:focus + .input-icon,
        .input-wrap:focus-within .input-icon { color: #1a56ff; }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.3);
          font-size: 16px;
          padding: 4px;
          transition: color 0.3s;
          display: flex;
          align-items: center;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.7); }

        /* Submit btn */
        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #1a56ff 0%, #7c3aed 100%);
          border: none;
          border-radius: 14px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 24px rgba(26,86,255,0.35);
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 16px 40px rgba(26,86,255,0.5);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s;
        }
        .submit-btn:hover::before { left: 100%; }

        /* Bottom links */
        .bottom-links {
          text-align: center;
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .register-link {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }
        .register-link a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .register-link a:hover { color: #93c5fd; }

        /* Admin info card */
        .admin-card {
          margin-top: 20px;
          padding: 14px 18px;
          background: rgba(26,86,255,0.08);
          border: 1px solid rgba(26,86,255,0.2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-card-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #1a56ff;
          flex-shrink: 0;
          box-shadow: 0 0 8px #1a56ff;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .admin-card-text {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }
        .admin-card-text strong { color: rgba(255,255,255,0.7); }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .divider-text { font-size: 11px; color: rgba(255,255,255,0.2); letter-spacing: 0.5px; }
      `}</style>

      <div className="login-root">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="grid-overlay" />

        <div className={`card-wrap ${mounted ? 'show' : ''}`}>
          <div className="card">
            {/* Header */}
            <div className="car-icon-wrap">
              <div className="car-icon">🚗</div>
            </div>
            <h1 className="title">Car Rental System</h1>
            <p className="subtitle">Fleet Management & Booking Platform</p>

            {/* Role Toggle */}
            <div className="toggle-wrap">
              <div className={`toggle-slider ${role === 'ADMIN' ? 'admin' : ''}`} />
              <button className={`toggle-btn ${role === 'CUSTOMER' ? 'active' : 'inactive'}`} onClick={() => setRole('CUSTOMER')}>
                Customer
              </button>
              <button className={`toggle-btn ${role === 'ADMIN' ? 'active' : 'inactive'}`} onClick={() => setRole('ADMIN')}>
                Admin
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submit}>
              <div>
                <label className="field-label">Username</label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Password</label>
                <div className="input-wrap" style={{ marginBottom: 0 }}>
                  <span className="input-icon">🔒</span>
                  <input
                    className="input-field"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    style={{ paddingRight: '48px' }}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Signing in...' : `→ Sign In as ${role === 'ADMIN' ? 'Admin' : 'Customer'}`}
              </button>
            </form>

            {/* Bottom links */}
            <div className="bottom-links">
              <p className="register-link">
                Don't have an account? <a href="/register">Register here</a>
              </p>
            </div>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">DEFAULT ACCESS</span>
              <div className="divider-line" />
            </div>

            <div className="admin-card">
              <div className="admin-card-dot" />
              <p className="admin-card-text">
                Admin login — <strong>admin</strong> / <strong>admin123</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
