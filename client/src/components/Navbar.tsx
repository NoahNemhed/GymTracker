import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate  } from "react-router";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/home" },
  { label: "Programs", to: "/programs" },
  { label: "Analytics", to: "/analytics" },
];

export default function Navbar() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const username = user?.username || "User";
  const avatarLetter = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigate = (to: string) => {
    setMobileMenuOpen(false);
    navigate(to);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#05070f] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link to="/home">
            <h1 className="text-xl font-extrabold uppercase tracking-wide text-white">
              Gym Tracker
            </h1>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive
                      ? "text-[#7aa2ff]"
                      : "text-zinc-400 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center">
            {/* Desktop profile */}
            <div className="relative hidden md:flex" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#7aa2ff]/30 bg-gradient-to-br from-[#7aa2ff] to-blue-500 text-sm font-bold text-black shadow-[0_0_20px_rgba(122,162,255,0.35)] transition hover:scale-105"
                aria-label="Open profile menu"
              >
                {avatarLetter}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-13 w-52 rounded-xl border border-white/10 bg-[#0b0f1a] shadow-xl">
                  <div className="flex flex-col py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/profile");
                      }}
                      className="px-4 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                    >
                      Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-4 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                setMobileMenuOpen((prev) => !prev);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-[60] bg-[#090d16]/95 backdrop-blur-md md:hidden">
          <div className="h-full overflow-y-auto px-4 py-3">
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <div key={item.to}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.to)}
                    className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </button>

                  <div className="mx-3 my-1 h-px bg-white/10" />
                </div>
              ))}
            </nav>

            <div className="mt-2 flex flex-col">
              <button
                type="button"
                onClick={() => handleNavigate("/profile")}
                className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                Profile
              </button>

              <div className="mx-3 my-1 h-px bg-white/10" />

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}