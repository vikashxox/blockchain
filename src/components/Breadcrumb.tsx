import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useElectionStore } from '../store/electionStore';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const { t } = useElectionStore();

  const pathnames = location.pathname.split('/').filter(x => x);

  const routeNameMap: Record<string, string> = {
    register: t.nav.register,
    voter: t.nav.voterLogin,
    verify: t.nav.verify,
    explorer: t.nav.explorer,
    results: t.nav.results,
    roadmap: t.nav.roadmap,
    admin: t.nav.admin,
  };

  if (pathnames.length === 0) return null;

  return (
    <div className="bg-[#F0E6D0]/60 border-b border-warmBorder py-1.5 px-4 sm:px-6 text-xs text-charcoal-muted">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto">
        <Link to="/" className="hover:text-govNavy flex items-center gap-1 font-medium">
          <Home className="w-3.5 h-3.5" />
          <span>{t.nav.home}</span>
        </Link>
        {pathnames.map((segment, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = routeNameMap[segment] || segment;

          return (
            <React.Fragment key={to}>
              <ChevronRight className="w-3 h-3 text-charcoal-muted/60 flex-shrink-0" />
              {isLast ? (
                <span className="font-semibold text-govNavy">{label}</span>
              ) : (
                <Link to={to} className="hover:text-govNavy font-medium">
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
