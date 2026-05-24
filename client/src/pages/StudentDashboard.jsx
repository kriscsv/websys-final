import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BgSVG from "../assets/bg-01.svg";

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

//read user from localStorage (set during sign in)
function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({
          fullName: parsed.fullName || parsed.full_name || "—",
          email:    parsed.email    || "—",
          role:     parsed.role     || "student",
          college:  parsed.college  || "—",
          course:   parsed.course   || parsed.department || "—",
          year:     parsed.year     || "—",
          bloc:     parsed.bloc     || "—",
          joined:   parsed.joined   || "—",
        });
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  return { user, loading: false, error: null };
}

//fetch student's own documents
function useMyDocuments() {
  const [docs,    setDocs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch_ = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/documents/mine", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { setDocs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setDocs([]); setLoading(false); });
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);
  return { docs, loading, error, refetch: fetch_ };
}

//fetch all library documents
function useLibrary() {
  const [docs,    setDocs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/documents", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { setDocs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setDocs([]); setLoading(false); });
  }, []);

  return { docs, loading, error };
}

//Upload document
async function uploadDocument(formData) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/documents", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

//Sign out
async function signOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}

//constants
const CATEGORIES = ["All", "Thesis", "Capstone", "Research Paper", "Feasibility Study"];

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

const inputStyle = {
  width:"100%", boxSizing:"border-box",
  padding:"9px 12px",
  background:"#f4f4f4", border:"1.5px solid #f4f4f4",
  borderRadius:"10px", fontSize:"13px", color:"#333",
  outline:"none", transition:"border-color 0.15s",
  fontFamily:"inherit",
};
const focusStyle = { borderColor:"#2d3a8c", background:"#fff" };
const blurStyle  = { borderColor:"#f4f4f4",  background:"#f4f4f4" };

//icons
const UploadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const FileIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);

