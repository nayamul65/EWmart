import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import { 
  ShieldAlert, 
  XCircle, 
  CheckCircle, 
  Check, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Share2, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { registerSeller } from '../../lib/store';

export interface SellerRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (sellerId: string) => void;
}

const DEPARTMENTS = [
  { value: '', label: 'Select Department...' },
  { value: 'CSE', label: 'Computer Science & Engineering (CSE)' },
  { value: 'EEE', label: 'Electrical & Electronic Engineering (EEE)' },
  { value: 'BBA', label: 'Business Administration (BBA)' },
  { value: 'Economics', label: 'Economics' },
  { value: 'English', label: 'English' },
  { value: 'Pharmacy', label: 'Pharmacy' },
  { value: 'Genetic Engineering', label: 'Genetic Engineering & Biotechnology' },
  { value: 'Sociology', label: 'Sociology' },
  { value: 'Law', label: 'Law' },
  { value: 'Other', label: 'Other Department' },
];

const MEETUP_SPOTS = [
  'Library',
  'Cafeteria',
  'Ground Floor Plaza',
  'Gate 2',
  'Main Gate',
  'Auditorium Lobby',
  'Student Lounge',
];

export const SellerRegisterModal: React.FC<SellerRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // Step 2 State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [bio, setBio] = useState('');

  // Step 2 Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 3 State
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
  const [step3Error, setStep3Error] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setStep(1);
    setAgreedToPolicy(false);
    setName('');
    setEmail('');
    setStudentId('');
    setDepartment('');
    setWhatsappNumber('');
    setFacebookUrl('');
    setInstagramUrl('');
    setBio('');
    setErrors({});
    setSelectedSpots([]);
    setStep3Error('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Step 2 Blur/Submit Validation
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Full Name is required';
    }

    if (!email.trim()) {
      errs.email = 'EWU Email address is required';
    } else if (!email.trim().endsWith('@ewubd.edu')) {
      errs.email = 'Must be an official student email ending with @ewubd.edu';
    }

    if (!studentId.trim()) {
      errs.studentId = 'Student ID is required';
    } else if (!/^\d{4}-\d-\d{2}-\d{3}$/.test(studentId.trim())) {
      errs.studentId = 'Invalid format. Example: 2023-1-60-045';
    }

    if (!department) {
      errs.department = 'Please select your academic department';
    }

    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    if (!cleanNumber) {
      errs.whatsapp = 'WhatsApp number is required';
    } else if (cleanNumber.length < 10 || cleanNumber.length > 11) {
      errs.whatsapp = 'Please enter 10 to 11 Bangladeshi mobile digits';
    }

    if (facebookUrl.trim() && !facebookUrl.startsWith('http://') && !facebookUrl.startsWith('https://')) {
      errs.facebookUrl = 'URL must start with https://';
    }

    if (instagramUrl.trim() && !instagramUrl.startsWith('http://') && !instagramUrl.startsWith('https://')) {
      errs.instagramUrl = 'URL must start with https://';
    }

    if (bio.length > 120) {
      errs.bio = 'Bio cannot exceed 120 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      setStep(3);
    }
  };

  const toggleSpot = (spot: string) => {
    if (selectedSpots.includes(spot)) {
      setSelectedSpots(selectedSpots.filter((s) => s !== spot));
    } else {
      setSelectedSpots([...selectedSpots, spot]);
    }
    if (step3Error) setStep3Error('');
  };

  const handleSubmit = async () => {
    if (selectedSpots.length === 0) {
      setStep3Error('Please select at least 1 campus meetup spot');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanDigits = whatsappNumber.replace(/\D/g, '');
      const normalizedWhatsapp = cleanDigits.startsWith('880') 
        ? `+${cleanDigits}` 
        : cleanDigits.startsWith('0') 
          ? `+88${cleanDigits}` 
          : `+880${cleanDigits}`;

      const newSeller = await registerSeller({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        studentId: studentId.trim(),
        department,
        whatsapp: normalizedWhatsapp,
        facebookUrl: facebookUrl.trim() || undefined,
        instagramUrl: instagramUrl.trim() || undefined,
        bio: bio.trim() || undefined,
        meetupSpots: selectedSpots,
      });

      setIsSubmitting(false);
      setStep(4);
      if (onSuccess) {
        onSuccess(newSeller.id);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setStep3Error('Failed to register seller. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="xl" showCloseButton={step !== 4}>
      <div className="w-full">
        {/* Slim Top Progress Segment Bar */}
        {step !== 4 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span className={step >= 1 ? 'text-[#0F2C59]' : ''}>1. Safety Policy</span>
              <span className={step >= 2 ? 'text-[#0F2C59]' : ''}>2. Your Details</span>
              <span className={step >= 3 ? 'text-[#0F2C59]' : ''}>3. Campus Meetups</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-[#0F2C59]' : 'bg-slate-200'}`} />
              <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-[#0F2C59]' : 'bg-slate-200'}`} />
              <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-[#0F2C59]' : 'bg-slate-200'}`} />
            </div>
          </div>
        )}

        {/* STEP 1: SAFETY POLICY */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#0F2C59] tracking-tight">
                Before you sell on EWmart
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Please review our campus trading standards and safety guidelines.
              </p>
            </div>

            {/* Amber Policy Box */}
            <div className="bg-[#FEF3C7] border-l-4 border-[#D97706] p-4 rounded-r-xl">
              <div className="flex items-center gap-2 text-[#D97706] font-bold text-sm mb-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Prohibited on EWmart</span>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-amber-950">
                <li className="flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>Drugs, alcohol, tobacco, and vape products</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>Weapons and anything meant to cause harm</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>Exam papers, leaked questions, or answer keys</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>Stolen, counterfeit, or fake-ID items</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>Anything breaking Bangladesh law or EWU code of conduct</span>
                </li>
              </ul>
            </div>

            {/* Green Safe Trading Box */}
            <div className="bg-emerald-50 border-l-4 border-[#00A86B] p-4 rounded-r-xl">
              <div className="flex items-center gap-2 text-[#00A86B] font-bold text-sm mb-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-[#00A86B]" />
                <span>Campus Safe Trading Guidelines</span>
              </div>
              <ul className="space-y-1.5 text-xs font-medium text-emerald-900">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00A86B] shrink-0 mt-0.5" />
                  <span>Meet on campus in public spots during daylight hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00A86B] shrink-0 mt-0.5" />
                  <span>Bring a friend along for high-value tech item exchanges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00A86B] shrink-0 mt-0.5" />
                  <span>Inspect physical items thoroughly before completing payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#00A86B] shrink-0 mt-0.5" />
                  <span>Report suspicious behavior to staff moderation team immediately</span>
                </li>
              </ul>
            </div>

            {/* Mandatory Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 transition-colors cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToPolicy}
                  onChange={(e) => setAgreedToPolicy(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0F2C59] focus:ring-[#0F2C59]"
                />
                <span className="text-xs font-bold text-slate-800 leading-snug">
                  I have read the policy and agree not to list prohibited items on EWmart.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={!agreedToPolicy}
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: YOUR DETAILS */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#0F2C59] tracking-tight">
                Seller Verification Details
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Verified identity ensures a safe community for all EWU students.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Full Name"
                placeholder="e.g. Tanvir Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                leftAddon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="EWU Student Email"
                placeholder="2023-1-60-045@ewubd.edu"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                leftAddon={<Mail className="w-4 h-4" />}
                helperText="Must end with @ewubd.edu"
                required
              />

              <Input
                label="Student ID Number"
                placeholder="2023-1-60-045"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                error={errors.studentId}
                leftAddon={<GraduationCap className="w-4 h-4" />}
                helperText="Format: 2023-1-60-045"
                required
              />

              <Select
                label="Academic Department"
                options={DEPARTMENTS}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                error={errors.department}
                required
              />
            </div>

            {/* WhatsApp Number with Fixed +880 Prefix */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="h-11 px-3.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+880</span>
                </div>
                <input
                  type="tel"
                  placeholder="1712345678"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className={`w-full h-11 bg-white border ${
                    errors.whatsapp ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-[#0F2C59]/15 focus:border-[#0F2C59]'
                  } rounded-r-xl px-3.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                  required
                />
              </div>
              {errors.whatsapp ? (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.whatsapp}</p>
              ) : (
                <p className="mt-1 text-xs text-slate-500 font-normal">Buyers will contact you directly on WhatsApp for campus pickups.</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Facebook Profile / Shop URL (Optional)"
                placeholder="https://facebook.com/username"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                error={errors.facebookUrl}
                leftAddon={<Share2 className="w-4 h-4" />}
              />

              <Input
                label="Instagram Handle URL (Optional)"
                placeholder="https://instagram.com/username"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                error={errors.instagramUrl}
                leftAddon={<Share2 className="w-4 h-4" />}
              />
            </div>

            <Textarea
              label="Short Bio (Optional)"
              placeholder="e.g. 3rd year CSE student selling engineering textbooks and lab gadgets."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              error={errors.bio}
              rows={2}
              helperText={`${bio.length}/120 characters max`}
            />

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Next: Meetup Spots
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: CAMPUS MEETUP SPOTS */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#0F2C59] tracking-tight">
                Where will you meet buyers?
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Select your preferred safe handover locations on the Aftabnagar campus (select at least 1).
              </p>
            </div>

            {step3Error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {step3Error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MEETUP_SPOTS.map((spot) => {
                const isSelected = selectedSpots.includes(spot);
                return (
                  <button
                    key={spot}
                    type="button"
                    onClick={() => toggleSpot(spot)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F2C59] border-[#0F2C59] text-white shadow-md'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold">{spot}</span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#00A86B] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0F2C59] shrink-0" />
              <span>Selected spots: <strong className="text-[#0F2C59]">{selectedSpots.length > 0 ? selectedSpots.join(', ') : 'None'}</strong></span>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <Button variant="secondary" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button
                variant="primary"
                isLoading={isSubmitting}
                onClick={handleSubmit}
                rightIcon={<Check className="w-4 h-4 text-emerald-400" />}
              >
                Submit for Approval
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION VIEW */}
        {step === 4 && (
          <div className="py-6 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00A86B] flex items-center justify-center animate-bounce">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#0F2C59] tracking-tight">
                Request received
              </h2>
              <p className="text-sm font-semibold text-emerald-700">
                EWmart Seller Registration Submitted
              </p>
            </div>

            <p className="text-xs text-slate-600 max-w-md leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              We review new sellers within 24 hours. You will be able to post listings as soon as your @ewubd.edu student identity is verified by staff.
            </p>

            <div className="pt-4 w-full max-w-xs">
              <Button className="w-full" variant="primary" onClick={handleClose}>
                Back to marketplace
              </Button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};

export default SellerRegisterModal;
