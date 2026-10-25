import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopStrip } from './TopStrip';
import { DisclaimerBanner } from './DisclaimerBanner';
import { UtilityBar } from './UtilityBar';
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Breadcrumb } from './Breadcrumb';
import { Footer } from './Footer';
import { DemoGuide } from './DemoGuide';
import { OutboxModal } from './OutboxModal';
import { useElectionStore } from '../store/electionStore';

export const Layout: React.FC = () => {
  const [outboxOpen, setOutboxOpen] = useState(false);
  const { highContrast, textSize } = useElectionStore();

  const textSizeClass = {
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  }[textSize];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-govSaffron/20 selection:text-govNavy-dark ${
        highContrast ? 'bg-yellow-50 text-black contrast-125' : 'bg-[#FAF3E0] text-[#1F2A44]'
      } ${textSizeClass}`}
    >
      {/* Top 3-color strip */}
      <TopStrip />

      {/* Mandatory prototype disclaimer */}
      <DisclaimerBanner />

      {/* Official utility bar */}
      <UtilityBar onOpenOutbox={() => setOutboxOpen(true)} />

      {/* Portal Header */}
      <Header />

      {/* Navigation bar */}
      <NavBar />

      {/* Breadcrumb path */}
      <Breadcrumb />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Official Government Footer */}
      <Footer />

      {/* Presenter Floating Demo Guide */}
      <DemoGuide />

      {/* Outbox Notifications Modal */}
      <OutboxModal isOpen={outboxOpen} onClose={() => setOutboxOpen(false)} />
    </div>
  );
};
