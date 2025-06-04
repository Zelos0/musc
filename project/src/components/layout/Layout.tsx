import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from '../player/Player';

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-24 md:pb-28">
          <Outlet />
        </main>
      </div>
      <Player />
    </div>
  );
};

export default Layout;