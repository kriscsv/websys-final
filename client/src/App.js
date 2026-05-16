import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";    
import SignUp from "./pages/SignUp"; 

// ─── Add more page imports here as you build them ─────────────────────────────
// import SignIn       from "./pages/SignIn";
// import Library      from "./pages/Library";
// import FAQ          from "./pages/FAQ";
// import Dashboard    from "./pages/Dashboard";   // admin after login
// import NotFound     from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/"         element={<Home />} />
        <Route path="/signin"   element={<SignIn />} />    {/* ← add this */}
        {/* <Route path="/signin"   element={<SignIn />} /> */}
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/library"  element={<Library />} /> */}
        {/* <Route path="/faq"      element={<FAQ />} /> */}

        {/* Protected routes (add an auth wrapper later) */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* 404 fallback */}
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </BrowserRouter>
  );
}