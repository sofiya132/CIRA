import React, { useState } from 'react';
import { CampusPulseProvider, useCampusPulse } from './context/CampusPulseContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { LaunchpadHub } from './components/home/LaunchpadHub';
import { OperationsCommandCenter } from './components/command/OperationsCommandCenter';
import { FusionCenter } from './components/fusion/FusionCenter';
import { StudentHome } from './components/student/StudentHome';
import { StudentReportWizard } from './components/student/StudentReportWizard';
import { StudentMyReports } from './components/student/StudentMyReports';
import { StudentIncidentTracking } from './components/student/StudentIncidentTracking';
import { StudentNotifications } from './components/student/StudentNotifications';
import { StudentEmergencyHelp } from './components/student/StudentEmergencyHelp';
import { StudentProfile } from './components/student/StudentProfile';
import { ResponderWorkspace } from './components/responder/ResponderWorkspace';
import { EscalationCenter } from './components/escalation/EscalationCenter';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ResponderFleetView } from './components/fleet/ResponderFleetView';
import { SettingsView } from './components/settings/SettingsView';
import { CampusMap } from './components/command/CampusMap';
import { ChiefWorkspace } from './components/command/ChiefWorkspace';
import { ChiefProfile } from './components/command/ChiefProfile';
import { DispatcherProfile } from './components/command/DispatcherProfile';
import { ResponderProfile } from './components/responder/ResponderProfile';
import { SignatureDemoModal } from './components/scenarios/SignatureDemoModal';
import { EmergencyCallModal } from './components/student/EmergencyCallModal';
import { AppBackground } from './components/common/AppBackground';
import { Play, ArrowLeft } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentScreen, setCurrentScreen, activeRole } = useCampusPulse();
  const [showDemoModal, setShowDemoModal] = useState(false);

  const isHomeScreen = currentScreen === 'HOME';

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <LaunchpadHub />;
      case 'COMMAND':
      case 'COMMAND_QUEUE':
        return <OperationsCommandCenter />;
      case 'FUSION':
        return <FusionCenter />;
      case 'STUDENT_HOME':
        return <StudentHome />;
      case 'STUDENT':
      case 'STUDENT_REPORT':
        return <StudentReportWizard />;
      case 'STUDENT_MY_REPORTS':
        return <StudentMyReports />;
      case 'STUDENT_TRACKING':
        return <StudentIncidentTracking />;
      case 'STUDENT_NOTIFICATIONS':
        return <StudentNotifications />;
      case 'STUDENT_HELP':
        return <StudentEmergencyHelp />;
      case 'STUDENT_PROFILE':
        return <StudentProfile />;
      case 'RESPONDER_PROFILE':
        return <ResponderProfile />;
      case 'DISPATCHER_PROFILE':
        return <DispatcherProfile />;
      case 'CHIEF_PROFILE':
        return <ChiefProfile />;
      case 'CHIEF_OVERVIEW':
      case 'CHIEF_CRITICAL':
        return <ChiefWorkspace />;
      case 'RESPONDER':
      case 'RESPONDER_ACTIVE':
      case 'RESPONDER_INCIDENTS':
        return <ResponderWorkspace />;
      case 'ESCALATION':
        return <EscalationCenter />;
      case 'MAP':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Tactical Campus Grounds
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Interactive spatial vector map of perimeter zones, building hazard areas, and live responder locations.
                </p>
              </div>
            </div>
            <CampusMap fullScreen={true} />
          </div>
        );
      case 'ANALYTICS':
        return <AnalyticsView />;
      case 'NOTIFICATIONS':
        return <NotificationsView />;
      case 'FLEET':
        return <ResponderFleetView />;
      case 'SETTINGS':
        return <SettingsView />;
      default:
        return activeRole === 'STUDENT' ? <StudentHome /> : <LaunchpadHub />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans relative ${
      isHomeScreen ? 'bg-slate-950' : 'bg-[#0B1120]'
    }`}>
      {/* Dynamic Background: Video on 1st tab (HOME), Operations Room Background on all other tabs */}
      <AppBackground currentScreen={currentScreen} />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <Navigation />
        
        <main className="flex-1 pb-16">
          {/* Back Navigation Button on Sub-pages for Operations roles */}
          {!isHomeScreen && activeRole !== 'STUDENT' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0">
              <button
                onClick={() => setCurrentScreen('HOME')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold shadow-md border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>&larr; Back to Home</span>
              </button>
            </div>
          )}

          {renderScreen()}
        </main>

        {/* Global Emergency Calling Modal */}
        <EmergencyCallModal />

        {/* Floating Presentation Demo Deck Trigger */}
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => setShowDemoModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current text-brand-400" />
            <span>Demo Deck</span>
          </button>
        </div>

        <SignatureDemoModal
          isOpen={showDemoModal}
          onClose={() => setShowDemoModal(false)}
        />
      </div>
    </div>
  );
};

export function App() {
  return (
    <CampusPulseProvider>
      <MainContent />
    </CampusPulseProvider>
  );
}

export default App;
