import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BUPhoto from "../assets/bu-fourpillars.png";
import BgSVG from "../assets/bg-01.svg";

//navigation
function Navbar(){
  const navigate = useNavigate();
  return(
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
          style={{ color:"#fff", fontWeight:600, fontSize:"13px", letterSpacing:"0.1em", background:"none", border:"none", borderBottom:"2px solid #fff", paddingBottom:"2px", cursor:"pointer" }}>
          HOME
        </button>
        
        <button onClick={() => navigate("/signin")}
          style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", letterSpacing:"0.1em", background:"none", border:"none", cursor:"pointer" }}
          onMouseEnter={e => e.target.style.color="#fff"}
          onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.6)"}>
          SIGN IN
        </button>
      </div>
    </nav>
  );
}

//hero secrtion
function HeroSection() {
  const navigate = useNavigate();
  return(
    <section style={{
      position:"relative", zIndex:10,
      display:"flex", flexDirection:"column",
      alignItems:"flex-start", justifyContent:"center",
      flex:1,
      minHeight:"calc(100vh - 73px)",
      overflow:"hidden",
      padding:"0 80px",
    }}>
      <span style={{
        color:"rgba(255,255,255,0.55)",
        fontSize:"11px", fontWeight:600,
        letterSpacing:"0.22em", textTransform:"uppercase",
        marginBottom:"16px",
      }}>
        BICOL UNIVERSITY 
      </span>
      {/*main title*/}
      <h1 style={{
        color:"#fff",
        textAlign:"left",
        fontSize:"clamp(1.9rem, 3.2vw, 2.8rem)",
        fontWeight:700,
        lineHeight:1.25,
        margin:"0 0 16px",
        maxWidth:"560px",
        letterSpacing:"-0.02em",
      }}>
        Digital Archival System<br />
        for Publication and<br />
        Knowledge Management
      </h1>

      {/*sub*/}
      <p style={{
        color:"rgba(255,255,255,0.55)",
        fontSize:"13px", lineHeight:1.7,
        margin:"0 0 32px",
        maxWidth:"380px",
      }}>
        A centralized platform to store, organize, and manage
        Major Final Output (MFO) documents across Bicol University colleges.
      </p>

      {/*buttons*/}
      <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
        <button
          onClick={() => navigate("/signin")}
          onMouseEnter={e => e.currentTarget.style.background="#d4590f"}
          onMouseLeave={e => e.currentTarget.style.background="#e86c1a"}
          style={{ background:"#e86c1a", color:"#fff", fontWeight:600, fontSize:"13px", letterSpacing:"0.12em", padding:"11px 36px", borderRadius:"8px", border:"none", cursor:"pointer" }}>
          SIGN IN
        </button>
        <button
          onClick={() => navigate("/library")}
          onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background="transparent"}
          style={{ background:"transparent", color:"#fff", fontWeight:600, fontSize:"13px", letterSpacing:"0.12em", padding:"11px 36px", borderRadius:"8px", border:"1px solid rgba(255,255,255,0.35)", cursor:"pointer" }}>
          BROWSE LIBRARY {/*make new page for this ano lang siguro simple scroll tapos to view all need mag sign up?*/}
        </button>
      </div>
    </section>
  );
}
//next section fade
function useFadeUp(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.09 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return {
    ref,
    style: {
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    },
  };
}

//image horizontal scroll: lagyan ko nalang pics later on
function ImageStrip() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false, startX, scrollLeft;
    const onDown = (e) => { down = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; el.style.cursor = "grabbing"; };
    const onUp   = ()  => { down = false; el.style.cursor = "grab"; };
    const onMove = (e) => { if (!down) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.3; };
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display:"flex", gap:"16px",
        overflowX:"auto", paddingBottom:"4px",
        cursor:"grab", scrollbarWidth:"none",
        msOverflowStyle:"none", WebkitOverflowScrolling:"touch",
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{
          flexShrink:0,
          width:"320px", height:"280px",
          background:"#d9d9d9",
          borderRadius:"14px",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#aaa", fontSize:"14px",
        }} />
      ))}
    </div>
  );
}

