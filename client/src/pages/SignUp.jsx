import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BgSVG from "../assets/bg-01.svg";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"24px 80px",
      position:"relative", zIndex:20,
    }}>
      <span
        onClick={() => navigate("/")}
        style={{ color:"#fff", fontWeight:700, fontSize:"18px", letterSpacing:"0.12em", cursor:"pointer", userSelect:"none" }}
      >
        BU PKMD
      </span>
      <div style={{ display:"flex", alignItems:"center", gap:"48px" }}>
        <button onClick={() => navigate("/")}
          style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", letterSpacing:"0.1em", background:"none", border:"none", cursor:"pointer" }}
          onMouseEnter={e => e.target.style.color="#fff"}
          onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.6)"}>
          HOME
        </button>
        <button onClick={() => navigate("/signin")}
          style={{ color:"#fff", fontWeight:600, fontSize:"13px", letterSpacing:"0.1em", background:"none", border:"none", borderBottom:"2px solid #fff", paddingBottom:"2px", cursor:"pointer" }}>
          SIGN IN
        </button>
      </div>
    </nav>
  );
}

const COLLEGE_DEPTS = {
  "College of Engineering":["Civil Engineering","Electrical Engineering","Geodetic Engineering","Mechanical Engineering"],
  "College of Science":["Biology","Chemistry","Computer Science","Information Technology","Meteorology"],
  "College of Education":["Culture and Arts Education","Bachelor of Secondary Education","Bachelor of Early Education"],
  "College of Business, Economics, and Management":["Business Administration","Accountancy","Entrepreneurship","Office Administration"],
  "College of Arts and Letters":["Communication","English","Filipino","Performing Arts","Visual Arts"],
  "College of Social Sciences and Philosophy":["Political Science","Psychology","Public Administration","Sociology"],
  "College of Nursing":["Bachelor of Science in Nursing"],
  "Institute of Physical Education, Sports, and Recreation":["Physical Education"],
  "College of Law":["Juris Doctor"],
  "Graduate School":["Master of Arts","Master of Science","Doctor of Philosophy"],
  "BU Guinobatan":["Agriculture","Fisheries"],
  "BU Polangui":["Nursing","Information Technology-Animation","Computer Engineering"],
  "BU Tabaco":["Nursing"],
};

const YEARS = ["1st Year","2nd Year","3rd Year","4th Year","5th Year","Graduate"];
const BLOCS = ["A","B","C","D","N/A"];

