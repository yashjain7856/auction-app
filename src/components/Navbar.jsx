import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkStyle = ({ isActive }) =>
    `text-sm font-medium px-4 py-2 rounded ${
      isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
    }`;

  return (
    <nav className="bg-white shadow px-6 py-4 flex gap-4">
      <NavLink to="/" className={linkStyle}>Home</NavLink>
      <NavLink to="/setup" className={linkStyle}>Setup</NavLink>
      <NavLink to="/auction" className={linkStyle}>Auction</NavLink>
      <NavLink to="/teams" className={linkStyle}>Teams</NavLink>
      <NavLink to="/players" className={linkStyle}>Players</NavLink>
      <NavLink to="/share" className={linkStyle}>Share</NavLink>
    </nav>
  );
}
