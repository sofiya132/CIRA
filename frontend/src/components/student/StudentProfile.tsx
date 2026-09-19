import React, { useState } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Lock, 
  Smartphone, 
  Mail, 
  CheckCircle2, 
  FileText,
  Building,
  HeartHandshake,
  Key,
  LogOut,
  Edit3,
  Phone,
  GraduationCap,
  Sparkles,
  Save,
  RotateCcw
} from 'lucide-react';
import { StudentAuthModal } from './StudentAuthModal';

export const StudentProfile: React.FC = () => {
  const { 
    studentProfile, 
    updateStudentProfile, 
    logoutStudent, 
    reports, 
    setCurrentScreen 
  } = useCampusPulse();

  const [isEditing, setIsEditing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form edit states
  const [name, setName] = useState(studentProfile.name);
  const [studentId, setStudentId] = useState(studentProfile.studentId);
  const [department, setDepartment] = useState(studentProfile.department);
  const [year, setYear] = useState(studentProfile.year);
  const [email, setEmail] = useState(studentProfile.email);
  const [phone, setPhone] = useState(studentProfile.phone);
  const [residenceHall, setResidenceHall] = useState(studentProfile.residenceHall || 'North Quad • Hall 304');
  
  // Contact state
  const [contactName, setContactName] = useState(studentProfile.emergencyContact.name);
  const [contactRelationship, setContactRelationship] = useState(studentProfile.emergencyContact.relationship);
  const [contactPhone, setContactPhone] = useState(studentProfile.emergencyContact.phone);

  // Notification toggles
  const [smsUpdates, setSmsUpdates] = useState(studentProfile.notificationPreferences.smsUpdates);
  const [emergencyBroadcasts, setEmergencyBroadcasts] = useState(studentProfile.notificationPreferences.emergencyBroadcasts);
  const [defaultAnonymous, setDefaultAnonymous] = useState(studentProfile.notificationPreferences.defaultAnonymous);

  const studentReports = reports.filter(r => !r.isAnonymous || r.submitterRole === 'Student');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name,
      studentId,
      department,
      year,
      email,
      phone,
      residenceHall,
      emergencyContact: {
        name: contactName,
        relationship: contactRelationship,
        phone: contactPhone
      },
      notificationPreferences: {
        smsUpdates,
        emergencyBroadcasts,
        defaultAnonymous
      }
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSignOut = () => {
    logoutStudent();
    setCurrentScreen('STUDENT_HOME');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in relative z-10">
      {/* Profile Header Surface */}
      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/70 shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-brand-800 text-white flex items-center justify-center text-3xl font-black shadow-md shrink-0">
            {studentProfile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 text-white shadow-md hover:bg-slate-800 transition-transform hover:scale-110 cursor-pointer"
            title="Switch or customize account"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              {studentProfile.name}
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Verified Student
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Student ID: <span className="font-mono text-slate-800 font-bold">{studentProfile.studentId}</span>
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <span>{studentProfile.department} &bull; {studentProfile.year}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Building className="w-4 h-4 text-slate-400" />
              <span>{studentProfile.residenceHall || 'Campus Resident'}</span>
            </span>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{studentProfile.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{studentProfile.phone}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Profile Form (When Editing) */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/70 shadow-lg space-y-5 animate-fade-in text-xs">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Edit Student Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Academic Year</label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-semibold"
              >
                <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                <option value="4th Year (Senior)">4th Year (Senior)</option>
                <option value="Graduate / Researcher">Graduate / Researcher</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">University Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 font-mono"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : null}

      {/* Emergency Contact & Privacy Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emergency Contacts Card */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/70 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HeartHandshake className="w-4 h-4 text-rose-600" />
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Emergency Contact
            </h2>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Contact Name</span>
              <span className="font-extrabold text-slate-900">{studentProfile.emergencyContact.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Relationship</span>
              <span className="font-semibold text-slate-700">{studentProfile.emergencyContact.relationship}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Phone</span>
              <span className="font-mono font-bold text-slate-900">{studentProfile.emergencyContact.phone}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Campus dispatch will notify your emergency contact if critical medical care is required.
          </p>
        </div>

        {/* Account & Notification Preferences */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/70 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Bell className="w-4 h-4 text-brand-600" />
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">SMS Incident Status</span>
                <span className="text-[10px] text-slate-500">Updates on your submitted reports</span>
              </div>
              <input
                type="checkbox"
                checked={smsUpdates}
                onChange={e => {
                  setSmsUpdates(e.target.checked);
                  updateStudentProfile({ notificationPreferences: { ...studentProfile.notificationPreferences, smsUpdates: e.target.checked } });
                }}
                className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">Emergency Broadcasts</span>
                <span className="text-[10px] text-slate-500">Campus-wide safety alerts</span>
              </div>
              <input
                type="checkbox"
                checked={emergencyBroadcasts}
                onChange={e => {
                  setEmergencyBroadcasts(e.target.checked);
                  updateStudentProfile({ notificationPreferences: { ...studentProfile.notificationPreferences, emergencyBroadcasts: e.target.checked } });
                }}
                className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Account Actions & Sign Out */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/70 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-slate-900 block">Account & Device Session</span>
          <span className="text-[11px] text-slate-500">Signed in on Student Community Portal &bull; Last active today</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Switch Student Account
          </button>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Student Privacy Statement */}
      <div className="bg-slate-900/80 backdrop-blur-md text-white p-5 rounded-3xl border border-slate-700/80 text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-brand-300 font-extrabold">
          <Lock className="w-4 h-4" />
          <span>Student Privacy & Isolation</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-300">
          Your student profile and reports are strictly confidential. Operations dispatchers only receive verified location facts and emergency details. No other students can view your reports or identity.
        </p>
      </div>

      {/* Student Auth Modal */}
      <StudentAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onConfirm={() => setShowAuthModal(false)}
      />
    </div>
  );
};
