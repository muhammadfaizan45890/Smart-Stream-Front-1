import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from 'react-router-dom';

/* ────────────────────────────────────────────────────────
   Pages
   ──────────────────────────────────────────────────────── */
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

/* ────────────────────────────────────────────────────────
   Components
   ──────────────────────────────────────────────────────── */
import Navbar from './components/Navbar';

/* ────────────────────────────────────────────────────────
   ScrollToTop
   ──────────────────────────────────────────────────────── */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

/* ────────────────────────────────────────────────────────
   Root Layout
   ──────────────────────────────────────────────────────── */
const RootLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // ✅ Hide Navbar on Privacy & Terms pages
  const isLegalPage = path === '/privacy' || path === '/terms';

  return (
    <>
      {!isLegalPage && <Navbar />}
      <ScrollToTop />
      <Outlet />
    </>
  );
};

/* ────────────────────────────────────────────────────────
   Router
   ──────────────────────────────────────────────────────── */
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      /* ── Public routes ── */
      { path: '/', element: <Home /> },
      
      /* ── Legal pages ── */
      { path: '/privacy', element: <Privacy /> },
      { path: '/terms', element: <Privacy /> }, // Reusing Privacy component for Terms
      
      /* ── 404 catch-all ── */
      { path: '*', element: <NotFound /> },
    ],
  },
]);

/* ────────────────────────────────────────────────────────
   App
   ──────────────────────────────────────────────────────── */
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
