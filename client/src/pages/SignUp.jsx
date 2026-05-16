import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BgSVG   from "../assets/bg-01.svg";
import BUPhoto from "../assets/bu-fourpillars.png";

// ─── Navbar ───────────────────────────────────────────────────────────────────
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

// ─── College → Departments/Courses map ───────────────────────────────────────
const COLLEGE_DEPTS = {
  "College of Engineering":          ["Civil Engineering","Electrical Engineering","Electronics Engineering","Mechanical Engineering","Computer Engineering"],
  "College of Science":              ["Biology","Chemistry","Mathematics","Physics","Computer Science","Information Technology"],
  "College of Education":            ["Bachelor of Elementary Education","Bachelor of Secondary Education","Bachelor of Physical Education"],
  "College of Business and Economics":["Business Administration","Accountancy","Economics","Office Administration"],
  "College of Arts and Letters":     ["Communication","English","Filipino","Performing Arts","Visual Arts"],
  "College of Social Sciences":      ["Political Science","Psychology","Public Administration","Sociology"],
  "College of Nursing":              ["Bachelor of Science in Nursing"],
  "College of Agriculture":          ["Agriculture","Agribusiness","Forestry"],
  "College of Law":                  ["Juris Doctor"],
  "Graduate School":                 ["Master of Arts","Master of Science","Doctor of Philosophy"],
};

const YEARS   = ["1st Year","2nd Year","3rd Year","4th Year","5th Year","Graduate"];
const BLOCS   = ["A","B","C","D","E","F","G","H","N/A"];

