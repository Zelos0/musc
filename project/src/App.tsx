import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from './hooks/redux';
import { setUser } from './store/slices/authSlice';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const dispatch = useAppDispatch();

  // Simulate auth check on app load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="library" element={<Library />} />
          <Route path="playlist/:id" element={<Playlist />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </div>
  );
}

export default App;