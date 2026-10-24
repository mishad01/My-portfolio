import { useState } from 'react';
import { Button, TextField } from '@/ui';
import { BrandMark } from '../components/BrandMark';
import type { AdminVM } from '../useAdmin';

export function LoginScreen({ vm }: { vm: AdminVM }) {
  const [email, setEmail] = useState(vm.loginDefaults.email);
  const [password, setPassword] = useState(vm.loginDefaults.password);
  return (
    <div className="box-border flex min-h-screen flex-1 items-center justify-center p-6">
      <form onSubmit={(e) => { e.preventDefault(); vm.signIn(email, password); }} className="box-border flex w-full max-w-[400px] flex-col gap-5 rounded-[28px] bg-surface-low p-9">
        <div className="flex items-center gap-3">
          <BrandMark size={48} />
          <span className="text-sm font-medium text-on-surface-variant">Portfolio admin</span>
        </div>
        <h1 className="m-0 h-display text-4xl leading-10">Sign in</h1>
        <TextField label="Email" type="email" autoComplete="username" value={email} onChange={setEmail} required />
        <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={setPassword} required={!vm.demo} />
        {vm.error && <span className="text-sm text-error">{vm.error}</span>}
        <Button type="submit" disabled={vm.busy === 'signin'} className="w-full">{vm.busy === 'signin' ? 'Signing in…' : 'Sign in'}</Button>
        <span className="text-[13px] text-on-surface-variant">
          {vm.demo ? 'Demo mode — any credentials work and edits stay in this browser.' : 'Only the site owner can sign in.'}
        </span>
      </form>
    </div>
  );
}
