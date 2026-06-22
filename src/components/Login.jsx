import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Scale, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error: authError, clearError, skipAuthLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const queryError = searchParams.get('error');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    // Client-side validations
    if (!email.trim() || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      // Error is stored and handled in AuthContext
      console.error('Login submission failed:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = validationError || queryError || authError;

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
            Lexora
          </h2>
          <span className="block text-[10px] tracking-[0.2em] text-[#a67c52] font-semibold uppercase -mt-1">
            Legal Blueprints
          </span>
        </Link>
        <h3 className="mt-6 text-center font-serif text-2xl font-bold tracking-tight text-[#101B33]">
          Sign in to your account
        </h3>
        <p className="mt-2 text-center text-sm text-[#101B33]/60">
          Or{' '}
          <Link to="/signup" className="font-semibold text-[#a67c52] hover:text-[#a67c52]/80 transition-colors">
            create a new account
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
                    if (queryError) {
                      navigate('/login', { replace: true });
                    }
                  }}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-[#101B33]/15 text-[#101B33] placeholder-[#101B33]/30 focus:outline-none focus:ring-1 focus:ring-[#a67c52] focus:border-[#a67c52] transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#101B33]/60 mb-2">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-[#101B33]/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setValidationError('');
                    clearError();
                    if (queryError) {
                      navigate('/login', { replace: true });
                    }
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
                className="w-full bg-[#101B33] hover:bg-[#1B2A4A] text-[#fdfbf7] font-medium px-6 py-3.5 rounded-xl shadow-md border-b-2 border-[#a67c52]/50 hover:shadow-lg active:translate-y-[1px] disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#101B33]/10"></div>
            </div>
            <span className="relative px-3 bg-white text-[10px] text-[#101B33]/40 uppercase font-bold tracking-wider">
              Or continue with
            </span>
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                clearError();
                window.location.href = '/api/auth/google';
              }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-[#101B33]/15 rounded-xl bg-white hover:bg-slate-50 text-sm font-semibold text-[#101B33] shadow-sm hover:shadow-md transition-all active:translate-y-[1px] cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          {/* TEMPORARY - REMOVE BEFORE REAL LAUNCH */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                skipAuthLogin();
                navigate('/dashboard');
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 border border-[#a67c52]/30 rounded-xl bg-[#fdfbf7] hover:bg-[#a67c52]/10 text-sm font-semibold text-[#a67c52] shadow-sm hover:shadow-md transition-all active:translate-y-[1px] cursor-pointer"
            >
              Demo Login (Skip Auth)
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#101B33]/5 text-center text-xs text-[#101B33]/40">
            Secure, encrypted authentication. By signing in you agree to Lexora's Terms of Service.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