//empty state
function EmptyState({ message, sub }) {
  return (
    <div style={{ textAlign:"center", padding:"72px 0" }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" style={{ marginBottom:"14px" }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="11" y2="17"/>
      </svg>
      <p style={{ color:"#bbb", fontSize:"14px", fontWeight:500, margin:"0 0 6px" }}>{message}</p>
      {sub && <p style={{ color:"#ccc", fontSize:"13px", margin:0 }}>{sub}</p>}
    </div>
  );
}

//skeleton row
function SkeletonRow({ cols }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:cols, gap:"12px", padding:"14px 10px", borderBottom:"1px solid #f3f3f3" }}>
      {[1,2,3,4,5,6].map(i => (
        <div key={i} style={{ height:"14px", borderRadius:"6px", background:"#f0f0f0", animation:"pulse 1.4s ease-in-out infinite", opacity:i>4?0.4:1 }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
    </div>
  );
}

//navbar
function Navbar({ user, onProfileOpen }) {
  const initials = user ? user.fullName.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase() : "?";
  const displayName = user ? user.fullName.split(" ")[0] : "—";

  return (
    <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"22px 80px", position:"relative", zIndex:20 }}>
      <span style={{ color:"#fff", fontWeight:700, fontSize:"18px", letterSpacing:"0.12em", userSelect:"none" }}>
        BU PKMD
      </span>
      <button
        onClick={onProfileOpen}
        style={{ display:"flex", alignItems:"center", gap:"10px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:"40px", padding:"5px 14px 5px 6px", cursor:"pointer" }}
        onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.18)"}
        onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
      >
        <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"#e86c1a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"11px", fontWeight:600 }}>
          {initials}
        </div>
        <span style={{ color:"#fff", fontSize:"12px", fontWeight:500 }}>{displayName}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
    </nav>
  );
}

//hero
function DashboardHero({ user, myDocs, activeTab, setActiveTab }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user ? user.fullName.split(" ")[0] : "—";
  const approved = myDocs.filter(d => d.status === "Approved").length;
  const pending  = myDocs.filter(d => d.status === "Pending").length;

  return (
    <section style={{ position:"relative", zIndex:10, padding:"0 80px 0" }}>
      <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", display:"block", marginBottom:"10px" }}>
        STUDENT DASHBOARD
      </span>
      <h1 style={{ color:"#fff", fontSize:"clamp(1.6rem, 2.8vw, 2.4rem)", fontWeight:700, lineHeight:1.2, margin:"0 0 6px", letterSpacing:"-0.02em" }}>
        {greeting}, {firstName}.
      </h1>
      <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"13px", margin:"0 0 28px", lineHeight:1.7 }}>
        {user
          ? `${user.college} · ${user.course} · ${user.year} · Bloc ${user.bloc}`
          : <span style={{ background:"rgba(255,255,255,0.08)", borderRadius:"4px", padding:"0 8px" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        }
      </p>

      <div style={{ display:"flex", gap:"12px", marginBottom:"36px", flexWrap:"wrap" }}>
        {[
          { val: myDocs.length, label:"My uploads" },
          { val: approved,      label:"Approved"   },
          { val: pending,       label:"Pending"    },
        ].map(s => (
          <div key={s.label} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"12px", padding:"10px 20px", display:"flex", flexDirection:"column" }}>
            <span style={{ color:"#fff", fontWeight:700, fontSize:"20px", lineHeight:1 }}>{s.val}</span>
            <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px", marginTop:"3px" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:"4px" }}>
        {["My Documents", "Browse Library"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding:"11px 24px", borderRadius:"12px 12px 0 0", border:"none", background: activeTab===tab ? "#fff" : "rgba(255,255,255,0.08)", color: activeTab===tab ? "#2d3a8c" : "rgba(255,255,255,0.6)", fontWeight: activeTab===tab ? 600 : 400, fontSize:"13px", letterSpacing:"0.04em", cursor:"pointer", transition:"all 0.15s" }}>
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
}

//document row
function DocRow({ doc, showUploader, index }) {
  const [hovered, setHovered] = useState(false);
  const col = CAT_STYLE[doc.category]  || CAT_STYLE["Thesis"];
  const sts = STATUS_STYLE[doc.status] || STATUS_STYLE["Pending"];
  const fade = useFadeUp(index * 0.04);

  return (
    <div ref={fade.ref} style={{ ...fade.style, display:"grid", gridTemplateColumns: showUploader ? "2fr 1fr 1fr 110px 70px 70px" : "2fr 1fr 110px 70px 80px 60px", alignItems:"center", gap:"12px", padding:"13px 10px", borderBottom:"1px solid #f3f3f3", cursor:"pointer", borderRadius:"8px", background: hovered ? "#fafafa" : "transparent", transition:"background 0.12s" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ minWidth:0 }}>
        <p style={{ color:"#111", fontWeight:500, fontSize:"13px", margin:"0 0 3px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{doc.title}</p>
        <span style={{ color:"#ccc", fontSize:"11px" }}>{doc.id}</span>
      </div>
      {showUploader && <span style={{ color:"#666", fontSize:"12px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{doc.uploaderName}</span>}
      <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", background:col.bg, color:col.text, fontSize:"10px", fontWeight:600, letterSpacing:"0.05em", padding:"3px 9px", borderRadius:"20px", whiteSpace:"nowrap", width:"fit-content" }}>
        <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:col.dot, flexShrink:0 }} />{doc.category}
      </span>
      <span style={{ color:"#bbb", fontSize:"12px" }}>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"}) : "—"}</span>
      <span style={{ color:"#bbb", fontSize:"12px" }}>{doc.fileSize || "—"}</span>
      {!showUploader
        ? <span style={{ background:sts.bg, color:sts.text, fontSize:"10px", fontWeight:600, padding:"3px 9px", borderRadius:"20px", whiteSpace:"nowrap", width:"fit-content" }}>{doc.status}</span>
        : <span style={{ color: hovered ? "#2d3a8c" : "#ddd", fontWeight:700, fontSize:"12px", transition:"color 0.15s", whiteSpace:"nowrap" }}>VIEW →</span>
      }
    </div>
  );
}
//Upload modal
function UploadModal({ onClose, onSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [file,     setFile]     = useState(null);
  const [category, setCategory] = useState("");
  const [title,    setTitle]    = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef(null);

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); };

  const handleSubmit = async () => {
    if (!file || !title.trim() || !category) return;
    setSubmitting(true); setSubmitError("");
    try {
      const fd = new FormData();
      fd.append("file", file); fd.append("title", title.trim()); fd.append("category", category);
      await uploadDocument(fd);
      onSuccess(); onClose();
    } catch { setSubmitError("Upload failed. Please try again."); }
    finally { setSubmitting(false); }
  };

  const canSubmit = file && title.trim() && category && !submitting;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff", borderRadius:"20px", padding:"36px 40px", width:"100%", maxWidth:"480px", boxShadow:"0 24px 64px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
          <h2 style={{ color:"#111", fontSize:"1.15rem", fontWeight:600, margin:0 }}>Upload MFO Document</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#bbb", fontSize:"20px", lineHeight:1 }}>✕</button>
        </div>
        <p style={{ color:"#aaa", fontSize:"13px", margin:"0 0 24px" }}>Your document will be reviewed by PKMD staff before it appears in the library.</p>

        {submitError && <div style={{ background:"#fff0f0", border:"1px solid #fcc", borderRadius:"8px", padding:"9px 13px", color:"#c0392b", fontSize:"13px", marginBottom:"14px" }}>{submitError}</div>}

        <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={handleDrop} onClick={()=>fileRef.current.click()}
          style={{ border: dragging?"2px dashed #2d3a8c":file?"2px dashed #22c55e":"2px dashed #e0e0e0", borderRadius:"14px", padding:"32px", textAlign:"center", cursor:"pointer", background: dragging?"#eef2ff":file?"#f0fdf4":"#fafafa", transition:"all 0.15s", marginBottom:"16px" }}>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display:"none" }} onChange={e=>setFile(e.target.files[0])} />
          {file ? (
            <><p style={{ color:"#166534", fontWeight:600, fontSize:"13px", margin:"0 0 4px" }}>✓ {file.name}</p><p style={{ color:"#aaa", fontSize:"12px", margin:0 }}>Click to replace</p></>
          ) : (
            <><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" style={{ marginBottom:"8px" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p style={{ color:"#aaa", fontSize:"13px", margin:0 }}>Drag & drop or <span style={{ color:"#2d3a8c", fontWeight:600 }}>browse</span></p>
            <p style={{ color:"#bbb", fontSize:"11px", margin:"4px 0 0" }}>PDF, DOC, DOCX · max 20 MB</p></>
          )}
        </div>

        <div style={{ marginBottom:"12px" }}>
          <label style={{ fontSize:"10.5px", fontWeight:600, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"4px" }}>Document Title *</label>
          <input type="text" placeholder="e.g. Smart Irrigation System Using IoT" value={title} onChange={e=>setTitle(e.target.value)} style={inputStyle} onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)} />
        </div>
        <div style={{ marginBottom:"24px" }}>
          <label style={{ fontSize:"10.5px", fontWeight:600, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase", display:"block", marginBottom:"4px" }}>Document Category *</label>
          <select value={category} onChange={e=>setCategory(e.target.value)} style={{ ...inputStyle, color:category?"#333":"#aaa" }} onFocus={e=>Object.assign(e.target.style,focusStyle)} onBlur={e=>Object.assign(e.target.style,blurStyle)}>
            <option value="" disabled>Select category…</option>
            {["Thesis","Capstone","Research Paper","Feasibility Study"].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display:"flex", gap:"10px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"11px", borderRadius:"10px", border:"1.5px solid #ebebeb", background:"#fff", color:"#666", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button disabled={!canSubmit} onClick={handleSubmit}
            onMouseEnter={e=>{if(canSubmit)e.currentTarget.style.background="#d4590f";}}
            onMouseLeave={e=>{if(canSubmit)e.currentTarget.style.background="#e86c1a";}}
            style={{ flex:2, padding:"11px", borderRadius:"10px", background:canSubmit?"#e86c1a":"#f0a070", border:"none", color:"#fff", fontSize:"13px", fontWeight:700, letterSpacing:"0.08em", cursor:canSubmit?"pointer":"not-allowed", transition:"background 0.15s" }}>
            {submitting ? "UPLOADING…" : "SUBMIT DOCUMENT"}
          </button>
        </div>
      </div>
    </div>
  );
}

//profile panel
function ProfilePanel({ open, onClose, onUpload, onSignOut, user, myDocs }) {
  const initials = user ? user.fullName.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase() : "?";
  const approved = myDocs.filter(d=>d.status==="Approved").length;
  const pending  = myDocs.filter(d=>d.status==="Pending").length;

  return (
    <>
      {open && <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:49, background:"rgba(0,0,0,0.3)" }} />}
      <div style={{ position:"fixed", top:0, right:0, bottom:0, zIndex:50, width:"340px", background:"#fff", boxShadow:"-12px 0 48px rgba(0,0,0,0.15)", transform:open?"translateX(0)":"translateX(100%)", transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)", display:"flex", flexDirection:"column", overflowY:"auto" }}>

        <div style={{ background:"#2d3a8c", padding:"28px 28px 24px", position:"relative", flexShrink:0 }}>
          <button onClick={onClose} style={{ position:"absolute", top:"14px", right:"14px", background:"rgba(255,255,255,0.12)", border:"none", color:"#fff", borderRadius:"8px", width:"28px", height:"28px", cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ width:"56px", height:"56px", borderRadius:"50%", background:"#e86c1a", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"20px", fontWeight:700, marginBottom:"14px" }}>{initials}</div>
          <h2 style={{ color:"#fff", fontWeight:700, fontSize:"16px", margin:"0 0 4px" }}>{user ? user.fullName : "—"}</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", margin:0 }}>{user ? user.email : "—"}</p>
        </div>

        <div style={{ padding:"22px 28px", borderBottom:"1px solid #f0f0f0", flexShrink:0 }}>
          <p style={{ fontSize:"10px", fontWeight:600, color:"#bbb", letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 14px" }}>Student Information</p>
          {[
            { label:"College",      val: user?.college },
            { label:"Course",       val: user?.course  },
            { label:"Year",         val: user?.year    },
            { label:"Bloc",         val: user?.bloc    },
            { label:"Member since", val: user?.joined  },
          ].map(r => (
            <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"12px", padding:"7px 0", borderBottom:"1px solid #f8f8f8" }}>
              <span style={{ color:"#bbb", fontSize:"12px", flexShrink:0 }}>{r.label}</span>
              <span style={{ color:r.val?"#333":"#ddd", fontSize:"12px", fontWeight:500, textAlign:"right" }}>{r.val || "—"}</span>
            </div>
          ))}
        </div>

        <div style={{ padding:"22px 28px", borderBottom:"1px solid #f0f0f0", flexShrink:0 }}>
          <p style={{ fontSize:"10px", fontWeight:600, color:"#bbb", letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 12px" }}>My MFO Documents</p>
          <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
            {[{val:myDocs.length,label:"Total",color:"#2d3a8c"},{val:approved,label:"Approved",color:"#166534"},{val:pending,label:"Pending",color:"#854f0b"}].map(s=>(
              <div key={s.label} style={{ flex:1, background:"#f8f8f8", borderRadius:"10px", padding:"10px 8px", textAlign:"center" }}>
                <div style={{ color:s.color, fontWeight:700, fontSize:"18px", lineHeight:1 }}>{s.val}</div>
                <div style={{ color:"#aaa", fontSize:"10px", marginTop:"3px" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>{onClose();onUpload();}} onMouseEnter={e=>e.currentTarget.style.background="#d4590f"} onMouseLeave={e=>e.currentTarget.style.background="#e86c1a"}
            style={{ width:"100%", padding:"11px", background:"#e86c1a", color:"#fff", border:"none", borderRadius:"10px", fontSize:"13px", fontWeight:700, letterSpacing:"0.1em", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", transition:"background 0.15s" }}>
            <UploadIcon /> UPLOAD DOCUMENT
          </button>
        </div>

        <div style={{ padding:"22px 28px", flex:1 }}>
          <p style={{ fontSize:"10px", fontWeight:600, color:"#bbb", letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 12px" }}>Recent uploads</p>
          {myDocs.length === 0
            ? <p style={{ color:"#ccc", fontSize:"13px", textAlign:"center", padding:"20px 0" }}>No documents yet.</p>
            : myDocs.slice(0,4).map(doc => {
                const col = CAT_STYLE[doc.category] || CAT_STYLE["Thesis"];
                const sts = STATUS_STYLE[doc.status] || STATUS_STYLE["Pending"];
                return (
                  <div key={doc.id} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 0", borderBottom:"1px solid #f5f5f5" }}>
                    <div style={{ width:"32px", height:"36px", borderRadius:"6px", background:col.bg, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}><FileIcon color={col.dot} /></div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ color:"#222", fontSize:"12px", fontWeight:500, margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{doc.title}</p>
                      <span style={{ color:"#ccc", fontSize:"10px" }}>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"}) : "—"}</span>
                    </div>
                    <span style={{ background:sts.bg, color:sts.text, fontSize:"10px", fontWeight:600, padding:"2px 7px", borderRadius:"20px", flexShrink:0 }}>{doc.status}</span>
                  </div>
                );
              })
          }
        </div>

        <div style={{ padding:"16px 28px 28px", flexShrink:0 }}>
          <button onClick={onSignOut}
            style={{ width:"100%", padding:"11px", background:"none", border:"1.5px solid #f0f0f0", borderRadius:"10px", color:"#c0392b", fontSize:"13px", fontWeight:600, cursor:"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:"7px" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#fff0f0";e.currentTarget.style.borderColor="#fcc";}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.borderColor="#f0f0f0";}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

//dashboard
function DashboardContent({ activeTab, onUpload, myDocs, myLoading, library, libLoading }) {
  const [category,    setCategory]    = useState("All");
  const [search,      setSearch]      = useState("");
  const [searchFocus, setSearchFocus] = useState(false);

  const cardRef = useRef(null);
  const [entry, setEntry] = useState({ opacity:0, transform:"translateY(48px)" });
  useEffect(() => {
    const onScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const winH = window.innerHeight;
      const prog  = Math.min(Math.max((winH - rect.top) / (winH * 0.35), 0), 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      setEntry({ opacity:eased, transform:`translateY(${48*(1-eased)}px)` });
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isMyDocs = activeTab === "My Documents";
  const docs     = isMyDocs ? myDocs : library;
  const loading  = isMyDocs ? myLoading : libLoading;

  const filtered = docs.filter(d => {
    const matchCat    = category === "All" || d.category === category;
    const matchSearch = (d.title || "").toLowerCase().includes(search.toLowerCase())
                     || (d.id    || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const H_PAD = "80px";
  const headerFade = useFadeUp(0);
  const colTemplate = isMyDocs ? "2fr 1fr 110px 70px 80px 60px" : "2fr 1fr 1fr 110px 70px 70px";
  const colHeaders  = isMyDocs ? ["Document","Category","Date","Size","Status",""] : ["Document","Uploaded by","Category","Date","Size",""];

  return (
    <div ref={cardRef} style={{ ...entry, background:"#fff", borderRadius:"0 2rem 0 0", position:"relative", zIndex:10, willChange:"transform, opacity", minHeight:"60vh" }}>

      <div ref={headerFade.ref} style={{ ...headerFade.style, padding:`40px ${H_PAD} 0`, display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px", flexWrap:"wrap" }}>
        <div>
          <h2 style={{ color:"#111", fontWeight:700, fontSize:"clamp(1.2rem, 2vw, 1.6rem)", lineHeight:1.2, margin:"0 0 4px", letterSpacing:"-0.01em" }}>
            {isMyDocs ? "My Documents" : "Browse Library"}
          </h2>
          <p style={{ color:"#bbb", fontSize:"12px", margin:0 }}>
            {loading ? "Loading…" : isMyDocs ? `${filtered.length} document${filtered.length!==1?"s":""} uploaded by you` : `${filtered.length} document${filtered.length!==1?"s":""} across all colleges`}
          </p>
        </div>
        <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", background:searchFocus?"#fff":"#f4f4f4", border:searchFocus?"1.5px solid #2d3a8c":"1.5px solid #f4f4f4", borderRadius:"10px", padding:"8px 12px", transition:"border-color 0.15s, background 0.15s", minWidth:"220px" }}>
            <SearchIcon />
            <input type="text" placeholder="Search by title or ID…" value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSearchFocus(true)} onBlur={()=>setSearchFocus(false)}
              style={{ background:"none", border:"none", outline:"none", fontSize:"13px", color:"#333", width:"100%", fontFamily:"inherit" }} />
            {search && <button onClick={()=>setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#bbb", fontSize:"13px", padding:0 }}>✕</button>}
          </div>
          {isMyDocs && (
            <button onClick={onUpload} onMouseEnter={e=>e.currentTarget.style.background="#d4590f"} onMouseLeave={e=>e.currentTarget.style.background="#e86c1a"}
              style={{ background:"#e86c1a", color:"#fff", border:"none", borderRadius:"10px", padding:"9px 18px", fontSize:"13px", fontWeight:600, letterSpacing:"0.08em", cursor:"pointer", display:"flex", alignItems:"center", gap:"7px", transition:"background 0.15s" }}>
              <UploadIcon /> UPLOAD
            </button>
          )}
        </div>
      </div>

      <div style={{ padding:`16px ${H_PAD} 0`, display:"flex", gap:"8px", flexWrap:"wrap" }}>
        {CATEGORIES.map(cat => {
          const active = cat === category;
          return (
            <button key={cat} onClick={()=>setCategory(cat)}
              style={{ padding:"6px 16px", borderRadius:"30px", border:active?"none":"1.5px solid #ebebeb", background:active?"#2d3a8c":"#fff", color:active?"#fff":"#888", fontSize:"12px", fontWeight:active?600:400, cursor:"pointer", transition:"all 0.15s" }}
              onMouseEnter={e=>{if(!active){e.currentTarget.style.borderColor="#2d3a8c";e.currentTarget.style.color="#2d3a8c";}}}
              onMouseLeave={e=>{if(!active){e.currentTarget.style.borderColor="#ebebeb";e.currentTarget.style.color="#888";}}}>
              {cat}
              {cat !== "All" && (
                <span style={{ marginLeft:"6px", background:active?"rgba(255,255,255,0.2)":"#f0f0f0", color:active?"#fff":"#bbb", fontSize:"10px", fontWeight:600, padding:"1px 6px", borderRadius:"10px" }}>
                  {docs.filter(d=>d.category===cat).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ padding:`18px ${H_PAD} 0` }}>
        <div style={{ display:"grid", gridTemplateColumns:colTemplate, gap:"12px", padding:"0 10px 10px", borderBottom:"2px solid #f0f0f0" }}>
          {colHeaders.map((h,i) => <span key={i} style={{ fontSize:"10.5px", fontWeight:600, color:"#bbb", letterSpacing:"0.08em", textTransform:"uppercase" }}>{h}</span>)}
        </div>
        <div style={{ paddingBottom:"48px" }}>
          {loading
            ? [1,2,3,4].map(i=><SkeletonRow key={i} cols={colTemplate}/>)
            : filtered.length === 0
              ? <EmptyState message={isMyDocs?"No documents uploaded yet.":"No documents found."} sub={isMyDocs?"Upload your first MFO document to get started.":"Try adjusting your search or filter."} />
              : filtered.map((doc,i) => <DocRow key={doc.id||i} doc={doc} showUploader={!isMyDocs} index={i} />)
          }
        </div>
      </div>

      <hr style={{ border:"none", borderTop:"1px solid #f0f0f0", margin:0 }} />
      <div style={{ padding:`18px ${H_PAD}`, display:"flex", alignItems:"center", gap:"10px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
        <p style={{ color:"#bbb", fontSize:"12px", margin:0 }}>Students can upload documents. Editing and deletion are managed by PKMD staff only.</p>
      </div>
      <hr style={{ border:"none", borderTop:"1px solid #f0f0f0", margin:0 }} />
      <footer style={{ padding:`18px ${H_PAD}` }}>
        <p style={{ color:"#ccc", fontSize:"13px", margin:0 }}>This website is a student project and is intended for academic purposes only.</p>
      </footer>
    </div>
  );
}

//Page 
export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab,   setActiveTab]   = useState("My Documents");
  const [profileOpen, setProfileOpen] = useState(false);
  const [uploadOpen,  setUploadOpen]  = useState(false);

  const { user }                                              = useCurrentUser();
  const { docs: myDocs,  loading: myLoading,  refetch }      = useMyDocuments();
  const { docs: library, loading: libLoading }               = useLibrary();

  const handleSignOut = async () => { await signOut(); navigate("/signin"); };

  return (
    <div style={{ display:"flex", flexDirection:"column", backgroundColor:"#2d3a8c", minHeight:"100vh" }}>
      <div style={{ display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
        <img src={BgSVG} aria-hidden="true" style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", pointerEvents:"none", userSelect:"none", zIndex:0 }} />
        <Navbar user={user} onProfileOpen={() => setProfileOpen(true)} />
        <DashboardHero user={user} myDocs={myDocs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <DashboardContent activeTab={activeTab} onUpload={()=>setUploadOpen(true)} myDocs={myDocs} myLoading={myLoading} library={library} libLoading={libLoading} />

      <ProfilePanel open={profileOpen} onClose={()=>setProfileOpen(false)} onUpload={()=>setUploadOpen(true)} onSignOut={handleSignOut} user={user} myDocs={myDocs} />

      {uploadOpen && <UploadModal onClose={()=>setUploadOpen(false)} onSuccess={()=>refetch()} />}
    </div>
  );
}