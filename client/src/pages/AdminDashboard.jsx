import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BgSVG from "../assets/bg-01.svg";

// ── Fade-up hook ──────────────────────────────────────────────────────────────
function useFadeUp(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return {
    ref,
    style: {
      opacity:   visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition:`opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
    },
  };
}

// ── Read admin user from localStorage ────────────────────────────────────────
function useAdminUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const p = JSON.parse(stored);
        setUser({
          fullName: p.fullName || p.full_name || "—",
          email:    p.email    || "—",
          role:     p.role     || "admin",
          college:  p.college  || null,
          joined:   p.joined   || "—",
        });
      } catch {}
    }
  }, []);
  return { user, loading: false };
}

// ── Data hooks (backend-ready) ────────────────────────────────────────────────
function useDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch_ = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/documents", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setDocs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setDocs([]); setLoading(false); });
  }, []);
  useEffect(() => { fetch_(); }, [fetch_]);
  return { docs, loading, refetch: fetch_ };
}

function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch_ = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/reports", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setReports(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setReports([]); setLoading(false); });
  }, []);
  useEffect(() => { fetch_(); }, [fetch_]);
  return { reports, loading, refetch: fetch_ };
}

function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch_ = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setUsers([]); setLoading(false); });
  }, []);
  useEffect(() => { fetch_(); }, [fetch_]);
  return { users, loading, refetch: fetch_ };
}

function useAccessLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/logs", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setLogs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setLogs([]); setLoading(false); });
  }, []);
  return { logs, loading };
}

function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => { setStats(null); setLoading(false); });
  }, []);
  return { stats, loading };
}

async function approveDocument(id) {
  const token = localStorage.getItem("token");
  await fetch(`http://localhost:5000/api/documents/${id}`, { method:"PATCH", headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" }, body: JSON.stringify({ status:"Approved" }) });
}
async function rejectDocument(id) {
  const token = localStorage.getItem("token");
  await fetch(`http://localhost:5000/api/documents/${id}`, { method:"PATCH", headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" }, body: JSON.stringify({ status:"Rejected" }) });
}
async function deleteDocument(id) {
  const token = localStorage.getItem("token");
  await fetch(`http://localhost:5000/api/documents/${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token}` } });
}
async function generateReport(payload) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/reports", { method:"POST", headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" }, body: JSON.stringify(payload) });
  return res.json();
}
async function createStaffAccount(payload) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/users", { method:"POST", headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" }, body: JSON.stringify(payload) });
  return res.json();
}
async function signOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}

// ── Constants ─────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Documents", "Reports", "Users", "Access Logs"];

const CAT_STYLE = {
  "Thesis":            { bg:"#fff7ed", text:"#854f0b", dot:"#e86c1a" },
  "Capstone":          { bg:"#eef2ff", text:"#3c4da0", dot:"#2d3a8c" },
  "Research Paper":    { bg:"#f0fdf4", text:"#166534", dot:"#22c55e" },
  "Feasibility Study": { bg:"#fdf4ff", text:"#6b21a8", dot:"#a855f7" },
};
const STATUS_STYLE = {
  "Approved": { bg:"#f0fdf4", text:"#166534" },
  "Pending":  { bg:"#fff7ed", text:"#854f0b" },
  "Rejected": { bg:"#fff0f0", text:"#b91c1c" },
};
const ROLE_STYLE = {
  "Super admin": { bg:"#fff7ed", text:"#854f0b" },
  "PKMD staff":  { bg:"#eef2ff", text:"#3c4da0" },
  "Student":     { bg:"#f0fdf4", text:"#166534" },
  "admin":       { bg:"#fff7ed", text:"#854f0b" },
  "student":     { bg:"#f0fdf4", text:"#166534" },
};

const inputStyle = {
  width:"100%", boxSizing:"border-box", padding:"9px 12px",
  background:"#f4f4f4", border:"1.5px solid #f4f4f4",
  borderRadius:"10px", fontSize:"13px", color:"#333",
  outline:"none", transition:"border-color 0.15s", fontFamily:"inherit",
};
const focusStyle = { borderColor:"#2d3a8c", background:"#fff" };
const blurStyle  = { borderColor:"#f4f4f4",  background:"#f4f4f4" };

// ── SVG Icons (no emojis) ─────────────────────────────────────────────────────
const IconDoc = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);
const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconSchool = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconDownload = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconUserPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);
const IconSignOut = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconX = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
);

// ── Shared components ─────────────────────────────────────────────────────────
function SearchBox({ value, onChange, placeholder = "Search…" }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"8px", background:focus?"#fff":"#f4f4f4", border:focus?"1.5px solid #2d3a8c":"1.5px solid #f4f4f4", borderRadius:"10px", padding:"8px 12px", transition:"all 0.15s", minWidth:"220px" }}>
      <IconSearch />
      <input type="text" placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{ background:"none", border:"none", outline:"none", fontSize:"13px", color:"#333", width:"100%", fontFamily:"inherit" }} />
      {value && <button onClick={()=>onChange("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#bbb", fontSize:"13px", padding:0 }}>✕</button>}
    </div>
  );
}

