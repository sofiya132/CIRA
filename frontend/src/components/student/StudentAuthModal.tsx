import React, { useState } from 'react';
import { useCampusPulse } from '../../context/CampusPulseContext';
import { 
  User, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  HeartHandshake, 
  X, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { studentProfile, updateStudentProfile, loginStudent } = useCampusPulse();

  const [name, setName] = useState(studentProfile.name);
  const [studentId, setStudentId] = useState(studentProfile.studentId);
  const [department, setDepartment] = useState(studentProfile.department);
  const [year, setYear] = useState(studentProfile.year);
  const [email, setEmail] = useState(studentProfile.email);
  const [phone, setPhone] = useState(studentProfile.phone);
  const [emergencyName, setEmergencyName] = useState(studentProfile.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(studentProfile.emergencyContact.phone);

  if (!isOpen) return null;

  const handleSaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name,
      studentId,
      department,
      year,
      email,
      phone,
      isLoggedIn: true,
      emergencyContact: {
        name: emergencyName,
        relationship: 'Primary Emergency Contact',
        phone: emergencyPhone
      }
    });
    onConfirm();
  };

  const handlePresetSelect = (preset: {
    name: string;
    studentId: string;
    department: string;
    year: string;
    email: string;
    phone: string;
  }) => {
    setName(preset.name);
    setStudentId(preset.studentId);
    setDepartment(preset.department);
    setYear(preset.year);
    setEmail(preset.email);
    setPhone(preset.phone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 relative animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[10px] font-bold mb-1">
              <ShieldCheck className="w-3 h-3" />
              <span>STUDENT VERIFICATION REQUIRED</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Confirm Student Profile
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm your verified student profile before submitting an incident report.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo Student Switcher */}
        <div className="px-6 pt-4 pb-2 bg-slate-50/30 border-b border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Quick 1-Click Profile Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Rohan Sharma', studentId: 'STU-882194', department: 'Computer Science & Engineering', year: '3rd Year (Junior)', email: 'r.sharma@university.edu', phone: '(555) 345-6789' },
              { name: 'Aanya Patel', studentId: 'STU-994321', department: 'Bioengineering', year: '2nd Year (Sophomore)', email: 'a.patel@university.edu', phone: '(555) 432-8765' },
              { name: 'Marcus Lee', studentId: 'STU-773120', department: 'Architecture', year: '4th Year (Senior)', email: 'm.lee@university.edu', phone: '(555) 567-1234' }
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(p)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                  studentId === p.studentId 
                    ? 'bg-brand-600 text-white border-brand-600 shadow-2xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
                }`}
              >
                {p.name} ({p.studentId})
              </button>
            ))}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveAndContinue} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Student ID
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Academic Year
              </label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
              >
                <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                <option value="4th Year (Senior)">4th Year (Senior)</option>
                <option value="Graduate / Researcher">Graduate / Researcher</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                University Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-900 block mb-2">
              Emergency Contact (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Contact Name (e.g. Parent/Guardian)"
                  value={emergencyName}
                  onChange={e => setEmergencyName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Contact Phone"
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Confirm & Proceed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