// ─── Reusable input ───────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
      <label style={{ fontSize:"11px", fontWeight:600, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width:"100%", boxSizing:"border-box",
  padding:"11px 14px",
  background:"#f4f4f4", border:"1.5px solid #f4f4f4",
  borderRadius:"10px",
  fontSize:"13.5px", color:"#333",
  outline:"none", transition:"border-color 0.15s",
  fontFamily:"inherit",
};

const focusStyle  = { borderColor:"#2d3a8c", background:"#fff" };
const blurStyle   = { borderColor:"#f4f4f4",  background:"#f4f4f4" };

// ─── SignUp Page ──────────────────────────────────────────────────────────────
export default function SignUp() {
  const navigate = useNavigate();

  // ── Form state — ready to POST to your backend ───────────────────────────
  // To connect:
  //   import axios from "axios"
  //   POST /api/auth/register  with the formData object
  const [formData, setFormData] = useState({
    fullName:   "",
    email:      "",
    college:    "",
    department: "",
    year:       "",
    bloc:       "",
    password:   "",
    confirm:    "",
  });

  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const set = (field) => (e) =>
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
      // reset department when college changes
      ...(field === "college" ? { department: "" } : {}),
    }));

  const depts = COLLEGE_DEPTS[formData.college] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
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
      // ── Replace with your real API call ───────────────────────────────────
      // const res = await axios.post("/api/auth/register", {
      //   fullName:   formData.fullName,
      //   email:      formData.email,
      //   college:    formData.college,
      //   department: formData.department,
      //   year:       formData.year,
      //   bloc:       formData.bloc,
      //   password:   formData.password,
      // });
      // localStorage.setItem("token", res.data.token);
      // navigate("/dashboard");
      // ─────────────────────────────────────────────────────────────────────
      console.log("Register:", formData);
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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

      {/* BG SVG */}
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

      {/* Navbar */}
      <Navbar />

      {/* Centered card */}
      <div style={{
        flex:1, display:"flex",
        alignItems:"flex-start", justifyContent:"center",
        padding:"40px 20px 60px",
        position:"relative", zIndex:10,
      }}>

        {/* Card — wider than sign in to fit more fields */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"380px 1fr",
          width:"100%", maxWidth:"960px",
          borderRadius:"20px",
          overflow:"hidden",
          boxShadow:"0 24px 64px rgba(0,0,0,0.25)",
        }}>

          {/* ── Left: BU Photo ── */}
          <div style={{ position:"relative", overflow:"hidden", minHeight:"560px" }}>
            <img
              src={BUPhoto}
              alt="Bicol University"
              style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block" }}
            />
            {/* Overlay text */}
            <div style={{
              position:"absolute", bottom:0, left:0, right:0,
              padding:"32px 28px",
              background:"linear-gradient(to top, rgba(13,30,80,0.85) 0%, transparent 100%)",
            }}>
              <p style={{ color:"rgba(255,255,255,0.9)", fontSize:"13px", lineHeight:1.6, margin:0 }}>
                Join the BU PKMD digital archive and access thousands of university publications and research materials.
              </p>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div style={{
            background:"#fff",
            padding:"40px 44px",
            display:"flex", flexDirection:"column",
            justifyContent:"center",
            overflowY:"auto",
          }}>

            {/* Header */}
            <h1 style={{
              color:"#111",
              fontSize:"clamp(1.2rem, 1.8vw, 1.5rem)",
              fontWeight:600,
              margin:"0 0 6px",
              lineHeight:1.3,
            }}>
              Create your account
            </h1>
            <p style={{ color:"#aaa", fontSize:"13px", margin:"0 0 28px" }}>
              Fill in your details to get started.
            </p>

            {/* Error */}
            {error && (
              <div style={{
                background:"#fff0f0", border:"1px solid #fcc",
                borderRadius:"8px", padding:"10px 14px",
                color:"#c0392b", fontSize:"13px",
                marginBottom:"16px",
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

              {/* Full Name */}
              <Field label="Complete Name *">
                <input
                  type="text"
                  placeholder="e.g. Juan dela Cruz"
                  value={formData.fullName}
                  onChange={set("fullName")}
                  autoComplete="name"
                  style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e  => Object.assign(e.target.style, blurStyle)}
                />
              </Field>

              {/* Email */}
              <Field label="Email Address *">
                <input
                  type="email"
                  placeholder="e.g. juandelacruz@bicol-u.edu.ph"
                  value={formData.email}
                  onChange={set("email")}
                  autoComplete="email"
                  style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e  => Object.assign(e.target.style, blurStyle)}
                />
              </Field>

              {/* College */}
              <Field label="College *">
                <select
                  value={formData.college}
                  onChange={set("college")}
                  style={{ ...inputStyle, color: formData.college ? "#333" : "#aaa" }}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e  => Object.assign(e.target.style, blurStyle)}
                >
                  <option value="" disabled>Select college…</option>
                  {Object.keys(COLLEGE_DEPTS).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              {/* Department / Course */}
              <Field label="Department / Course *">
                <select
                  value={formData.department}
                  onChange={set("department")}
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
                    {formData.college ? "Select department/course…" : "Select a college first…"}
                  </option>
                  {depts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </Field>

              {/* Year + Bloc — side by side */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                <Field label="Year *">
                  <select
                    value={formData.year}
                    onChange={set("year")}
                    style={{ ...inputStyle, color: formData.year ? "#333" : "#aaa" }}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  >
                    <option value="" disabled>Select year…</option>
                    {YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Bloc *">
                  <select
                    value={formData.bloc}
                    onChange={set("bloc")}
                    style={{ ...inputStyle, color: formData.bloc ? "#333" : "#aaa" }}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  >
                    <option value="" disabled>Select bloc…</option>
                    {BLOCS.map(b => (
                      <option key={b} value={b}>Bloc {b}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Password */}
              <Field label="Password *">
                <div style={{ position:"relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={set("password")}
                    autoComplete="new-password"
                    style={{ ...inputStyle, paddingRight:"40px" }}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  />
                  <svg
                    onClick={() => setShowPass(p => !p)}
                    style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", cursor:"pointer", opacity:0.4 }}
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                    {showPass
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </div>
              </Field>

              {/* Confirm Password */}
              <Field label="Confirm Password *">
                <div style={{ position:"relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirm}
                    onChange={set("confirm")}
                    autoComplete="new-password"
                    style={{ ...inputStyle, paddingRight:"40px" }}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  />
                  <svg
                    onClick={() => setShowConfirm(p => !p)}
                    style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", cursor:"pointer", opacity:0.4 }}
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                    {showConfirm
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </div>
              </Field>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background="#d4590f"; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background="#e86c1a"; }}
                style={{
                  background: loading ? "#f0a070" : "#e86c1a",
                  color:"#fff", fontWeight:700,
                  fontSize:"13px", letterSpacing:"0.12em",
                  padding:"13px", borderRadius:"10px",
                  border:"none", cursor: loading ? "not-allowed" : "pointer",
                  marginTop:"4px", transition:"background 0.15s",
                }}>
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </button>

            </form>

            {/* Sign in link */}
            <p style={{ textAlign:"center", fontSize:"13px", color:"#888", margin:"20px 0 0" }}>
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
    </div>
  );
}