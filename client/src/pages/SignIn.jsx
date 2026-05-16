import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BgSVG from "../assets/bg-01.svg";
import BUPhoto from "../assets/bu-oval.png";

//copy from home
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

//sign in
export default function SignIn() {
  const navigate = useNavigate();
//placeholder for backend do not touch yet
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      
      console.log("Sign in with:", { email, password });
      navigate("/dashboard"); //placeholder redirect
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
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

      {/*center card*/}
      <div style={{
        flex:1, display:"flex",
        alignItems:"center", justifyContent:"center",
        padding:"40px 20px",
        position:"relative", zIndex:10,
      }}>

        {/*card*/}
        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          width:"100%", maxWidth:"800px",
          minHeight:"300px",
          borderRadius:"20px",
          overflow:"hidden",
          boxShadow:"0 24px 64px rgba(0,0,0,0.25)",
        }}>

          {/*BU img again*/}
          <div style={{ position:"relative", overflow:"hidden" }}>
            <img
              src={BUPhoto}
              alt="Bicol University"
              title="image source: RSS.com"
              style={{
                width:"100%", height:"100%",
                objectFit:"cover", objectPosition:"center",
                display:"block",
              }}
            />
          </div>

          <div style={{
            background:"#fff",
            padding:"52px 48px",
            display:"flex", flexDirection:"column",
            justifyContent:"center",
          }}>

            {/* Greeting */}
            <h1 style={{
              color:"#111",
              fontSize:"clamp(1.3rem, 2vw, 1.7rem)",
              fontWeight:600,
              margin:"0 0 32px",
              lineHeight:1.3,
            }}>
              Marhay na Aga, Bueño! {/*mas ok siguro if base sa time? aga hapon gabi?*/}
            </h1>

            {/*error message*/}
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

            {/*form*/}
            <form onSubmit={handleSignIn} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

              {/*email input */}
              <div style={{ position:"relative" }}>
                {/*icons*/}
                <svg style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  style={{
                    width:"100%", boxSizing:"border-box",
                    padding:"13px 14px 13px 40px",
                    background:"#f4f4f4", border:"1.5px solid #f4f4f4",
                    borderRadius:"10px",
                    fontSize:"14px", color:"#333",
                    outline:"none", transition:"border-color 0.15s",
                  }}
                  onFocus={e => e.target.style.borderColor="#2d3a8c"}
                  onBlur={e  => e.target.style.borderColor="#f4f4f4"}
                />
              </div>

              {/*password input */}
              <div style={{ position:"relative" }}>
                {/*eye icon*/}
                <svg
                  onClick={() => setShowPass(p => !p)}
                  style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", cursor:"pointer", zIndex:1 }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
                  {showPass
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  style={{
                    width:"100%", boxSizing:"border-box",
                    padding:"13px 14px 13px 40px",
                    background:"#f4f4f4", border:"1.5px solid #f4f4f4",
                    borderRadius:"10px",
                    fontSize:"14px", color:"#333",
                    outline:"none", transition:"border-color 0.15s",
                  }}
                  onFocus={e => e.target.style.borderColor="#2d3a8c"}
                  onBlur={e  => e.target.style.borderColor="#f4f4f4"}
                />
              </div>

              {/*sign in button */}
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
                {loading ? "SIGNING IN..." : "SIGN IN"}
              </button>

            </form>

            {/*divideer*/}
            <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"24px 0" }}>
              <hr style={{ flex:1, border:"none", borderTop:"1px solid #e8e8e8" }} />
              <span style={{ color:"#aaa", fontSize:"12px", whiteSpace:"nowrap" }}>or continue with</span>
              <hr style={{ flex:1, border:"none", borderTop:"1px solid #e8e8e8" }} />
            </div>

            {/*other buttons no target*/}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>

              {/*Facebook*/}
              <button
                onClick={() => console.log("Facebook login")}
                onMouseEnter={e => e.currentTarget.style.background="#e8e8e8"}
                onMouseLeave={e => e.currentTarget.style.background="#f4f4f4"}
                style={{ background:"#f4f4f4", border:"none", borderRadius:"10px", padding:"11px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.15s" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>

              {/*Google*/}
              <button
                onClick={() => console.log("Google login")}
                onMouseEnter={e => e.currentTarget.style.background="#e8e8e8"}
                onMouseLeave={e => e.currentTarget.style.background="#f4f4f4"}
                style={{ background:"#f4f4f4", border:"none", borderRadius:"10px", padding:"11px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.15s" }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>

              {/*Apple*/}
              <button
                onClick={() => console.log("Apple login")}
                onMouseEnter={e => e.currentTarget.style.background="#e8e8e8"}
                onMouseLeave={e => e.currentTarget.style.background="#f4f4f4"}
                style={{ background:"#f4f4f4", border:"none", borderRadius:"10px", padding:"11px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.15s" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>

            </div>

            {/*sign up*/}
            <p style={{ textAlign:"center", fontSize:"13px", color:"#888", margin:"24px 0 0" }}>
              Don't have an account yet?{" "}
              <span
                onClick={() => navigate("/signup")}
                style={{ color:"#2d3a8c", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}
                onMouseEnter={e => e.target.style.color="#e86c1a"}
                onMouseLeave={e => e.target.style.color="#2d3a8c"}
              >
                Sign up
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}