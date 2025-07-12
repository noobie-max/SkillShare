import { AuthForm } from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-15rem)] items-center justify-center">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
