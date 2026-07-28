import type { UserProfile } from '../types';
import { CURRENT_USER } from './mockData';

const SESSION_KEY = 'shortsforge_user_session';

export class AuthService {
  /**
   * Get current persisted session from localStorage or default signed-in user
   */
  static getSession(): UserProfile {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Fallback
    }

    const defaultUser: UserProfile = {
      ...CURRENT_USER,
      authProvider: 'google',
      isGoogleLinked: true,
      emailVerified: true,
      createdAt: '2026-01-15'
    };
    
    this.saveSession(defaultUser);
    return defaultUser;
  }

  /**
   * Save session to localStorage
   */
  static saveSession(user: UserProfile): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (e) {
      // Fallback
    }
  }

  /**
   * Clear session on Sign Out
   */
  static clearSession(): UserProfile {
    const loggedOutUser: UserProfile = {
      id: 'guest',
      name: 'Guest User',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isLoggedIn: false
    };
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      // Fallback
    }
    return loggedOutUser;
  }

  /**
   * Simulate 1-Click Google OAuth Sign-In Flow
   */
  static async signInWithGoogle(): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 1000));
    const googleUser: UserProfile = {
      id: `usr-google-${Date.now()}`,
      name: 'Alex Rivera (Google)',
      email: 'alex.rivera@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isLoggedIn: true,
      authProvider: 'google',
      isGoogleLinked: true,
      emailVerified: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.saveSession(googleUser);
    return googleUser;
  }

  /**
   * Simulate Email/Password Sign-In
   */
  static async signInWithEmail(email: string): Promise<UserProfile> {
    await new Promise(r => setTimeout(r, 900));
    const emailUser: UserProfile = {
      id: `usr-email-${Date.now()}`,
      name: email.split('@')[0] || 'Creator User',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      isLoggedIn: true,
      authProvider: 'email',
      isGoogleLinked: false,
      emailVerified: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.saveSession(emailUser);
    return emailUser;
  }

  /**
   * Link Google account to an existing user profile
   */
  static linkGoogleAccount(currentUser: UserProfile): UserProfile {
    const updatedUser: UserProfile = {
      ...currentUser,
      isGoogleLinked: true
    };
    this.saveSession(updatedUser);
    return updatedUser;
  }
}
