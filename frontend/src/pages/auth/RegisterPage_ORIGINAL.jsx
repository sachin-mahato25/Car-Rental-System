import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "", password: "", fullName: "",
    email: "", phone: "", licenseNo: "", address: ""
  });
  const [loading, setLoad] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.fullName) {
      toast.error("Username, password and full name are required"); return;
    }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (!form.phone || form.phone.length !== 10) { toast.error("Enter valid 10-digit phone number"); return; }
    setLoad(true);
    try {
      const { data } = await authAPI.register(form);
      login(data);
      toast.success("Account created! Welcome aboard!");
      navigate("/customer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally { setLoad(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .reg-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #040714;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
          padding: 40px 16px;
        }

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
        .orb3 { width: 300px; height: 300px; background: radial-gradient(circle, #0ea5e9, #06b6d4); top: 40%; left: 60%; animation-duration: 16s; animation-delay: -2s; }

        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 30px) scale(1.08); }
        }

        .grid-overlay {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .card-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 520px;
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
          padding: 44px 40px 40px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .car-icon-wrap { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .car-icon {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #1a56ff, #7c3aed);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
          box-shadow: 0 8px 32px rgba(26,86,255,0.4), 0 0 0 1px rgba(255,255,255,0.1);
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }

        .title {
          font-family: 'Raleway', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          text-align: center;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          text-align: center;
          margin-bottom: 32px;
          letter-spacing: 0.3px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .field-wrap { margin-bottom: 16px; }
        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          margin-bottom: 7px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .field-label span { color: #f87171; }

        .input-wrap { position: relative; }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          pointer-events: none;
          opacity: 0.4;
          transition: opacity 0.3s;
        }
        .input-wrap:focus-within .input-icon { opacity: 0.9; }

        .input-field {
          width: 100%;
          padding: 13px 14px 13px 40px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
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
          box-shadow: 0 0 0 3px rgba(26,86,255,0.15);
        }

        .textarea-field {
          width: 100%;
          padding: 13px 14px 13px 40px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          font-size: 14px;
          color: #ffffff;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          resize: none;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
        }
        .textarea-field::placeholder { color: rgba(255,255,255,0.2); }
        .textarea-field:focus {
          border-color: rgba(26,86,255,0.6);
          background: rgba(26,86,255,0.08);
          box-shadow: 0 0 0 3px rgba(26,86,255,0.15);
        }

        .phone-hint {
          font-size: 11px;
          margin-top: 5px;
          transition: color 0.3s;
        }

        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 15px;
          padding: 4px;
          opacity: 0.4;
          transition: opacity 0.2s;
        }
        .eye-btn:hover { opacity: 0.9; }

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

        .signin-link {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }
        .signin-link a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .signin-link a:hover { color: #93c5fd; }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .divider-text { font-size: 11px; color: rgba(255,255,255,0.2); letter-spacing: 0.5px; }
      `}</style>

      <div className="reg-root">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="grid-overlay" />

        <div className={`card-wrap ${mounted ? 'show' : ''}`}>
          <div className="card">
            <div className="car-icon-wrap">
              <div className="car-icon">🚗</div>
            </div>
            <h1 className="title">Create Account</h1>
            <p className="subtitle">Join Car Rental System</p>

            <form onSubmit={submit}>
              {/* Username + Password */}
              <div className="grid-2">
                <div>
                  <label className="field-label">Username <span>*</span></label>
                  <div className="input-wrap">
                    <span className="input-icon">👤</span>
                    <input name="username" type="text" value={form.username} onChange={handle}
                      placeholder="Choose a username" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="field-label">Password <span>*</span></label>
                  <div className="input-wrap">
                    <span className="input-icon">🔒</span>
                    <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle}
                      placeholder="Min 6 characters" className="input-field" style={{ paddingRight: '40px' }} />
                    <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="field-wrap">
                <label className="field-label">Full Name <span>*</span></label>
                <div className="input-wrap">
                  <span className="input-icon">✏️</span>
                  <input name="fullName" type="text" value={form.fullName} onChange={handle}
                    placeholder="Your full name" className="input-field" />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid-2">
                <div>
                  <label className="field-label">Email</label>
                  <div className="input-wrap">
                    <span className="input-icon">📧</span>
                    <input name="email" type="email" value={form.email} onChange={handle}
                      placeholder="you@email.com" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="field-label">Phone <span>*</span></label>
                  <div className="input-wrap">
                    <span className="input-icon">📞</span>
                    <input name="phone" type="tel" value={form.phone}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                        setForm({ ...form, phone: val });
                      }}
                      maxLength={10} placeholder="10-digit number" className="input-field" />
                  </div>
                  <p className="phone-hint" style={{ color: form.phone.length === 10 ? '#4ade80' : 'rgba(255,255,255,0.25)' }}>
                    {form.phone.length}/10 {form.phone.length === 10 ? '✓' : ''}
                  </p>
                </div>
              </div>

              {/* License */}
              <div className="field-wrap">
                <label className="field-label">License No</label>
                <div className="input-wrap">
                  <span className="input-icon">🪪</span>
                  <input name="licenseNo" type="text" value={form.licenseNo} onChange={handle}
                    placeholder="Driving license number" className="input-field" />
                </div>
              </div>

              {/* Address */}
              <div className="field-wrap">
                <label className="field-label">Address</label>
                <div className="input-wrap">
                  <span className="input-icon" style={{ top: '16px', transform: 'none' }}>📍</span>
                  <textarea name="address" value={form.address} onChange={handle}
                    placeholder="Your address" rows={2} className="textarea-field" />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating Account...' : '→ Create Account'}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">ALREADY A MEMBER</span>
              <div className="divider-line" />
            </div>

            <p className="signin-link" style={{ marginTop: '16px' }}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
