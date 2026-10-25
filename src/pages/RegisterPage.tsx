import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  CreditCard,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Upload,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Printer,
  Key,
  AlertCircle,
  Copy,
  Scan,
} from 'lucide-react';
import { useElectionStore } from '../store/electionStore';
import { COUNTRIES, CONSTITUENCIES } from '../utils/seedData';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { submitApplication, t } = useElectionStore();

  const [step, setStep] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    email: '',
    mobile: '',
    countryCode: 'AE',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    lastIndianAddress: '',
    constituencyId: 'pc-01',
    passportDocBase64: '',
    photoDocBase64: '',
  });

  // Verification State
  const [enteredOtp, setEnteredOtp] = useState('');
  const [systemOtp, setSystemOtp] = useState<string | null>(null);
  const [isLivenessScanning, setIsLivenessScanning] = useState(false);
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [scanSecondsLeft, setScanSecondsLeft] = useState(3);
  const [agreedDeclaration, setAgreedDeclaration] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  // Auto-fill demo helper
  const handleAutoFill = () => {
    setFormData({
      fullName: 'Vikramaditya Roy',
      dob: '1990-08-14',
      gender: 'Male',
      email: 'vikram.roy@singapore-invest.sg',
      mobile: '+65 9812 3456',
      countryCode: 'SG',
      passportNumber: 'Z9821472',
      passportIssueDate: '2020-04-10',
      passportExpiryDate: '2030-04-09',
      lastIndianAddress: '14/B Central Avenue, Alipore, Kolkata, India',
      constituencyId: 'pc-09',
      passportDocBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="%231E3A8A"/><text x="20" y="40" fill="white" font-size="16">PASSPORT OF INDIA (SAMPLE)</text><text x="20" y="80" fill="%23FCD34D" font-size="14">EMIGRATION CHECK NOT REQUIRED</text></svg>',
      photoDocBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="%23E2E8F0"/><circle cx="75" cy="60" r="35" fill="%2394A3B8"/><path d="M20 140 Q75 90 130 140 Z" fill="%2364748B"/></svg>',
    });
    setLivenessPassed(true);
    setSystemOtp('782910');
    setEnteredOtp('782910');
    setAgreedDeclaration(true);
    setToastMessage('Auto-filled with realistic NRI applicant data!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Mock OTP Generation
  const handleRequestOtp = () => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setSystemOtp(generated);
    setToastMessage(`Simulated OTP sent to ${formData.mobile || 'mobile'}: ${generated}`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  // Simulated 3-second Liveness Check
  const startLivenessScan = () => {
    setIsLivenessScanning(true);
    setScanSecondsLeft(3);

    const interval = setInterval(() => {
      setScanSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsLivenessScanning(false);
          setLivenessPassed(true);
          setToastMessage('Biometric liveness confirmed! Face & gaze verified.');
          setTimeout(() => setToastMessage(null), 4000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Document upload mock
  const handleFileUpload = (field: 'passportDocBase64' | 'photoDocBase64', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit
  const handleSubmit = async () => {
    const country = COUNTRIES.find(c => c.code === formData.countryCode);
    const constituency = CONSTITUENCIES.find(c => c.id === formData.constituencyId);

    const ref = await submitApplication({
      fullName: formData.fullName,
      dob: formData.dob,
      gender: formData.gender,
      email: formData.email,
      mobile: formData.mobile,
      countryCode: formData.countryCode,
      countryName: country ? country.name : 'Overseas',
      passportNumber: formData.passportNumber.toUpperCase(),
      passportIssueDate: formData.passportIssueDate,
      passportExpiryDate: formData.passportExpiryDate,
      lastIndianAddress: formData.lastIndianAddress,
      constituencyId: formData.constituencyId,
      constituencyName: constituency ? constituency.name : 'Unknown Constituency',
      passportDocBase64: formData.passportDocBase64 || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="%231E3A8A"/><text x="20" y="40" fill="white">PASSPORT</text></svg>',
      photoDocBase64: formData.photoDocBase64 || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="%23CBD5E1"/></svg>',
    });

    setSubmittedRefId(ref);
    setStep(5);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-govNavy text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-govSaffron flex items-center gap-3 animate-fade-in text-sm">
          <Sparkles className="w-5 h-5 text-govSaffron animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Title */}
      <div className="bg-ivory border border-warmBorder rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-govSaffron uppercase tracking-wider">
            Election Commission of India Prototype • Form 6A-Sim
          </span>
          <h2 className="text-2xl font-serif font-bold text-govNavy">
            Application for Overseas Elector Registration
          </h2>
          <p className="text-xs text-charcoal-muted">
            For Indian citizens residing abroad who have not acquired citizenship of any other country.
          </p>
        </div>

        <button
          onClick={handleAutoFill}
          className="px-3.5 py-2 bg-cream-200 border border-warmBorder hover:bg-cream-300 text-govNavy rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-govSaffron" />
          <span>Auto-fill Demo Data</span>
        </button>
      </div>

      {/* Step Tracker */}
      <div className="bg-ivory border border-warmBorder rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { num: 1, label: 'Personal Details', icon: User },
            { num: 2, label: 'Passport & Constituency', icon: CreditCard },
            { num: 3, label: 'Documents', icon: Upload },
            { num: 4, label: 'Liveness & OTP', icon: ShieldCheck },
            { num: 5, label: 'Acknowledgement', icon: CheckCircle2 },
          ].map(s => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition shadow-sm ${
                    isCompleted
                      ? 'bg-govGreen text-white'
                      : isCurrent
                      ? 'bg-govNavy text-white ring-4 ring-govNavy/20'
                      : 'bg-cream-200 text-charcoal-muted border border-warmBorder'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`mt-2 hidden sm:block text-[11px] ${
                    isCurrent ? 'font-bold text-govNavy' : 'text-charcoal-muted font-medium'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Forms */}
      <div className="bg-ivory border border-warmBorder rounded-xl p-6 shadow-sm">
        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-govNavy border-b border-warmBorder pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-govNavy text-white text-xs flex items-center justify-center">1</span>
              Personal Particulars
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-charcoal mb-1">Full Name (As per Passport) *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Vikramaditya Roy"
                  className="w-full p-2.5 rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-charcoal mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-charcoal mb-1">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Third Gender">Third Gender</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-charcoal mb-1">Country of Overseas Residence *</label>
                <select
                  value={formData.countryCode}
                  onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy bg-white"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.dialCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-charcoal mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. vikram.roy@example.com"
                  className="w-full p-2.5 rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-charcoal mb-1">Mobile Number (with country code) *</label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="e.g. +65 9812 3456"
                  className="w-full p-2.5 rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy bg-white"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => {
                  if (!formData.fullName) {
                    alert('Please enter your full name or click Auto-fill Demo Data.');
                    return;
                  }
                  setStep(2);
                }}
                className="px-5 py-2.5 bg-govNavy text-white rounded-lg font-semibold text-xs hover:bg-govNavy-light transition flex items-center gap-1.5 shadow"
              >
                <span>Proceed to Passport Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Indian Passport Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-govNavy border-b border-warmBorder pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-govNavy text-white text-xs flex items-center justify-center">2</span>
              Indian Passport & Parliamentary Constituency
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-charcoal mb-1">Indian Passport Number (Letter + 7 Digits) *</label>
                <input
                  type="text"
                  value={formData.passportNumber}
                  onChange={e => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. Z9821472"
                  className="w-full p-2.5 rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy font-mono uppercase bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-charcoal mb-1">Home Parliamentary Constituency in India *</label>
                <select
                  value={formData.constituencyId}
                  onChange={e => setFormData({ ...formData, constituencyId: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy bg-white"
                >
                  {CONSTITUENCIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.state} - {c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-charcoal mb-1">Passport Issue Date *</label>
                <input
                  type="date"
                  value={formData.passportIssueDate}
                  onChange={e => setFormData({ ...formData, passportIssueDate: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-charcoal mb-1">Passport Expiry Date *</label>
                <input
                  type="date"
                  value={formData.passportExpiryDate}
                  onChange={e => setFormData({ ...formData, passportExpiryDate: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-charcoal mb-1">Last Place of Ordinary Residence in India *</label>
                <textarea
                  rows={2}
                  value={formData.lastIndianAddress}
                  onChange={e => setFormData({ ...formData, lastIndianAddress: e.target.value })}
                  placeholder="House number, Street, Ward/Town, District, State, PIN code"
                  className="w-full p-2.5 rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy bg-white"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-warmBorder text-charcoal rounded-lg font-medium text-xs hover:bg-cream-100 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => {
                  if (!formData.passportNumber) {
                    alert('Please enter your passport number.');
                    return;
                  }
                  setStep(3);
                }}
                className="px-5 py-2.5 bg-govNavy text-white rounded-lg font-semibold text-xs hover:bg-govNavy-light transition flex items-center gap-1.5 shadow"
              >
                <span>Proceed to Documents</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Document Uploads */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-govNavy border-b border-warmBorder pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-govNavy text-white text-xs flex items-center justify-center">3</span>
              Document Uploads (Stored as Base64)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* Passport Copy */}
              <div className="border border-dashed border-warmBorder rounded-xl p-4 bg-cream-50 flex flex-col items-center justify-center text-center space-y-2">
                <FileText className="w-8 h-8 text-govNavy" />
                <span className="font-semibold text-govNavy">Indian Passport Scan (Bio Page)</span>
                <p className="text-[11px] text-charcoal-muted">Accepted formats: JPG, PNG, PDF</p>
                <label className="cursor-pointer px-3 py-1.5 bg-govNavy text-white rounded font-medium hover:bg-govNavy-light transition text-xs">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload('passportDocBase64', e)}
                    className="hidden"
                  />
                </label>
                {formData.passportDocBase64 && (
                  <div className="mt-2 w-full p-2 bg-white rounded border border-warmBorder text-center">
                    <span className="text-[11px] text-govGreen font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passport Document Attached
                    </span>
                  </div>
                )}
              </div>

              {/* Voter Photograph */}
              <div className="border border-dashed border-warmBorder rounded-xl p-4 bg-cream-50 flex flex-col items-center justify-center text-center space-y-2">
                <Camera className="w-8 h-8 text-govSaffron" />
                <span className="font-semibold text-govNavy">Recent Passport Size Photograph</span>
                <p className="text-[11px] text-charcoal-muted">Frontal facial photograph with plain background</p>
                <label className="cursor-pointer px-3 py-1.5 bg-govNavy text-white rounded font-medium hover:bg-govNavy-light transition text-xs">
                  Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload('photoDocBase64', e)}
                    className="hidden"
                  />
                </label>
                {formData.photoDocBase64 && (
                  <div className="mt-2 w-full p-2 bg-white rounded border border-warmBorder text-center">
                    <span className="text-[11px] text-govGreen font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Photograph Attached
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-warmBorder text-charcoal rounded-lg font-medium text-xs hover:bg-cream-100 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-5 py-2.5 bg-govNavy text-white rounded-lg font-semibold text-xs hover:bg-govNavy-light transition flex items-center gap-1.5 shadow"
              >
                <span>Proceed to Biometric & OTP Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Mock Identity Verification (OTP + 3s Liveness scan) */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-lg text-govNavy border-b border-warmBorder pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-govNavy text-white text-xs flex items-center justify-center">4</span>
              Mock Biometric Liveness & Mobile OTP Verification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Liveness Check Card */}
              <div className="border border-warmBorder rounded-xl p-5 bg-white space-y-3 flex flex-col items-center text-center">
                <div className="w-full relative bg-charcoal rounded-lg h-44 flex flex-col items-center justify-center overflow-hidden border-2 border-govNavy/40">
                  {isLivenessScanning ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center text-white">
                      <Scan className="w-16 h-16 text-emerald-400 animate-pulse" />
                      <div className="absolute inset-x-0 h-1 bg-emerald-400/80 animate-bounce" />
                      <span className="text-xs font-mono font-bold mt-2">
                        Analyzing 3D facial depth... ({scanSecondsLeft}s)
                      </span>
                    </div>
                  ) : livenessPassed ? (
                    <div className="flex flex-col items-center justify-center text-white space-y-1">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      </div>
                      <span className="text-xs font-bold text-emerald-300">Liveness Confirmed (Simulated)</span>
                      <span className="text-[10px] text-cream-200">Gaze, blink & biometric signature verified</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-cream-300/80 space-y-2">
                      <Camera className="w-10 h-10 opacity-60" />
                      <span className="text-xs">Webcam placeholder (No real hardware required)</span>
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <button
                    onClick={startLivenessScan}
                    disabled={isLivenessScanning || livenessPassed}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${
                      livenessPassed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-govNavy text-white hover:bg-govNavy-light'
                    }`}
                  >
                    {livenessPassed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Biometrics Verified</span>
                      </>
                    ) : (
                      <>
                        <Scan className="w-4 h-4" />
                        <span>Start 3-Second Liveness Scan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* OTP Verification Card */}
              <div className="border border-warmBorder rounded-xl p-5 bg-white space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-govSaffron" />
                  <h4 className="font-bold text-sm text-govNavy">Simulated One-Time Password (OTP)</h4>
                </div>
                <p className="text-xs text-charcoal-muted">
                  Click below to generate a simulated OTP (shown via toast and in your top Outbox).
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={handleRequestOtp}
                    className="px-3 py-2 bg-cream-200 border border-warmBorder hover:bg-cream-300 text-govNavy font-semibold text-xs rounded-lg transition"
                  >
                    Request OTP
                  </button>
                  {systemOtp && (
                    <span className="text-xs font-mono font-bold text-govGreen self-center">
                      (Generated: {systemOtp})
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={e => setEnteredOtp(e.target.value)}
                    placeholder="e.g. 782910"
                    className="w-full p-2.5 text-center font-mono text-base tracking-widest rounded-lg border border-warmBorder focus:outline-none focus:ring-2 focus:ring-govNavy bg-cream-50"
                  />
                </div>

                {/* Declaration Checkbox */}
                <div className="pt-2 border-t border-warmBorder">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-charcoal">
                    <input
                      type="checkbox"
                      checked={agreedDeclaration}
                      onChange={e => setAgreedDeclaration(e.target.checked)}
                      className="mt-0.5 rounded text-govNavy focus:ring-govNavy"
                    />
                    <span>
                      I declare that I am an Indian citizen holding a valid passport and I have not acquired citizenship of any other nation. All submitted data is true.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 border border-warmBorder text-charcoal rounded-lg font-medium text-xs hover:bg-cream-100 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!agreedDeclaration}
                className={`px-6 py-2.5 rounded-lg font-bold text-xs transition flex items-center gap-1.5 shadow-md ${
                  agreedDeclaration
                    ? 'bg-govGreen text-white hover:bg-govGreen-dark'
                    : 'bg-cream-300 text-charcoal-muted cursor-not-allowed'
                }`}
              >
                <span>Submit Form 6A Application</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Acknowledgement & Status */}
        {step === 5 && submittedRefId && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-2 border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-govSaffron uppercase tracking-wider">
                Application Successfully Logged
              </span>
              <h3 className="font-serif font-bold text-2xl text-govNavy">
                Overseas Voter Registration Acknowledgement
              </h3>
              <p className="text-xs text-charcoal-muted max-w-lg mx-auto">
                Your application has been received by the Electoral Registration Officer (ERO). Keep your Reference ID for status tracking.
              </p>
            </div>

            {/* Reference ID card */}
            <div className="bg-cream-100 border border-warmBorder p-4 rounded-xl max-w-md mx-auto space-y-2 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-charcoal-muted">Application Reference ID:</span>
                <span className="font-mono font-bold text-govNavy text-sm bg-white px-2 py-0.5 rounded border border-warmBorder">
                  {submittedRefId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-charcoal-muted">Applicant Name:</span>
                <span className="font-bold text-charcoal">{formData.fullName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-charcoal-muted">Home Constituency:</span>
                <span className="font-bold text-charcoal">{CONSTITUENCIES.find(c => c.id === formData.constituencyId)?.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-charcoal-muted">Current Status:</span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-bold">
                  PENDING REVIEW
                </span>
              </div>
            </div>

            {/* Presentation Helper Banner */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto text-xs text-blue-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                <strong>Next Demo Step:</strong> Switch to the <strong>Election Officer Portal</strong> to review documents and approve this application to enroll their keys on-chain!
              </span>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-cream-200 border border-warmBorder text-govNavy font-semibold text-xs rounded-lg hover:bg-cream-300 transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Acknowledgement
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="px-5 py-2 bg-govNavy text-white font-semibold text-xs rounded-lg hover:bg-govNavy-light transition shadow flex items-center gap-1.5"
              >
                <span>Go to Admin Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
