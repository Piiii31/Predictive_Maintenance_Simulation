'use client'

import { Alert } from '@nextui-org/alert';
import { Button } from '@nextui-org/button';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

const AuthForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setAuthError('');
      try {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        
        router.replace('/'); // Use replace to avoid navigation history issues
      } catch (error: any) {
        setAuthError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace('/');
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address' });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setResetEmailSent(true);
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md transform transition-all">
        <Card className="w-full shadow-2xl backdrop-blur-sm bg-background/60">
          <CardHeader className="flex gap-3 flex-col items-center pt-8 pb-4">
            <div className="rounded-full bg-gradient-to-tr from-pink-500 to-blue-500 p-0.5">
              <div className="rounded-full bg-background p-3">
                <img
                  src="/favicon.ico"
                  alt="Data Center Logo"
                  className="h-16 w-16 transform transition-transform hover:scale-110"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                {showForgotPassword ? 'Password Recovery' : 'Welcome Back'}
              </h1>
              {!showForgotPassword && (
                <p className="text-default-500">
                  Sign in to continue to your account
                </p>
              )}
            </div>
          </CardHeader>
          <CardBody className="px-8 pb-8">
            {authError && (
              <Alert className="mb-4" color="danger">
                {authError}
              </Alert>
            )}
            
            {showForgotPassword ? (
              <div className="flex flex-col gap-6">
                {resetEmailSent ? (
                  <Alert className="bg-default-100" color="success">
                    Password reset email has been sent. Please check your inbox.
                  </Alert>
                ) : (
                  <>
                    <Input
                      label="Email"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      errorMessage={errors.email}
                      isInvalid={!!errors.email}
                      classNames={{
                        input: "bg-transparent",
                        inputWrapper: "backdrop-blur-sm bg-default-100/50"
                      }}
                    />
                    <Button
                      color="primary"
                      className="w-full bg-gradient-to-r from-pink-500 to-blue-500"
                      onClick={handlePasswordReset}
                      isLoading={isLoading}
                    >
                      Send Reset Link
                    </Button>
                  </>
                )}
                <Button
                  variant="light"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmailSent(false);
                  }}
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <Input
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  errorMessage={errors.email}
                  isInvalid={!!errors.email}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: "backdrop-blur-sm bg-default-100/50"
                  }}
                />
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  errorMessage={errors.password}
                  isInvalid={!!errors.password}
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: "backdrop-blur-sm bg-default-100/50"
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    color="primary"
                    className="w-full bg-gradient-to-r from-pink-500 to-blue-500 font-semibold"
                    size="lg"
                    isLoading={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                  >
                    Sign in with Google
                  </Button>
                  <Button
                    type="button"
                    variant="light"
                    className="w-full"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </Button>
                </div>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;