import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { AuthService } from '../lib/authService';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { X, Mail, Lock, User, ArrowRight, LogIn, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Google Login Success from @react-oauth/google Popup
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      if (credentialResponse.credential) {
        const user = await AuthService.verifyGoogleIdToken(credentialResponse.credential);
        setIsLoading(false);
        onLoginSuccess(user);
        return;
      }
    } catch (e: any) {
      setIsLoading(false);
      setErrorMessage(e.message || 'Google Sign-In failed.');
    }
  };

  // Custom Popup Trigger via useGoogleLogin
  const loginWithGoogleCustom = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Fetch User Info using Access Token
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const payload = await userInfoRes.json();

        const user: UserProfile = {
          id: `usr-google-${payload.sub}`,
          name: payload.name || 'Google Creator',
          email: payload.email,
          avatar: payload.picture,
          isLoggedIn: true,
          authProvider: 'google',
          isGoogleLinked: true,
          emailVerified: payload.email_verified,
          createdAt: new Date().toISOString().split('T')[0]
        };

        AuthService.saveSession(user);
        setIsLoading(false);
        onLoginSuccess(user);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage('Failed to fetch Google profile: ' + err.message);
      }
    },
    onError: (error) => {
      console.error('Google OAuth Error:', error);
      setErrorMessage('Google Sign-In popup error or cancelled.');
    }
  });

  // Redirect Flow Fallback
  const handleGoogleOAuthRedirect = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await AuthService.startGoogleOAuthRedirect();
    } catch (e: any) {
      setIsLoading(false);
      setErrorMessage(e.message || 'Google OAuth redirect failed.');
    }
  };

  // Email & Password Form Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (mode !== 'forgot' && !password) || (mode === 'signup' && !name)) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    if (mode === 'forgot') {
      try {
        await AuthService.resetPassword(email, 'NewPassword123!');
        setIsLoading(false);
        setSuccessMessage(`Password reset successfully for ${email}. Check your inbox!`);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err.message || 'No registered account found with this email.');
      }
      return;
    }

    try {
      let user: UserProfile;
      if (mode === 'signup') {
        user = await AuthService.registerWithEmail(name, email, password);
      } else {
        user = await AuthService.loginWithEmail(email, password);
      }
      setIsLoading(false);
      onLoginSuccess(user);
    } catch (e: any) {
      setIsLoading(false);
      setErrorMessage(e.message || 'Authentication failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in overflow-y-auto">
      <div className="glass-card border border-white/15 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[95vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <LogIn className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-white font-heading">
              {mode === 'signin' ? 'Sign In to ShortsForge' : mode === 'signup' ? 'Create Your Account' : 'Reset Password'}
            </h2>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRIMARY AUTHENTICATION OPTIONS: Google Sign-In */}
        <div className="space-y-3">
          
          {/* 1. Official Google Identity Services GIS Component (No redirect URI mismatch) */}
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMessage('Google Sign-In failed or was closed.')}
              theme="filled_black"
              shape="pill"
              size="large"
              width="100%"
              text="continue_with"
            />
          </div>

          {/* 2. Custom Button with Google Popup OAuth */}
          <button
            onClick={() => loginWithGoogleCustom()}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white font-bold text-xs transition flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>One-Click Google OAuth Popup</span>
          </button>

          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-1">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> Official OAuth 2.0</span>
            <button
              onClick={handleGoogleOAuthRedirect}
              className="text-purple-400 hover:underline flex items-center gap-1"
            >
              Full Redirect Mode →
            </button>
          </div>

          <div className="relative flex items-center justify-center pt-2">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-zinc-950 px-3 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Or Email & Password</span>
          </div>
        </div>

        {/* Email & Password Form */}
        {successMessage ? (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs space-y-2 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
            <p>{successMessage}</p>
            <button
              onClick={() => { setMode('signin'); setSuccessMessage(''); }}
              className="text-white font-bold underline text-[11px] pt-1"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-xs">
            
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="font-bold text-zinc-300 block">Full Name</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3" />
                  <input
                    type="text"
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3" />
                <input
                  type="email"
                  placeholder="alex@creator.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-300 block">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setErrorMessage(''); }}
                      className="text-[11px] text-purple-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Authentication Notice:</span>
                </div>
                <p className="leading-tight">{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold text-xs shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>
                    {mode === 'signin' ? 'Sign In with Email' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Toggle Mode Footer */}
        <div className="text-center pt-2 text-xs text-zinc-400 border-t border-white/10">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => { setMode('signup'); setErrorMessage(''); setSuccessMessage(''); }} className="text-purple-400 font-bold hover:underline">
                Sign Up Free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => { setMode('signin'); setErrorMessage(''); setSuccessMessage(''); }} className="text-purple-400 font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
