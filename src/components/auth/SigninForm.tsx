'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api/apiFetch';
import { signinSchema } from '@/lib/validators';
import { withSuspense } from '@/components/hoc/withSuspense';
import { SigninSkeleton } from '../../app/(public)/auth/signin/SiginSkeleton';
import type { User } from '@/types/users';

type SigninFormProps = {
  onSuccess: (user: User) => void;
};

const SigninForm = ({ onSuccess }: SigninFormProps) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = signinSchema.safeParse(form);

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      // apiFetch throws on non-OK responses
      const data = await apiFetch('/api/auth/signin', {
        method: 'POST',
        body: parsed.data,
      });

      const user = data.user;

      if (!user) {
        throw new Error('Signin succeeded but no user payload was returned');
      }

      onSuccess?.(user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message ?? 'Invalid credentials');

      console.error('SIGNIN ERROR:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-20 max-w-sm space-y-4 rounded border p-6"
    >
      <h1 className="text-xl font-semibold">Sign in</h1>

      <input
        className="w-full rounded border p-2"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="w-full rounded border p-2"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-white p-2 text-black disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default withSuspense(SigninForm, SigninSkeleton);
