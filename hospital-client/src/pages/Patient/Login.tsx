import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const Login = () => {
    const [phone, setPhone] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');
    const { loginWithOtp, requestOtp } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOtpSent && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => Math.max(prev - 1, 0));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown, isOtpSent]);

    const validatePhone = (): boolean => {
        if (!phone) {
            setError('شماره موبایل الزامی است');
            return false;
        }
        if (!/^09\d{9}$/.test(phone)) {
            setError('شماره را با فرمت 09xxxxxxxxx وارد کنید');
            return false;
        }
        setError('');
        return true;
    };

    const handleOtpRequest = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        if (!validatePhone()) {
            return;
        }

        setError('');
        setIsRequesting(true);

        try {
            await requestOtp(phone);
            setIsOtpSent(true);
            setOtpCode('');
            setCountdown(60);
        } catch (err: any) {
            console.error('OTP request error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'خطا در ارسال کد';
            setError(errorMessage);
        } finally {
            setIsRequesting(false);
        }
    };

    const handleOtpLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!phone) {
            setError('شماره موبایل الزامی است');
            return;
        }

        if (otpCode.length !== 4) {
            setError('کد تایید باید ۴ رقم باشد');
            return;
        }

        setIsLoading(true);

        try {
            await loginWithOtp(phone, otpCode);
            navigate('/patient/profile');
        } catch (err: any) {
            setError(err.response?.data?.message || 'کد تایید نامعتبر است');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">ورود به حساب کاربری</h2>
                    <p className="mt-2 text-gray-600">به درمانگاه امام علی خوش آمدید</p>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {!isOtpSent ? (
                        <form onSubmit={handleOtpRequest} className="space-y-6">
                            <Input
                                label="شماره موبایل"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="09123456789"
                                required
                            />

                            <Button type="submit" className="w-full" isLoading={isRequesting}>
                                {isRequesting ? 'در حال ارسال...' : 'ارسال کد یکبار مصرف'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpLogin} className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    کد یکبار مصرف به شماره {phone} ارسال شد
                                </p>
                                <Input
                                    label="کد یکبار مصرف"
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    placeholder="کد 4 رقمی را وارد کنید"
                                    required
                                    maxLength={4}
                                />
                            </div>

                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                تایید و ورود
                            </Button>

                            <div className="text-center space-y-2">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsOtpSent(false);
                                            setOtpCode('');
                                            setPhone('');
                                            setCountdown(0);
                                        }}
                                        className="text-primary-600 hover:text-primary-700"
                                    >
                                        ← ویرایش شماره
                                    </button>
                                    <span className="text-gray-500">
                                        {countdown > 0
                                            ? `ارسال مجدد تا ${countdown} ثانیه`
                                            : 'امکان ارسال مجدد'}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleOtpRequest()}
                                    disabled={countdown > 0 || isRequesting}
                                    className={`text-sm block w-full ${countdown > 0 || isRequesting
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-primary-600 hover:text-primary-700'
                                        }`}
                                >
                                    ارسال مجدد کد
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            حساب کاربری ندارید؟{' '}
                            <Link to="/patient/register" className="text-primary-600 hover:text-primary-700 font-medium">
                                ثبت‌نام کنید
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