//other contents tbh di ko alam ilalagay hindi ko pa grasp masyado yung thesis kulang info
function ContentSection() {
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const [entry, setEntry] = useState({ opacity: 0, transform: "translateY(64px)" });
  useEffect(() => {
    const onScroll = () => {
      if (!cardRef.current) return;
      const rect  = cardRef.current.getBoundingClientRect();
      const winH  = window.innerHeight;
      const prog  = Math.min(Math.max((winH - rect.top) / (winH * 0.4), 0), 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      setEntry({ opacity: eased, transform: `translateY(${64 * (1 - eased)}px)` });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const r1 = useFadeUp(0);
  const r2 = useFadeUp(0.1);
  const r3 = useFadeUp(0.05);

  const H_PAD = "80px";

  return (
    <div
      ref={cardRef}
      style={{
        ...entry,
        background:"#fff",
        borderRadius:"2rem 2rem 0 0",
        position:"relative", zIndex:10,
        willChange:"transform, opacity",
      }}
    >
      <div
        ref={r1.ref}
        style={{
          ...r1.style,
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          padding:`72px ${H_PAD} 64px`,
          gap:"80px",
          alignItems:"start",
        }}
      >
        <h2 style={{ color:"#111", fontWeight:700, fontSize:"clamp(1.8rem, 2.8vw, 2.5rem)", lineHeight:1.2, margin:0 }}>
          Get Access to<br />
          1000+ University<br />
          Materials
        </h2>

        <div>
          <h3 style={{ color:"#111", fontSize:"20px", fontWeight:600, margin:"0 0 16px" }}>Overview</h3>
          <p style={{ color:"#666", fontSize:"14px", lineHeight:1.85, textAlign:"justify", margin:"0 0 28px" }}>
           Get instant access to a secure, centralized repository
           designed to streamline the collection, preservation, and
           management of Bicol University's Major Final Output (MFO)
           documents. This platform replaces vulnerable cloud storage
           with robust data protection while allowing users to easily
           access, track, and generate institutional reports filtered
           by year, quarter, and document category.
          </p>
          <button
            onClick={() => navigate("/library?category=journals")}
            onMouseEnter={e => e.currentTarget.style.background="#d4590f"}
            onMouseLeave={e => e.currentTarget.style.background="#e86c1a"}
            style={{ background:"#e86c1a", color:"#fff", fontWeight:600, fontSize:"13px", letterSpacing:"0.12em", padding:"11px 32px", borderRadius:"8px", border:"none", cursor:"pointer" }}>
            FAQs
          </button>
        </div>
      </div>

      {/*img layout*/}
      <div
        ref={r2.ref}
        style={{
          ...r2.style,
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          padding:`64px ${H_PAD} 72px`,
          gap:"80px",
          alignItems:"start",
        }}
      >
        <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
          <span style={{ color:"#bbb", fontSize:"13px" }}>insert something here ig</span>
        </div>

        <div style={{ overflow:"hidden" }}>
          <ImageStrip />
        </div>
      </div>

      <hr style={{ border:"none", borderTop:"1px solid #efefef", margin:0 }} />

      {/*bu 4 pillars*/}
      <img
        src={BUPhoto}
        alt="Bicol University"
        title="image source: Bicol University Official Website"
        style={{ width:"100%", height:"306px", objectFit:"cover", display:"block" }}
      />
      <hr style={{ border:"none", borderTop:"1px solid #efefef", margin:0 }} />

      {/*about*/}
      <div ref={r3.ref} style={r3.style}>
        <section style={{ padding:`56px ${H_PAD}` }}>
          <h3 style={{ color:"#111", fontSize:"20px", fontWeight:600, margin:"0 0 16px" }}>About</h3>
          <p style={{ color:"#555", fontSize:"14px", lineHeight:1.85, textAlign:"justify", margin:0 }}>
            BU PKMD stores, organizes, and manages Major Final Output (MFO) documents
            for different colleges under Bicol University. And also to generate reports
            for the colleges that can be filtered by year, quarter, and document
            category. This is because the Bicol University Publication and Knowledge
            Management Division (BU PKMD) uses Google Drive for the collection,
            management, and preservation of MFO documents and submission and
            organization of reports. Security is one of the main issues of the
            utilization of GDrive, unauthorized access and modifications are likely
            to happen.
          </p>
        </section>
      </div>

      <hr style={{ border:"none", borderTop:"1px solid #efefef", margin:0 }} />

      {/*footer*/}
      <footer style={{ padding:`18px ${H_PAD}` }}>
        <p style={{ color:"#ccc", fontSize:"13px", margin:0 }}>
          This website is a student project and is intended for academic purposes only.
        </p>
      </footer>

    </div>
  );
}

//page layout
export default function Home() {
  return (
    <div style={{ display:"flex", flexDirection:"column", backgroundColor:"#2d3a8c", minHeight:"100vh" }}>

      {/*blue hero section */}
      <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", position:"relative", overflow:"hidden" }}>

        {/*for the 4 pillars svg to sit on top of the blue bg*/}
        <img
          src={BgSVG}
          aria-hidden="true"
          style={{
            position:"absolute",
            top:0, left:0,
            width:"100%",
            height:"100%",
            objectFit:"cover",
            objectPosition:"center",
            pointerEvents:"none",
            userSelect:"none",
            zIndex:0,
          }}
        />
        <Navbar />
        <HeroSection />
      </div>

      <ContentSection />

    </div>
  );
}