import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, UserPlus, Vote, CheckCircle, Database, BarChart3, ShieldAlert, BookOpen } from 'lucide-react';
import { useElectionStore } from '../store/electionStore';

export const NavBar: React.FC = () => {
  const { t, isAdmin, currentVoter } = useElectionStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: t.nav.home, icon: Home },
    { to: '/register', label: t.nav.register, icon: UserPlus },
    { to: '/voter', label: t.nav.voterLogin, icon: Vote, highlight: !!currentVoter },
    { to: '/verify', label: t.nav.verify, icon: CheckCircle },
    { to: '/explorer', label: t.nav.explorer, icon: Database },
    { to: '/results', label: t.nav.results, icon: BarChart3 },
    { to: '/roadmap', label: t.nav.roadmap, icon: BookOpen },
    { to: '/admin', label: t.nav.admin, icon: ShieldAlert, adminBadge: isAdmin },
  ];

  return (
    <nav className="bg-govNavy text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 text-xs xl:text-sm font-medium rounded transition flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-govSaffron text-white font-semibold shadow-inner'
                        : 'text-cream-100 hover:bg-govNavy-light hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.label}</span>
                  {item.adminBadge && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-0.5" title="Admin Active" />
                  )}
                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-amber-300 inline-block ml-0.5" title="Voter Logged In" />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <span className="text-xs font-semibold text-cream-200">
              {t.portalTitle} E-Portal
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-cream-200 hover:text-white hover:bg-govNavy-light focus:outline-none focus:ring-2 focus:ring-govSaffron"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-govNavy-dark border-t border-govNavy-light/40 px-2 pt-2 pb-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded text-sm font-medium flex items-center gap-2 ${
                    isActive
                      ? 'bg-govSaffron text-white font-bold'
                      : 'text-cream-200 hover:bg-govNavy-light hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
};
