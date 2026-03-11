import { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/ui/card';
import { loginValidationSchema, initialLoginValues, type LoginFormValues } from '../schemas/login.schema';
import { useLoginMutation } from '../apis/login.api';

import logo from "@/assets/logo-black.png"

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const formik = useFormik<LoginFormValues>({
        initialValues: initialLoginValues,
        validationSchema: loginValidationSchema,
        onSubmit: async (values) => {
            try {
                const response = await login({
                    email: values.email,
                    password: values.password,
                }).unwrap();
                
                toast.success('Welcome back!', {
                    description: 'You have successfully signed in.',
                });
                navigate('/dashboard');
            } catch (err: any) {
                const errorMessage = err?.data?.message || err?.message || 'Invalid credentials. Please try again.';
                toast.error('Login Failed', {
                    description: errorMessage,
                });
                console.error('Login error:', err);
            }
        },
    });

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = formik;

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-400 dark:bg-orange-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-400 dark:bg-amber-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Login Card */}
            <Card className="w-full max-w-md relative z-10 shadow-2xl border-border/50 backdrop-blur-sm bg-white/95 dark:bg-gray-950/95">
                <CardHeader className="space-y-4 pb-6">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div>
                                <img src={logo} alt="PeoplePulse Logo" className="h-10 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#4469e5] to-[#ee9807] bg-clip-text text-transparent">
                            Platform Admin Portal
                        </CardTitle>
                        <CardDescription className="text-base">
                            Sign in to manage PeoplePulse HRIS
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@peoplepulse.com"
                                    className="pl-10"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                                    disabled={isLoading}
                                />
                            </div>
                            {touched.email && errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                    tabIndex={-1}
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className="pl-10 pr-10"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-invalid={touched.password && errors.password ? 'true' : 'false'}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <p className="text-sm text-destructive">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={values.remember}
                                onChange={(e) => setFieldValue('remember', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2"
                                disabled={isLoading}
                            />
                            <Label htmlFor="remember" className="font-normal cursor-pointer">
                                Remember me for 30 days
                            </Label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-[#4469e5] to-[#ee9807] hover:from-[#4469e5]/90 hover:to-[#ee9807]/90 text-white font-semibold shadow-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Platform Access
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-[#4469e5]/30 dark:border-[#4469e5]/50 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <Shield className="w-5 h-5 text-[#4469e5] dark:text-[#4469e5] flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    <p className="font-semibold mb-1">Platform Administrator Access</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                                        This portal is for platform administrators only. Organization admins should use the main application portal.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>

                {/* Footer */}
                <div className="px-6 pb-6 pt-0">
                    <div className="text-center text-xs text-muted-foreground">
                        <p>© 2025 PeoplePulse HRIS. All rights reserved.</p>
                        <p className="mt-1">
                            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                            {' · '}
                            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                        </p>
                    </div>
                </div>
            </Card>

            {/* Development Helper */}
            {import.meta.env.DEV && (
                <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 rounded-lg p-3 text-xs max-w-xs shadow-lg">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                        🔑 Development Credentials
                    </p>
                    <p className="text-yellow-800 dark:text-yellow-200">
                        Email: <span className="font-mono">admin@peoplepulse.com</span>
                    </p>
                    <p className="text-yellow-800 dark:text-yellow-200">
                        Password: <span className="font-mono">password</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
