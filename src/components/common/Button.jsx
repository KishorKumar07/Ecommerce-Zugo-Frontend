import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) => {
  const variants = {
    primary:
      'bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 text-slate-950 shadow-[0_20px_50px_-25px_rgba(56,189,248,0.6)] hover:from-sky-400 hover:via-cyan-400 hover:to-emerald-300',
    secondary:
      'bg-white/10 border border-white/20 text-slate-100 hover:bg-white/20 hover:border-white/30 shadow-[0_18px_50px_-35px_rgba(14,165,233,0.55)]',
    outline:
      'border border-sky-400/70 text-sky-200 hover:bg-sky-400/10 hover:text-sky-100',
    danger:
      'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 text-slate-950 shadow-[0_20px_50px_-25px_rgba(248,113,113,0.55)] hover:from-rose-400 hover:via-orange-400 hover:to-amber-300',
    ghost:
      'bg-transparent text-slate-300 hover:bg-white/10 hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={`relative font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
          <div className="loader-small"></div>
        </div>
      )}
      <span className={`flex items-center gap-2 ${loading ? 'invisible' : ''}`}>
        {Icon && <Icon className="w-5 h-5" />}
        {children}
      </span>
    </motion.button>
  );
};

export default Button;

