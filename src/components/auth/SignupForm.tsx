'use client'

import { useState } from 'react';
import { apiFetch } from '@/lib/api/apiFetch';
import { withSuspense } from '@/components/hoc/withSuspense';
import { signupFormSchema } from '../../app/(public)/auth/signup/schema';
import { SignupSkeleton } from '../../app/(public)/auth/signup/SignupSkeleton';

type SigninFormProps = {
  onSuccess: () => void;
};

const SignupForm = ({ onSuccess }: SigninFormProps) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = signupFormSchema.safeParse(form);

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    // remove confirmPassword from payload
    const { confirmPassword, ...payload } = parsed.data;

    try {
      // apiFetch throws on non-OK responses
      await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: payload,
      });

      onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message ?? 'Something went wrong');

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
      <h1 className="text-xl font-semibold">Sign up</h1>

      <input
        className="w-full rounded border p-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

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

      <input
        className="w-full rounded border p-2"
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-white p-2 text-black disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Sign up'}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default withSuspense(SignupForm, SignupSkeleton)