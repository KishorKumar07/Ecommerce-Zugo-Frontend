import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoCart,
  IoLogIn,
  IoLogOut,
  IoMenu,
  IoClose,
  IoPerson,
  IoHome,
  IoReceipt,
  IoShield,
  IoConstruct,
} from 'react-icons/io5';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cartItems } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const desktopNavItems = useMemo(() => {
    const base = [{ to: '/', label: 'Home', icon: IoHome }];

    if (isAuthenticated && !isAdmin) {
      base.push({ to: '/orders', label: 'Orders', icon: IoReceipt });
    }

    if (isAuthenticated && isAdmin) {
      base.push({ to: '/admin/orders', label: 'Orders', icon: IoShield });
    }

    return base;
  }, [isAuthenticated, isAdmin]);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 px-4 bg-slate-950/95 backdrop-blur border-b border-slate-900/60"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          layout
          className="hidden md:flex items-center justify-between rounded-full border border-slate-800/60 bg-slate-900/60 backdrop-blur-xl px-4 py-3 shadow-[0_25px_70px_-35px_rgba(15,118,255,0.35)]"
        >
          <Link to="/" className="flex items-center gap-3 pl-2 pr-6 py-1 rounded-full border border-slate-800/60 bg-slate-900/70">
            <motion.div
              whileHover={{ scale: 1.07 }}
              transition={{ duration: 0.4 }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800/60 overflow-hidden bg-slate-900/70"
            >
              <img
                src="https://media.licdn.com/dms/image/v2/D4D0BAQGP7wW9vz0JDw/company-logo_200_200/B4DZf1kmkZGYAc-/0/1752171703661?e=2147483647&v=beta&t=3Z1ifA5hCmY1AIcVXmmcQTGjteoMjvi4S9Q2hxeYc1w"
                alt="Zugo Private Limited Logo"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold text-white">Zugo Private Limited</span>
             
            </div>
          </Link>

          <div className="relative flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/70 border border-slate-800/60">
            {desktopNavItems.map(({ to, label, icon: Icon }) => {
              const active = isActive(to);
              return (
                <motion.button
                  key={to}
                  onClick={() => navigate(to)}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-highlight"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/90 via-blue-500/90 to-indigo-500/90 shadow-lg shadow-sky-500/40"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link to="/cart" className="relative">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/80 border border-slate-800 text-white shadow-lg shadow-sky-500/30"
                    >
                      <IoCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-semibold text-white shadow"
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </motion.button>
                  </Link>
                )}

                {isAdmin && (
                  <Link to="/admin/products">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white border border-white/20"
                    >
                      <IoConstruct className="w-4 h-4" />
                      Manage Products
                    </motion.button>
                  </Link>
                )}

                <div className="flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-900/70 px-4 py-2 text-sm text-white/80">
                  <IoPerson className="w-4 h-4 text-white/70" />
                  <span>{user?.name}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-100 border border-rose-400/50"
                >
                  <IoLogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/40"
                >
                  <IoLogIn className="w-4 h-4" />
                  Enter Portal
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>

        <div className="md:hidden flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/80 border border-slate-800/70">
              <IoHome className="w-5 h-5 text-white" />
            </span>
            <div className="flex flex-col leading-tight text-white">
              <span className="text-base font-semibold">Zugo</span>
              <span className="text-xs text-white/70">Ultimate UI</span>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-lg"
          >
            {mobileMenuOpen ? <IoClose className="w-5 h-5" /> : <IoMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-3 mx-4 rounded-2xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl overflow-hidden"
        >
          <div className="px-4 py-4 space-y-3 text-white/85 text-sm">
            <MobileNavLink to="/" icon={IoHome} onClick={() => setMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
            {!isAdmin && (
              <MobileNavLink to="/orders" icon={IoReceipt} onClick={() => setMobileMenuOpen(false)} hidden={!isAuthenticated}>
                Orders
              </MobileNavLink>
            )}
            {isAuthenticated && !isAdmin && (
              <MobileNavLink to="/cart" icon={IoCart} onClick={() => setMobileMenuOpen(false)}>
                Cart {cartCount > 0 && `(${cartCount})`}
              </MobileNavLink>
            )}
            {isAdmin && (
              <>
                <MobileNavLink to="/admin" icon={IoShield} onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/admin/products" icon={IoConstruct} onClick={() => setMobileMenuOpen(false)}>
                  Manage Products
                </MobileNavLink>
              </>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-xl border border-rose-400/40 bg-rose-500/20 px-4 py-3 text-rose-100 font-semibold"
              >
                <IoLogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-4 py-3 font-semibold shadow-lg shadow-sky-500/40">
                  <IoLogIn className="w-5 h-5" />
                  Enter Portal
                </div>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

const MobileNavLink = ({ to, icon: Icon, children, onClick, hidden }) => {
  if (hidden) return null;

  return (
    <Link to={to} onClick={onClick}>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10">
        <Icon className="w-5 h-5" />
        {children}
      </div>
    </Link>
  );
};

export default Navbar;

