import React from 'react';
import { Link } from 'react-router-dom';
import { IoLogoGithub, IoLogoTwitter, IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5';
import { useAuthStore } from '../../store/authStore';

const Footer = () => {
  const { user } = useAuthStore();
  const showCustomerOrbit = user?.role !== 'admin';

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-slate-200 mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.08),_transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.08),transparent,rgba(129,140,248,0.08))] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20 shadow-[0_15px_40px_-25px_rgba(56,189,248,0.8)]">
                <img
                  src="https://media.licdn.com/dms/image/v2/D4D0BAQGP7wW9vz0JDw/company-logo_200_200/B4DZf1kmkZGYAc-/0/1752171703661?e=2147483647&v=beta&t=3Z1ifA5hCmY1AIcVXmmcQTGjteoMjvi4S9Q2hxeYc1w"
                  alt="Zugo Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <span className="text-xl font-semibold text-white">Zugo Private Limited</span>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mt-1">Future commerce</p>
              </div>
            </div>
            <p className="text-slate-400 max-w-sm">
              Curated experiences, adaptive pricing, and express delivery — crafted for explorers of tomorrow&apos;s marketplace.
            </p>
          </div>

          {showCustomerOrbit && (
            <div className="flex flex-col items-center md:items-start space-y-3">
              <h3 className="font-semibold text-lg text-white">Customer Orbit</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/orders" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 transition">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 transition">
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <div className="flex flex-col items-center md:items-start lg:items-center space-y-3">
            <h3 className="font-semibold text-lg text-white">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-3 rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/15 hover:border-white/20"
                aria-label="GitHub"
              >
                <IoLogoGithub className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/15 hover:border-white/20"
                aria-label="Twitter"
              >
                <IoLogoTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/15 hover:border-white/20"
                aria-label="Instagram"
              >
                <IoLogoInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/15 hover:border-white/20"
                aria-label="LinkedIn"
              >
                <IoLogoLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-sm text-slate-500">
          <p>© 2025 Zugo E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;