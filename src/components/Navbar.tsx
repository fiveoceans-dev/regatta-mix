import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-20 flex h-12 items-center justify-between bg-white px-4 shadow">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-gray-300" />
          <span className="text-sm font-semibold">Cyber Sailing</span>
        </div>
        <button
          className="p-1"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>
      {open && (
        <div className="fixed top-12 left-0 right-0 z-10 bg-white shadow">
          <div className="flex justify-around py-2 text-sm">
            <Link to="/">Home</Link>
            <Link to="/play">Play</Link>
            <Link to="/protestroom">Protest Room</Link>
            <Link to="/history">History</Link>
            <Link to="/settings">Settings</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
