import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import Home from "./pages/Home";
import Pilot from "./pages/Pilot";

function LegacyRedirect({ pathname }) {
  const { search, hash } = useLocation();
  return <Navigate replace to={{ pathname, search, hash }} />;
}

function NotFound() {
  return (
    <div className="wrap pilot-intro">
      <h1>Page unavailable</h1>
      <Link className="button button-coral" to="/">Return to TerraFed</Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="discuss-a-pilot" element={<Pilot />} />
          <Route path="contact" element={<LegacyRedirect pathname="/discuss-a-pilot" />} />
          <Route path="discuss-a-pilot.html" element={<LegacyRedirect pathname="/discuss-a-pilot" />} />
          <Route path="index.html" element={<LegacyRedirect pathname="/" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
