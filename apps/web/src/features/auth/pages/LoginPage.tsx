import { useState } from 'react';
import { useLogin, useRegister } from '../hooks/useAuth';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('demo@ai-platform.dev');
  const [password, setPassword] = useState('demo123!');
  const [name, setName] = useState('');
  
  const login = useLogin();
  const register = useRegister();
  
  const isPending = login.isPending || register.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login.mutate({ email, password });
    } else {
      register.mutate({ email, password, name: name || (email.split('@')[0] ?? 'User') });
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-[rgb(15,15,23)] via-[rgb(22,22,35)] to-[rgb(15,15,40)]">
      <div className="w-full max-w-md p-8 glass rounded-2xl animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 mb-4">
            <span className="text-3xl">✦</span>
          </div>
          <h1 className="text-2xl font-bold text-white">AI Platform</h1>
          <p className="text-sm text-white/50 mt-1">Enterprise AI Infrastructure</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-medium text-white/60 mb-1.5 block uppercase tracking-wider">Name</label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-base"
                placeholder="Your Name"
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block uppercase tracking-wider">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block uppercase tracking-wider">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            id="auth-submit"
            type="submit"
            className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {isPending ? 'Authenticating...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

        {isLogin && (
          <p className="text-[10px] text-center text-white/30 mt-4">
            Demo: demo@ai-platform.dev / demo123!
          </p>
        )}
      </div>
    </div>
  );
}
