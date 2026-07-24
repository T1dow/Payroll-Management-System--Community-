import React, { useState, useRef, useEffect } from 'react';
import {
  Eye, EyeOff, LogIn, Shield, Building2, Users, TrendingUp,
  ChevronRight, Lock, Mail, CheckCircle, AlertCircle, Star
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { authenticate, ROLE_CATEGORIES } from '../data/mockUsers';
import { User } from '../App';
import { useCurrency } from '../context/CurrencyContext';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

// Raw numeric values so the currency context can format them dynamically
const STATS_RAW = [
  { label: 'Employees',         value: null,     display: '2,847',  icon: Users     },
  { label: 'Payroll Processed', value: 44890750, display: null,     icon: TrendingUp },
  { label: 'Compliance Score',  value: null,     display: '98.2%',  icon: Shield    },
  { label: 'Locations',         value: null,     display: '6',      icon: Building2 },
];

const FEATURES = [
  'Multi-level approval workflows',
  'Real-time payroll processing',
  'Statutory compliance (ESI/PF/TDS)',
  'Role-based access control',
  'Comprehensive audit trail',
  'Automated payslip generation',
];

const LEVEL_COLORS: Record<number, string> = {
  5: 'bg-purple-100 text-purple-700 border-purple-200',
  4: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  3: 'bg-blue-100 text-blue-700 border-blue-200',
  2: 'bg-teal-100 text-teal-700 border-teal-200',
  1: 'bg-gray-100 text-gray-600 border-gray-200',
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const { fmt } = useCurrency();
  const STATS = STATS_RAW.map(s => ({
    ...s,
    value: s.value !== null ? fmt(s.value) : s.display!,
  }));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [animatedStats, setAnimatedStats] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => setAnimatedStats(true), 300);
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate network latency
    await new Promise(r => setTimeout(r, 800));
    const user = authenticate(email, password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password. Please try the demo accounts below.');
      setLoading(false);
    }
  };

  const quickLogin = (roleEmail: string, rolePassword: string) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
    setError('');
  };

  const immediateLogin = async (roleEmail: string, rolePassword: string) => {
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const user = authenticate(roleEmail, rolePassword);
    if (user) onLogin(user);
    else setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel — Branding ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex-col relative overflow-hidden">
        {/* Mesh pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-indigo-400 rounded-full opacity-10 blur-3xl" />

        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">PayrollPro</h1>
              <p className="text-blue-300 text-xs font-medium">Enterprise HRMS</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Payroll management<br />
              <span className="text-blue-300">redefined for India.</span>
            </h2>
            <p className="text-blue-200 text-base leading-relaxed max-w-sm">
              A unified platform for payroll processing, compliance, and workforce management — built for enterprise scale.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className={`bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10 transition-all duration-700 ${animatedStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon className="h-4 w-4 text-blue-300" />
                  <span className="text-blue-300 text-xs">{label}</span>
                </div>
                <p className="text-white text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-2">
            {FEATURES.map(feature => (
              <div key={feature} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="text-blue-200 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 flex items-center justify-between">
            <p className="text-blue-400 text-xs">© 2025 PayrollPro · TechCorp Industries Ltd.</p>
            <Badge className="bg-white/10 text-blue-200 border-white/20 text-xs">v4.2.1</Badge>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ─────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-background">
        <div className="flex-1 flex flex-col justify-center px-8 py-10 max-w-xl mx-auto w-full">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center space-x-3 mb-8">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PayrollPro</h1>
              <p className="text-muted-foreground text-xs">Enterprise HRMS</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
            <p className="text-muted-foreground mt-1">
              Access your payroll management portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  ref={emailRef}
                  type="email"
                  placeholder="you@techcorp.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  className="pl-10 h-11"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  className="pl-10 pr-10 h-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border border-border accent-primary"
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Keep me signed in</Label>
            </div>

            {error && (
              <div className="flex items-start space-x-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />Signing in…</>
              ) : (
                <><LogIn className="h-4 w-4 mr-2" />Sign In</>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center space-x-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">DEMO ACCOUNTS</span>
            <Separator className="flex-1" />
          </div>

          {/* Demo Account Selector */}
          <div>
            <p className="text-xs text-muted-foreground mb-3">Select a role to instantly explore that user's dashboard and permissions:</p>

            {/* Category tabs */}
            <div className="flex space-x-1 mb-4 bg-muted rounded-lg p-1">
              {ROLE_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(i)}
                  className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${
                    activeCategory === i
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.label.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Role cards */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {ROLE_CATEGORIES[activeCategory].roles.map(role => (
                <div
                  key={role.email}
                  className={`group flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${
                    email === role.email ? 'border-primary bg-primary/5' : 'border-border bg-card'
                  }`}
                  onClick={() => quickLogin(role.email, role.password)}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ROLE_CATEGORIES[activeCategory].color} text-white`}>
                      {role.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{role.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{role.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    <Badge variant="outline" className={`text-xs ${LEVEL_COLORS[role.level] || ''}`}>
                      L{role.level}
                    </Badge>
                    <button
                      onClick={e => { e.stopPropagation(); immediateLogin(role.email, role.password); }}
                      className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center hover:underline"
                    >
                      Login<ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Credentials hint */}
            {email && (
              <div className="mt-3 flex items-center space-x-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-medium">Selected:</span>{' '}
                  <span className="font-mono">{email}</span>
                  {' · '}
                  <span className="font-mono">{password}</span>
                  {' · '}
                  <button
                    type="button"
                    onClick={handleSubmit as unknown as React.MouseEventHandler}
                    className="underline font-medium"
                  >
                    Sign in now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            {[5,4,3,2,1].map(level => (
              <div key={level} className="flex items-center space-x-1">
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${LEVEL_COLORS[level]}`}>L{level}</span>
                <span>= {['Full','Senior Mgmt','Management','Ops','Staff'][5-level]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