function Field({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
      <label style={{ fontSize:"10.5px", fontWeight:600, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width:"100%", boxSizing:"border-box",
  padding:"9px 12px",
  background:"#f4f4f4", border:"1.5px solid #f4f4f4",
  borderRadius:"4px",
  fontSize:"13px", color:"#333",
  outline:"none", transition:"border-color 0.15s",
  fontFamily:"inherit",
};

const focusStyle = { borderColor:"#2d3a8c", background:"#fff" };
const blurStyle  = { borderColor:"#f4f4f4",  background:"#f4f4f4" };

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName:"", email:"", college:"", department:"",
    year:"", bloc:"", password:"", confirm:"",
  });

  const [showPass,setShowPass]= useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]= useState("");

  const set = (field) => (e) =>
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
      ...(field === "college" ? { department: "" } : {}),
    }));

  const depts = COLLEGE_DEPTS[formData.college] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.college ||
        !formData.department || !formData.year || !formData.bloc ||
        !formData.password || !formData.confirm) {
      setError("Please fill in all fields."); return;
    }
    if (formData.password !== formData.confirm) {
      setError("Passwords do not match."); return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName:   formData.fullName,
          email:      formData.email,
          college:    formData.college,
          department: formData.department,
          year:       formData.year,
          bloc:       formData.bloc,
          password:   formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed."); return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role",  data.user.role);
      localStorage.setItem("user",  JSON.stringify(data.user));

      navigate("/library");

    } catch (err) {
      setError("Cannot connect to server. Make sure it is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display:"flex", flexDirection:"column",
      minHeight:"100vh",
      backgroundColor:"#2d3a8c",
      position:"relative", overflow:"hidden",
    }}>

      <img
        src={BgSVG}
        aria-hidden="true"
        style={{
          position:"absolute", top:0, left:0,
          width:"100%", height:"100%",
          objectFit:"cover", objectPosition:"center",
          pointerEvents:"none", userSelect:"none",
          zIndex:0,
        }}
      />

      <Navbar />

      <div style={{
        flex:1, display:"flex",
        alignItems:"center", justifyContent:"center",
        padding:"24px 20px",
        position:"relative", zIndex:10,
      }}>

        <div style={{
          background:"#fff",
          borderRadius:"20px",
          padding:"36px 44px",
          width:"100%", maxWidth:"620px",
          boxShadow:"0 24px 64px rgba(0,0,0,0.25)",
        }}>

          <h1 style={{
            color:"#111", fontSize:"1.35rem", fontWeight:600,
            margin:"0 0 4px", lineHeight:1.3,
          }}>
            Create Your Account
          </h1>
          <p style={{ color:"#aaa", fontSize:"13px", margin:"0 0 22px" }}>
            Fill in your details to get started and start browsing the library.
          </p>

          {error && (
            <div style={{
              background:"#fff0f0", border:"1px solid #fcc",
              borderRadius:"8px", padding:"9px 13px",
              color:"#c0392b", fontSize:"13px",
              marginBottom:"14px",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"12px" }}>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <Field label="Complete Name *">
                <input
                  type="text" placeholder="e.g. Elisha Faith R. Alcazar"
                  value={formData.fullName} onChange={set("fullName")}
                  autoComplete="name" style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e  => Object.assign(e.target.style, blurStyle)}
                />
              </Field>
              <Field label="BU Email Address *">
                <input
                  type="email" placeholder="e.g. elishafaith@bicol-u.edu.ph"
                  value={formData.email} onChange={set("email")}
                  autoComplete="email" style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e  => Object.assign(e.target.style, blurStyle)}
                />
              </Field>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <Field label="College *">
                <select
                  value={formData.college} onChange={set("college")}
                  style={{ ...inputStyle, color: formData.college ? "#333" : "#aaa" }}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e  => Object.assign(e.target.style, blurStyle)}
                >
                  <option value="" disabled>Select College…</option>
                  {Object.keys(COLLEGE_DEPTS).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Department/Course *">
                <select
                  value={formData.department} onChange={set("department")}
                  disabled={!formData.college}
                  style={{
                    ...inputStyle,
                    color: formData.department ? "#333" : "#aaa",
                    opacity: formData.college ? 1 : 0.5,
                    cursor: formData.college ? "pointer" : "not-allowed",
                  }}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e  => Object.assign(e.target.style, blurStyle)}
                >
                  <option value="" disabled>
                    {formData.college ? "Select Department…" : "Select a college first…"}
                  </option>
                  {depts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <Field label="Year *">
                <select
                  value={formData.year} onChange={set("year")}
                  style={{ ...inputStyle, color: formData.year ? "#333" : "#aaa" }}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e  => Object.assign(e.target.style, blurStyle)}
                >
                  <option value="" disabled>Select year…</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </Field>
              <Field label="Bloc *">
                <select
                  value={formData.bloc} onChange={set("bloc")}
                  style={{ ...inputStyle, color: formData.bloc ? "#333" : "#aaa" }}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e  => Object.assign(e.target.style, blurStyle)}
                >
                  <option value="" disabled>Select Bloc…</option>
                  {BLOCS.map(b => <option key={b} value={b}>Bloc {b}</option>)}
                </select>
              </Field>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <Field label="Password *">
                <div style={{ position:"relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={formData.password} onChange={set("password")}
                    autoComplete="new-password"
                    style={{ ...inputStyle, paddingRight:"38px" }}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  />
                  <svg onClick={() => setShowPass(p => !p)}
                    style={{ position:"absolute", right:"11px", top:"50%", transform:"translateY(-50%)", cursor:"pointer", opacity:0.4 }}
                    width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                    {showPass
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </div>
              </Field>
              <Field label="Confirm Password *">
                <div style={{ position:"relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirm} onChange={set("confirm")}
                    autoComplete="new-password"
                    style={{ ...inputStyle, paddingRight:"38px" }}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  />
                  <svg onClick={() => setShowConfirm(p => !p)}
                    style={{ position:"absolute", right:"11px", top:"50%", transform:"translateY(-50%)", cursor:"pointer", opacity:0.4 }}
                    width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                    {showConfirm
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </div>
              </Field>
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background="#d4590f"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background="#e86c1a"; }}
              style={{
                background: loading ? "#f0a070" : "#e86c1a",
                color:"#fff", fontWeight:700,
                fontSize:"13px", letterSpacing:"0.12em",
                padding:"12px", borderRadius:"10px",
                border:"none", cursor: loading ? "not-allowed" : "pointer",
                marginTop:"4px", transition:"background 0.15s",
              }}>
              {loading ? (
                  <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"
                      style={{ animation:"spin 0.7s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    CREATING ACCOUNT...
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                  </span>
                ) : "CREATE ACCOUNT"}
            </button>

          </form>

          <p style={{ textAlign:"center", fontSize:"13px", color:"#888", margin:"16px 0 0" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/signin")}
              style={{ color:"#2d3a8c", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}
              onMouseEnter={e => e.target.style.color="#e86c1a"}
              onMouseLeave={e => e.target.style.color="#2d3a8c"}
            >
              Sign in
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}