function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ padding:"8px 12px", borderRadius:"10px", border:"1.5px solid #ebebeb", background:"#fff", fontSize:"12px", color:value?"#333":"#aaa", cursor:"pointer", outline:"none", fontFamily:"inherit" }}>
      <option value="">{placeholder}</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function ColHeader({ cols, headers }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:cols, gap:"12px", padding:"0 10px 10px", borderBottom:"2px solid #f0f0f0" }}>
      {headers.map((h,i) => <span key={i} style={{ fontSize:"10.5px", fontWeight:600, color:"#bbb", letterSpacing:"0.08em", textTransform:"uppercase" }}>{h}</span>)}
    </div>
  );
}

function EmptyState({ message, sub, icon: Icon }) {
  return (
    <div style={{ textAlign:"center", padding:"64px 0" }}>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:"14px", color:"#ddd" }}>{Icon && <Icon />}</div>
      <p style={{ color:"#bbb", fontSize:"14px", fontWeight:500, margin:"0 0 6px" }}>{message}</p>
      {sub && <p style={{ color:"#ccc", fontSize:"13px", margin:0 }}>{sub}</p>}
    </div>
  );
}

function SkeletonRow({ cols, rows = 4 }) {
  return Array.from({ length: rows }).map((_,i) => (
    <div key={i} style={{ display:"grid", gridTemplateColumns:cols, gap:"12px", padding:"14px 10px", borderBottom:"1px solid #f3f3f3" }}>
      {cols.split(" ").map((_,j) => (
        <div key={j} style={{ height:"14px", borderRadius:"6px", background:"#f0f0f0", animation:"pulse 1.4s ease-in-out infinite", opacity:j>3?0.3:1 }} />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
    </div>
  ));
}

function PrimaryBtn({ onClick, children, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={e=>{if(!disabled)e.currentTarget.style.background="#d4590f";}}
      onMouseLeave={e=>{if(!disabled)e.currentTarget.style.background="#e86c1a";}}
      style={{ background:disabled?"#f0a070":"#e86c1a", color:"#fff", border:"none", borderRadius:"10px", padding:"9px 18px", fontSize:"13px", fontWeight:600, letterSpacing:"0.08em", cursor:disabled?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:"7px", transition:"background 0.15s", whiteSpace:"nowrap" }}>
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ background:"none", border:"1.5px solid #ebebeb", borderRadius:"10px", padding:"7px 14px", fontSize:"12px", color:"#888", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px", transition:"all 0.15s", whiteSpace:"nowrap" }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="#2d3a8c";e.currentTarget.style.color="#2d3a8c";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="#ebebeb";e.currentTarget.style.color="#888";}}>
      {children}
    </button>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ user, onProfileOpen }) {
  const initials = user ? user.fullName.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase() : "SA";
  return (
    <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"22px 80px", position:"relative", zIndex:20 }}>
      <div>
        <span style={{ color:"#fff", fontWeight:700, fontSize:"18px", letterSpacing:"0.12em", userSelect:"none" }}>BU PKMD</span>
        <span style={{ color:"rgba(255,255,255,0.35)", fontSize:"11px", marginLeft:"12px", letterSpacing:"0.08em" }}>ADMIN</span>
      </div>
      <button onClick={onProfileOpen}
        style={{ display:"flex", alignItems:"center", gap:"10px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:"40px", padding:"5px 14px 5px 6px", cursor:"pointer" }}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.18)"}
        onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}>
        <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"#e86c1a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"11px", fontWeight:600 }}>{initials}</div>
        <span style={{ color:"#fff", fontSize:"12px", fontWeight:500 }}>{user ? user.fullName.split(" ")[0] : "Admin"}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function AdminHero({ user, stats, activeTab, setActiveTab }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const pills = [
    { val: stats?.totalDocs     ?? "—", label:"Total documents", Icon: IconDoc,    warn: false },
    { val: stats?.pendingDocs   ?? "—", label:"Pending review",  Icon: IconClock,  warn: false },
    { val: stats?.totalColleges ?? "—", label:"Colleges",        Icon: IconSchool, warn: false },
    { val: stats?.alerts        ?? "—", label:"Security alerts", Icon: IconShield, warn: (stats?.alerts ?? 0) > 0 },
  ];

  return (
    <section style={{ position:"relative", zIndex:10, padding:"0 80px 0" }}>
      <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", display:"block", marginBottom:"10px" }}>
        ADMIN DASHBOARD
      </span>
      <h1 style={{ color:"#fff", fontSize:"clamp(1.6rem, 2.8vw, 2.4rem)", fontWeight:700, lineHeight:1.2, margin:"0 0 6px", letterSpacing:"-0.02em" }}>
        {greeting}, {user ? user.fullName.split(" ")[0] : "—"}.
      </h1>
      <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"13px", margin:"0 0 28px" }}>
        {user ? `${user.role} · ${user.college ?? "All colleges"}` : "—"}
      </p>

      <div style={{ display:"flex", gap:"12px", marginBottom:"36px", flexWrap:"wrap" }}>
        {pills.map(s => (
          <div key={s.label} style={{ background:s.warn?"rgba(232,108,26,0.18)":"rgba(255,255,255,0.1)", border:s.warn?"1px solid rgba(232,108,26,0.5)":"1px solid rgba(255,255,255,0.15)", borderRadius:"12px", padding:"10px 20px", display:"flex", flexDirection:"column" }}>
            <span style={{ color:s.warn?"#e86c1a":"#fff", fontWeight:700, fontSize:"20px", lineHeight:1 }}>{s.val}</span>
            <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", marginTop:"3px" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={()=>setActiveTab(tab)}
            style={{ padding:"11px 22px", borderRadius:"12px 12px 0 0", border:"none", background:activeTab===tab?"#fff":"rgba(255,255,255,0.08)", color:activeTab===tab?"#2d3a8c":"rgba(255,255,255,0.6)", fontWeight:activeTab===tab?600:400, fontSize:"13px", letterSpacing:"0.04em", cursor:"pointer", transition:"all 0.15s" }}>
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Profile panel ─────────────────────────────────────────────────────────────
function ProfilePanel({ open, onClose, onSignOut, user }) {
  const initials = user ? user.fullName.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase() : "SA";
  return (
    <>
      {open && <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:49, background:"rgba(0,0,0,0.3)" }} />}
      <div style={{ position:"fixed", top:0, right:0, bottom:0, zIndex:50, width:"320px", background:"#fff", boxShadow:"-12px 0 48px rgba(0,0,0,0.15)", transform:open?"translateX(0)":"translateX(100%)", transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)", display:"flex", flexDirection:"column", overflowY:"auto" }}>

        <div style={{ background:"#2d3a8c", padding:"28px 28px 24px", position:"relative", flexShrink:0 }}>
          <button onClick={onClose} style={{ position:"absolute", top:"14px", right:"14px", background:"rgba(255,255,255,0.12)", border:"none", color:"#fff", borderRadius:"8px", width:"28px", height:"28px", cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ width:"56px", height:"56px", borderRadius:"50%", background:"#e86c1a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"20px", fontWeight:700, marginBottom:"14px" }}>{initials}</div>
          <h2 style={{ color:"#fff", fontWeight:700, fontSize:"16px", margin:"0 0 2px" }}>{user?.fullName ?? "—"}</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", margin:"0 0 8px" }}>{user?.email ?? "—"}</p>
          {user?.role && <span style={{ background:"rgba(255,255,255,0.15)", color:"#fff", fontSize:"10px", fontWeight:600, letterSpacing:"0.08em", padding:"3px 9px", borderRadius:"20px" }}>{user.role.toUpperCase()}</span>}
        </div>

        <div style={{ padding:"22px 28px", borderBottom:"1px solid #f0f0f0", flexShrink:0 }}>
          <p style={{ fontSize:"10px", fontWeight:600, color:"#bbb", letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 14px" }}>Account Information</p>
          {[
            { label:"Role",             val: user?.role },
            { label:"Assigned college", val: user?.college ?? "All colleges" },
            { label:"Member since",     val: user?.joined },
          ].map(r => (
            <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"12px", padding:"7px 0", borderBottom:"1px solid #f8f8f8" }}>
              <span style={{ color:"#bbb", fontSize:"12px", flexShrink:0 }}>{r.label}</span>
              <span style={{ color:r.val?"#333":"#ddd", fontSize:"12px", fontWeight:500, textAlign:"right" }}>{r.val ?? "—"}</span>
            </div>
          ))}
        </div>

        <div style={{ padding:"22px 28px", borderBottom:"1px solid #f0f0f0", flex:1 }}>
          <p style={{ fontSize:"10px", fontWeight:600, color:"#bbb", letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 12px" }}>Permissions</p>
          {[
            { label:"Upload / edit / delete MFOs", granted: true },
            { label:"Generate reports",            granted: true },
            { label:"Manage user accounts",        granted: user?.role === "Super admin" || user?.role === "admin" },
            { label:"View access logs",            granted: user?.role === "Super admin" || user?.role === "admin" },
          ].map(p => (
            <div key={p.label} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"7px 0", borderBottom:"1px solid #f8f8f8", fontSize:"12px" }}>
              <span style={{ width:"18px", height:"18px", borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:p.granted?"#f0fdf4":"#f4f4f4", color:p.granted?"#166534":"#ccc", fontSize:"10px", fontWeight:700 }}>
                {p.granted ? "✓" : "✕"}
              </span>
              <span style={{ color:p.granted?"#333":"#ccc" }}>{p.label}</span>
            </div>
          ))}
        </div>

        <div style={{ padding:"16px 28px 28px", flexShrink:0 }}>
          <button onClick={onSignOut}
            style={{ width:"100%", padding:"11px", background:"none", border:"1.5px solid #f0f0f0", borderRadius:"10px", color:"#c0392b", fontSize:"13px", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"7px", transition:"all 0.15s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#fff0f0";e.currentTarget.style.borderColor="#fcc";}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.borderColor="#f0f0f0";}}>
            <IconSignOut /> Sign out
          </button>
        </div>
      </div>
    </>
  );
}

// ── Modals ────────────────────────────────────────────────────────────────────
function GenerateReportModal({ onClose, onSuccess }) {
  const [college,  setCollege]  = useState("");
  const [year,     setYear]     = useState("");
  const [quarter,  setQuarter]  = useState("");
  const [category, setCategory] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const canGenerate = year && quarter;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true); setError("");
    try { await generateReport({ college, year, quarter, category }); onSuccess(); onClose(); }
    catch { setError("Failed to generate report. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{ background:"#fff", borderRadius:"20px", padding:"36px 40px", width:"100%", maxWidth:"460px", boxShadow:"0 24px 64px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
          <h2 style={{ color:"#111", fontSize:"1.15rem", fontWeight:600, margin:0 }}>Generate Report</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#bbb", fontSize:"20px", lineHeight:1 }}>✕</button>
        </div>
        <p style={{ color:"#aaa", fontSize:"13px", margin:"0 0 24px" }}>Filter by college, year, quarter, and category to generate a report.</p>
        {error && <div style={{ background:"#fff0f0", border:"1px solid #fcc", borderRadius:"8px", padding:"9px 13px", color:"#c0392b", fontSize:"13px", marginBottom:"14px" }}>{error}</div>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px" }}>
          {[
            { label:"College", val:college, set:setCollege, opts:["College of Engineering","College of Science","College of Nursing","College of Education","College of Business, Economics, and Management","College of Arts and Letters","College of Law","Graduate School"], ph:"All colleges", req:false },
            { label:"Year *",  val:year,    set:setYear,    opts:["2026","2025","2024","2023"], ph:"Select year…", req:true },
            { label:"Quarter *",val:quarter,set:setQuarter, opts:["Q1","Q2","Q3","Q4"], ph:"Select quarter…", req:true },
            { label:"Category", val:category,set:setCategory,opts:["Thesis","Capstone","Research Paper","Feasibility Study"], ph:"All categories", req:false },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize:"10.5px", fontWeight:600, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"4px" }}>{f.label}</label>
              <select value={f.val} onChange={e=>f.set(e.target.value)} style={{ ...inputStyle, color:f.val?"#333":"#aaa" }} onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)}>
                <option value="">{f.ph}</option>
                {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:"10px", marginTop:"12px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"11px", borderRadius:"10px", border:"1.5px solid #ebebeb", background:"#fff", color:"#666", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button disabled={!canGenerate||loading} onClick={handleGenerate}
            onMouseEnter={e=>{if(canGenerate&&!loading)e.currentTarget.style.background="#d4590f";}}
            onMouseLeave={e=>{if(canGenerate&&!loading)e.currentTarget.style.background="#e86c1a";}}
            style={{ flex:2, padding:"11px", borderRadius:"10px", background:canGenerate&&!loading?"#e86c1a":"#f0a070", border:"none", color:"#fff", fontSize:"13px", fontWeight:700, letterSpacing:"0.08em", cursor:canGenerate&&!loading?"pointer":"not-allowed", transition:"background 0.15s" }}>
            {loading ? "GENERATING…" : "GENERATE REPORT"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateStaffModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ fullName:"", email:"", role:"PKMD staff", college:"" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const set = field => e => setForm(p=>({...p,[field]:e.target.value}));
  const canSubmit = form.fullName && form.email && form.role && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true); setError("");
    try { await createStaffAccount(form); onSuccess(); onClose(); }
    catch { setError("Failed to create account. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{ background:"#fff", borderRadius:"20px", padding:"36px 40px", width:"100%", maxWidth:"460px", boxShadow:"0 24px 64px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
          <h2 style={{ color:"#111", fontSize:"1.15rem", fontWeight:600, margin:0 }}>Create Staff Account</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#bbb", fontSize:"20px" }}>✕</button>
        </div>
        <p style={{ color:"#aaa", fontSize:"13px", margin:"0 0 20px" }}>Credentials will be sent to the staff member by email.</p>
        {error && <div style={{ background:"#fff0f0", border:"1px solid #fcc", borderRadius:"8px", padding:"9px 13px", color:"#c0392b", fontSize:"13px", marginBottom:"14px" }}>{error}</div>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px" }}>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:"10.5px", fontWeight:600, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"4px" }}>Full Name *</label>
            <input type="text" placeholder="e.g. Maria Santos" value={form.fullName} onChange={set("fullName")} style={inputStyle} onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)} />
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:"10.5px", fontWeight:600, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"4px" }}>Email Address *</label>
            <input type="email" placeholder="e.g. m.santos@bicol-u.edu.ph" value={form.email} onChange={set("email")} style={inputStyle} onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)} />
          </div>
          <div>
            <label style={{ fontSize:"10.5px", fontWeight:600, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"4px" }}>Role *</label>
            <select value={form.role} onChange={set("role")} style={{ ...inputStyle, color:"#333" }} onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)}>
              <option value="PKMD staff">PKMD staff</option>
              <option value="Super admin">Super admin</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize:"10.5px", fontWeight:600, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"4px" }}>Assigned College</label>
            <select value={form.college} onChange={set("college")} style={{ ...inputStyle, color:form.college?"#333":"#aaa" }} onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)}>
              <option value="">All colleges</option>
              {["College of Engineering","College of Science","College of Nursing","College of Education"].map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ background:"#fff7ed", borderRadius:"8px", padding:"9px 13px", fontSize:"12px", color:"#854f0b", marginBottom:"20px", display:"flex", gap:"8px", alignItems:"flex-start" }}>
          <IconAlert />
          <span>A temporary password will be auto-generated and sent to the email above.</span>
        </div>
        <div style={{ display:"flex", gap:"10px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"11px", borderRadius:"10px", border:"1.5px solid #ebebeb", background:"#fff", color:"#666", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button disabled={!canSubmit} onClick={handleSubmit}
            onMouseEnter={e=>{if(canSubmit)e.currentTarget.style.background="#d4590f";}}
            onMouseLeave={e=>{if(canSubmit)e.currentTarget.style.background="#e86c1a";}}
            style={{ flex:2, padding:"11px", borderRadius:"10px", background:canSubmit?"#e86c1a":"#f0a070", border:"none", color:"#fff", fontSize:"13px", fontWeight:700, letterSpacing:"0.08em", cursor:canSubmit?"pointer":"not-allowed", transition:"background 0.15s" }}>
            {loading ? "CREATING…" : "CREATE ACCOUNT"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tab panels ────────────────────────────────────────────────────────────────
function OverviewPanel({ stats, docs, reports, logs }) {
  const f0 = useFadeUp(0);
  const f1 = useFadeUp(0.07);
  const f2 = useFadeUp(0.12);
  const recentDocs    = docs.slice(0,5);
  const recentReports = reports.slice(0,3);
  const recentAlerts  = logs.filter(l=>l.isAlert).slice(0,4);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
      <div ref={f0.ref} style={{ ...f0.style, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
        {[
          { label:"Total MFO documents", val:stats?.totalDocs??  "—", Icon:IconDoc,    color:"#2d3a8c", warn:false },
          { label:"Pending review",      val:stats?.pendingDocs??"—", Icon:IconClock,  color:"#854f0b", warn:false },
          { label:"Colleges enrolled",   val:stats?.totalColleges??"—",Icon:IconSchool,color:"#166534", warn:false },
          { label:"Security alerts",     val:stats?.alerts??      "—", Icon:IconShield, color:"#b91c1c", warn:(stats?.alerts??0)>0 },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", border:s.warn?"1.5px solid #fcc":"1.5px solid #f0f0f0", borderRadius:"14px", padding:"18px 20px" }}>
            <div style={{ color:s.color, marginBottom:"8px" }}><s.Icon /></div>
            <div style={{ color:s.color, fontWeight:700, fontSize:"24px", lineHeight:1 }}>{s.val}</div>
            <div style={{ color:"#aaa", fontSize:"12px", marginTop:"4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div ref={f1.ref} style={{ ...f1.style, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
        <div style={{ background:"#fff", border:"1.5px solid #f0f0f0", borderRadius:"14px", padding:"20px 22px" }}>
          <p style={{ fontSize:"10.5px", fontWeight:600, color:"#bbb", letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 14px" }}>Recent submissions</p>
          {recentDocs.length === 0
            ? <p style={{ color:"#ccc", fontSize:"13px", textAlign:"center", padding:"24px 0" }}>No documents yet.</p>
            : recentDocs.map(doc => {
                const col = CAT_STYLE[doc.category]||CAT_STYLE["Thesis"];
                const sts = STATUS_STYLE[doc.status]||STATUS_STYLE["Pending"];
                return (
                  <div key={doc.id} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 0", borderBottom:"1px solid #f5f5f5" }}>
                    <div style={{ width:"28px", height:"32px", borderRadius:"5px", background:col.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:col.text }}><IconDoc /></div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ color:"#111", fontSize:"12px", fontWeight:500, margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{doc.title}</p>
                      <span style={{ color:"#ccc", fontSize:"11px" }}>{doc.college}</span>
                    </div>
                    <span style={{ background:sts.bg, color:sts.text, fontSize:"10px", fontWeight:600, padding:"2px 7px", borderRadius:"20px", flexShrink:0 }}>{doc.status}</span>
                  </div>
                );
              })
          }
        </div>
        <div style={{ background:"#fff", border:recentAlerts.length>0?"1.5px solid #fcc":"1.5px solid #f0f0f0", borderRadius:"14px", padding:"20px 22px" }}>
          <p style={{ fontSize:"10.5px", fontWeight:600, color:recentAlerts.length>0?"#c0392b":"#bbb", letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 14px" }}>Security alerts</p>
          {recentAlerts.length === 0
            ? <div style={{ textAlign:"center", padding:"24px 0" }}><p style={{ color:"#ccc", fontSize:"13px", margin:0 }}>No alerts at this time.</p></div>
            : recentAlerts.map((log,i) => (
                <div key={i} style={{ display:"flex", gap:"10px", padding:"8px 0", borderBottom:"1px solid #f5f5f5", fontSize:"12px" }}>
                  <span style={{ color:"#c0392b", flexShrink:0 }}><IconAlert /></span>
                  <div>
                    <p style={{ color:"#333", fontWeight:500, margin:"0 0 2px" }}>{log.action}</p>
                    <span style={{ color:"#bbb", fontSize:"11px" }}>{log.user} · {log.timestamp}</span>
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      <div ref={f2.ref} style={{ ...f2.style, background:"#fff", border:"1.5px solid #f0f0f0", borderRadius:"14px", padding:"20px 22px" }}>
        <p style={{ fontSize:"10.5px", fontWeight:600, color:"#bbb", letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 14px" }}>Recent reports</p>
        {recentReports.length === 0
          ? <p style={{ color:"#ccc", fontSize:"13px", textAlign:"center", padding:"16px 0" }}>No reports generated yet.</p>
          : recentReports.map(r => (
              <div key={r.id} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"9px 0", borderBottom:"1px solid #f5f5f5", fontSize:"12px" }}>
                <span style={{ color:"#2d3a8c" }}><IconChart /></span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ color:"#111", fontWeight:500, fontSize:"13px", margin:"0 0 2px" }}>{r.title}</p>
                  <span style={{ color:"#bbb", fontSize:"11px" }}>{r.filters} · {r.generatedAt}</span>
                </div>
                <GhostBtn onClick={()=>{}}><IconDownload /> Export</GhostBtn>
              </div>
            ))
        }
      </div>
    </div>
  );
}

function DocumentsPanel({ docs, loading, onRefetch }) {
  const [search,   setSearch]   = useState("");
  const [college,  setCollege]  = useState("");
  const [category, setCategory] = useState("");
  const [status,   setStatus]   = useState("");
  const [actionDoc,setActionDoc]= useState(null);

  const filtered = docs.filter(d => {
    const q = search.toLowerCase();
    return (!search||d.title?.toLowerCase().includes(q)||d.id?.toLowerCase().includes(q))
      &&(!college||d.college===college)&&(!category||d.category===category)&&(!status||d.status===status);
  });

  const COL = "2fr 1fr 1fr 100px 80px 80px 80px";

  const handleAction = async (action, id) => {
    if (action==="approve") await approveDocument(id);
    if (action==="reject")  await rejectDocument(id);
    if (action==="delete")  await deleteDocument(id);
    onRefetch(); setActionDoc(null);
  };

  return (
    <div>
      <div style={{ display:"flex", gap:"10px", marginBottom:"18px", flexWrap:"wrap", alignItems:"center" }}>
        <SearchBox value={search} onChange={setSearch} placeholder="Search title or ID…" />
        <FilterSelect value={college}  onChange={setCollege}  placeholder="All colleges"   options={["College of Engineering","College of Science","College of Nursing","College of Education","College of Business, Economics, and Management","College of Arts and Letters","College of Law","Graduate School"]} />
        <FilterSelect value={category} onChange={setCategory} placeholder="All categories" options={["Thesis","Capstone","Research Paper","Feasibility Study"]} />
        <FilterSelect value={status}   onChange={setStatus}   placeholder="All statuses"   options={["Approved","Pending","Rejected"]} />
      </div>
      <ColHeader cols={COL} headers={["Document","College","Category","Date","Size","Status",""]} />
      {loading ? <SkeletonRow cols={COL} /> : filtered.length===0 ? <EmptyState icon={IconDoc} message="No documents found." sub="Try adjusting your filters." /> : filtered.map(doc => {
        const col = CAT_STYLE[doc.category]||CAT_STYLE["Thesis"];
        const sts = STATUS_STYLE[doc.status]||STATUS_STYLE["Pending"];
        return (
          <div key={doc.id} style={{ display:"grid", gridTemplateColumns:COL, alignItems:"center", gap:"12px", padding:"12px 10px", borderBottom:"1px solid #f3f3f3", borderRadius:"8px" }}>
            <div style={{ minWidth:0 }}>
              <p style={{ color:"#111", fontWeight:500, fontSize:"13px", margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{doc.title}</p>
              <span style={{ color:"#ccc", fontSize:"11px" }}>{doc.id}</span>
            </div>
            <span style={{ color:"#666", fontSize:"12px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{doc.college}</span>
            <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", background:col.bg, color:col.text, fontSize:"10px", fontWeight:600, padding:"3px 9px", borderRadius:"20px", whiteSpace:"nowrap", width:"fit-content" }}>
              <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:col.dot }} />{doc.category}
            </span>
            <span style={{ color:"#bbb", fontSize:"12px" }}>{doc.uploadedAt?new Date(doc.uploadedAt).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"}):"—"}</span>
            <span style={{ color:"#bbb", fontSize:"12px" }}>{doc.fileSize??"—"}</span>
            <span style={{ background:sts.bg, color:sts.text, fontSize:"10px", fontWeight:600, padding:"3px 9px", borderRadius:"20px", width:"fit-content" }}>{doc.status}</span>
            <div style={{ position:"relative" }}>
              <GhostBtn onClick={()=>setActionDoc(actionDoc===doc.id?null:doc.id)}>Actions ▾</GhostBtn>
              {actionDoc===doc.id && (
                <div style={{ position:"absolute", right:0, top:"calc(100% + 4px)", background:"#fff", border:"1px solid #ebebeb", borderRadius:"10px", boxShadow:"0 8px 24px rgba(0,0,0,0.1)", zIndex:10, minWidth:"140px", overflow:"hidden" }}>
                  {[{action:"approve",label:"Approve",Icon:IconCheck},{action:"reject",label:"Reject",Icon:IconX},{action:"delete",label:"Delete",Icon:IconTrash,danger:true}].map(a => (
                    <button key={a.action} onClick={()=>handleAction(a.action,doc.id)}
                      style={{ display:"flex", alignItems:"center", gap:"8px", width:"100%", padding:"9px 14px", background:"none", border:"none", textAlign:"left", fontSize:"13px", cursor:"pointer", color:a.danger?"#c0392b":"#333" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#f8f8f8"}
                      onMouseLeave={e=>e.currentTarget.style.background="none"}>
                      <a.Icon /> {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReportsPanel({ reports, loading, onGenerate, onRefetch }) {
  const [college, setCollege] = useState("");
  const [year,    setYear]    = useState("");
  const [quarter, setQuarter] = useState("");
  const [category,setCategory]= useState("");
  const filtered = reports.filter(r=>(!college||r.college===college)&&(!year||r.year===year)&&(!quarter||r.quarter===quarter)&&(!category||r.category===category));
  const COL = "2fr 1fr 1fr 1fr 100px 80px";
  return (
    <div>
      <div style={{ display:"flex", gap:"10px", marginBottom:"18px", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          <FilterSelect value={college}  onChange={setCollege}  placeholder="All colleges"  options={["College of Engineering","College of Science","College of Nursing","College of Education"]} />
          <FilterSelect value={year}     onChange={setYear}     placeholder="Year"           options={["2026","2025","2024","2023"]} />
          <FilterSelect value={quarter}  onChange={setQuarter}  placeholder="Quarter"        options={["Q1","Q2","Q3","Q4"]} />
          <FilterSelect value={category} onChange={setCategory} placeholder="All categories" options={["Thesis","Capstone","Research Paper","Feasibility Study"]} />
        </div>
        <PrimaryBtn onClick={onGenerate}><IconPlus /> Generate report</PrimaryBtn>
      </div>
      <ColHeader cols={COL} headers={["Report","College","Year","Quarter","Category",""]} />
      {loading ? <SkeletonRow cols={COL} /> : filtered.length===0 ? <EmptyState icon={IconChart} message="No reports yet." sub="Use Generate report to create your first one." /> : filtered.map(r => (
        <div key={r.id} style={{ display:"grid", gridTemplateColumns:COL, alignItems:"center", gap:"12px", padding:"12px 10px", borderBottom:"1px solid #f3f3f3" }}>
          <div style={{ minWidth:0 }}>
            <p style={{ color:"#111", fontWeight:500, fontSize:"13px", margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.title}</p>
            <span style={{ color:"#ccc", fontSize:"11px" }}>Generated {r.generatedAt}</span>
          </div>
          <span style={{ color:"#666", fontSize:"12px" }}>{r.college??"All"}</span>
          <span style={{ color:"#666", fontSize:"12px" }}>{r.year}</span>
          <span style={{ color:"#666", fontSize:"12px" }}>{r.quarter}</span>
          <span style={{ color:"#666", fontSize:"12px" }}>{r.category??"All"}</span>
          <GhostBtn onClick={()=>{}}><IconDownload /> Export</GhostBtn>
        </div>
      ))}
    </div>
  );
}

function UsersPanel({ users, loading, onCreateStaff, onRefetch }) {
  const [search, setSearch] = useState("");
  const [role,   setRole]   = useState("");
  const filtered = users.filter(u=>(!search||u.fullName?.toLowerCase().includes(search.toLowerCase())||u.email?.toLowerCase().includes(search.toLowerCase()))&&(!role||u.role===role));
  const COL = "2fr 1.5fr 1fr 1fr 80px 80px";
  return (
    <div>
      <div style={{ display:"flex", gap:"10px", marginBottom:"18px", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          <SearchBox value={search} onChange={setSearch} placeholder="Search name or email…" />
          <FilterSelect value={role} onChange={setRole} placeholder="All roles" options={["Super admin","PKMD staff","Student","admin","student"]} />
        </div>
        <PrimaryBtn onClick={onCreateStaff}><IconUserPlus /> Add staff</PrimaryBtn>
      </div>
      <ColHeader cols={COL} headers={["Name","Email","Role","College","Status",""]} />
      {loading ? <SkeletonRow cols={COL} /> : filtered.length===0 ? <EmptyState icon={IconUser} message="No users found." sub="Try adjusting your search." /> : filtered.map(u => {
        const rs = ROLE_STYLE[u.role]||ROLE_STYLE["Student"];
        return (
          <div key={u.id} style={{ display:"grid", gridTemplateColumns:COL, alignItems:"center", gap:"12px", padding:"12px 10px", borderBottom:"1px solid #f3f3f3" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", minWidth:0 }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"#e86c1a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"10px", fontWeight:600, flexShrink:0 }}>
                {u.fullName?.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()??"?"}
              </div>
              <span style={{ color:"#111", fontWeight:500, fontSize:"13px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{u.fullName??"—"}</span>
            </div>
            <span style={{ color:"#666", fontSize:"12px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{u.email??"—"}</span>
            <span style={{ background:rs.bg, color:rs.text, fontSize:"10px", fontWeight:600, padding:"3px 9px", borderRadius:"20px", width:"fit-content" }}>{u.role}</span>
            <span style={{ color:"#aaa", fontSize:"12px" }}>{u.college??"All"}</span>
            <span style={{ background:u.active!==false?"#f0fdf4":"#f5f5f5", color:u.active!==false?"#166534":"#aaa", fontSize:"10px", fontWeight:600, padding:"3px 9px", borderRadius:"20px", width:"fit-content" }}>
              {u.active!==false?"Active":"Inactive"}
            </span>
            <GhostBtn onClick={()=>{}}>Manage</GhostBtn>
          </div>
        );
      })}
    </div>
  );
}

function AccessLogsPanel({ logs, loading }) {
  const [search, setSearch] = useState("");
  const filtered = logs.filter(l=>!search||l.user?.toLowerCase().includes(search.toLowerCase())||l.action?.toLowerCase().includes(search.toLowerCase()));
  const COL = "2fr 2fr 1fr 130px 80px";
  return (
    <div>
      <div style={{ display:"flex", gap:"10px", marginBottom:"18px", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" }}>
        <SearchBox value={search} onChange={setSearch} placeholder="Search user or action…" />
        <div style={{ background:"#fff0f0", border:"1px solid #fcc", borderRadius:"8px", padding:"7px 14px", fontSize:"12px", color:"#c0392b", display:"flex", alignItems:"center", gap:"7px" }}>
          <IconLock /> All document access, edits, and downloads are logged here.
        </div>
      </div>
      <ColHeader cols={COL} headers={["User","Action","Document ID","Timestamp","Type"]} />
      {loading ? <SkeletonRow cols={COL} /> : filtered.length===0 ? <EmptyState icon={IconLock} message="No access logs yet." sub="Logs will appear here once users start interacting with documents." /> : filtered.map((log,i) => (
        <div key={i} style={{ display:"grid", gridTemplateColumns:COL, alignItems:"center", gap:"12px", padding:"12px 10px", borderBottom:"1px solid #f3f3f3" }}>
          <span style={{ color:"#333", fontSize:"13px", fontWeight:500 }}>{log.user}</span>
          <span style={{ color:"#666", fontSize:"12px" }}>{log.action}</span>
          <span style={{ color:"#bbb", fontSize:"12px" }}>{log.docId??"—"}</span>
          <span style={{ color:"#bbb", fontSize:"12px" }}>{log.timestamp}</span>
          <span style={{ background:log.isAlert?"#fff0f0":"#f0fdf4", color:log.isAlert?"#c0392b":"#166634", fontSize:"10px", fontWeight:600, padding:"3px 9px", borderRadius:"20px", width:"fit-content" }}>
            {log.isAlert?"Alert":"Normal"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main content ──────────────────────────────────────────────────────────────
function DashboardContent({ activeTab, docs, docsLoading, docsRefetch, reports, reportsLoading, reportsRefetch, users, usersLoading, usersRefetch, logs, logsLoading, stats, onGenerateReport, onCreateStaff }) {
  const cardRef = useRef(null);
  const [entry, setEntry] = useState({ opacity:0, transform:"translateY(48px)" });
  useEffect(() => {
    const onScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const winH = window.innerHeight;
      const prog  = Math.min(Math.max((winH-rect.top)/(winH*0.35),0),1);
      const eased = 1-Math.pow(1-prog,3);
      setEntry({ opacity:eased, transform:`translateY(${48*(1-eased)}px)` });
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={cardRef} style={{ ...entry, background:"#f8f9fc", borderRadius:"0 2rem 0 0", position:"relative", zIndex:10, willChange:"transform, opacity", minHeight:"60vh" }}>
      <div style={{ padding:"40px 80px 64px" }}>
        {activeTab==="Overview"    && <OverviewPanel stats={stats} docs={docs} reports={reports} logs={logs} />}
        {activeTab==="Documents"   && <DocumentsPanel docs={docs} loading={docsLoading} onRefetch={docsRefetch} />}
        {activeTab==="Reports"     && <ReportsPanel reports={reports} loading={reportsLoading} onGenerate={onGenerateReport} onRefetch={reportsRefetch} />}
        {activeTab==="Users"       && <UsersPanel users={users} loading={usersLoading} onCreateStaff={onCreateStaff} onRefetch={usersRefetch} />}
        {activeTab==="Access Logs" && <AccessLogsPanel logs={logs} loading={logsLoading} />}
      </div>
      <hr style={{ border:"none", borderTop:"1px solid #eaeaea", margin:0 }} />
      <footer style={{ padding:"18px 80px" }}>
        <p style={{ color:"#ccc", fontSize:"13px", margin:0 }}>This website is a student project and is intended for academic purposes only.</p>
      </footer>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab,   setActiveTab]   = useState("Overview");
  const [profileOpen, setProfileOpen] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [staffModal,  setStaffModal]  = useState(false);

  const { user }                                                          = useAdminUser();
  const { docs,    loading:docsLoading,    refetch:docsRefetch    }       = useDocuments();
  const { reports, loading:reportsLoading, refetch:reportsRefetch }       = useReports();
  const { users,   loading:usersLoading,   refetch:usersRefetch   }       = useUsers();
  const { logs,    loading:logsLoading }                                  = useAccessLogs();
  const { stats }                                                         = useStats();

  const handleSignOut = async () => { await signOut(); navigate("/signin"); };

  return (
    <div style={{ display:"flex", flexDirection:"column", backgroundColor:"#2d3a8c", minHeight:"100vh" }}>
      <div style={{ display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
        <img src={BgSVG} aria-hidden="true" style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", pointerEvents:"none", userSelect:"none", zIndex:0 }} />
        <Navbar user={user} onProfileOpen={()=>setProfileOpen(true)} />
        <AdminHero user={user} stats={stats} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <DashboardContent
        activeTab={activeTab}
        docs={docs}       docsLoading={docsLoading}       docsRefetch={docsRefetch}
        reports={reports} reportsLoading={reportsLoading} reportsRefetch={reportsRefetch}
        users={users}     usersLoading={usersLoading}     usersRefetch={usersRefetch}
        logs={logs}       logsLoading={logsLoading}
        stats={stats}
        onGenerateReport={()=>setReportModal(true)}
        onCreateStaff={()=>setStaffModal(true)}
      />

      <ProfilePanel open={profileOpen} onClose={()=>setProfileOpen(false)} onSignOut={handleSignOut} user={user} />

      {reportModal && <GenerateReportModal onClose={()=>setReportModal(false)} onSuccess={()=>reportsRefetch()} />}
      {staffModal  && <CreateStaffModal   onClose={()=>setStaffModal(false)}  onSuccess={()=>usersRefetch()}   />}
    </div>
  );
}