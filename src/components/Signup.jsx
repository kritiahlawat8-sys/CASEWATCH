import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Scale, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signup, error: authError, clearError } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Client-side validations
    if (!email.trim() || !password || !confirmPassword) {
      setValidationError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signup(email.trim(), password);
      // Success auto-logs in and sets context, then we navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Error is caught and stored in AuthContext
      console.error('Signup submission failed:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = validationError || authError;

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative Blur Accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#a67c52]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#101B33]/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex flex-col items-center gap-2 group">
          <div className="bg-[#101B33] group-hover:bg-[#1B2A4A] transition-all p-3.5 rounded-2xl text-[#fdfbf7] flex items-center justify-center shadow-lg border border-[#a67c52]/30">
            <Scale className="h-8 w-8 text-[#a67c52] stroke-[1.8]" />
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#101B33]">
            CaseWatch
          </h2>
          <span className="block text-[10px] tracking-[0.2em] text-[#a67c52] font-semibold uppercase -mt-1">
            Legal Blueprints
          </span>
        </Link>
        <h3 className="mt-6 text-center font-serif text-2xl font-bold tracking-tight text-[#101B33]">
          Create a new account
        </h3>
        <p className="mt-2 text-center text-sm text-[#101B33]/60">
          Or{' '}
          <Link to="/login" className="font-semibold text-[#a67c52] hover:text-[#a67c52]/80 transition-colors">
            log in to your account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl border border-[#101B33]/5 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {activeError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start gap-3.5 animate-in zoom-in-95 duration-200">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-relaxed">{activeError}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#101B33]/60 mb-2">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-[#101B33]/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationError('');
                    clearError();
                  }}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-[#101B33]/15 text-[#101B33] placeholder-[#101B33]/30 focus:outline-none focus:ring-1 focus:ring-[#a67c52] focus:border-[#a67c52] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#101B33]/60 mb-2">
                Password (min 8 chars)
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-[#101B33]/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setValidationError('');
                    clearError();
                  }}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-[#101B33]/15 text-[#101B33] placeholder-[#101B33]/30 focus:outline-none focus:ring-1 focus:ring-[#a67c52] focus:border-[#a67c52] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold uppercase tracking-wider text-[#101B33]/60 mb-2">
                Confirm Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-[#101B33]/40" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setValidationError('');
                    clearError();
                  }}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-[#101B33]/15 text-[#101B33] placeholder-[#101B33]/30 focus:outline-none focus:ring-1 focus:ring-[#a67c52] focus:border-[#a67c52] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#101B33] hover:bg-[#1B2A4A] text-[#fdfbf7] font-medium px-6 py-3.5 rounded-xl shadow-md border-b-2 border-[#a67c52]/50 hover:shadow-lg active:translate-y-[1px] disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#101B33]/5 text-center text-xs text-[#101B33]/40">
            Secure, encrypted authentication. By signing up you agree to CaseWatch's Terms of Service.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
