import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, loginWithOtp, requestOtp } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(phone, password);
            navigate('/patient/profile');
        } catch (err: any) {
            setError(err.response?.data?.message || 'خطا در ورود. لطفا دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpRequest = async () => {
        if (!phone) {
            setError('لطفا شماره موبایل را وارد کنید');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await requestOtp(phone);
            setIsOtpMode(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'خطا در ارسال کد. لطفا دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await loginWithOtp(phone, otpCode);
            navigate('/patient/profile');
        } catch (err: any) {
            setError(err.response?.data?.message || 'کد وارد شده صحیح نیست.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">ورود به حساب کاربری</h2>
                    <p className="mt-2 text-gray-600">به بیمارستان امام علی خوش آمدید</p>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {!isOtpMode ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <Input
                                label="شماره موبایل"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="09123456789"
                                required
                            />

                            <Input
                                label="رمز عبور"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="رمز عبور خود را وارد کنید"
                                required
                            />

                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                ورود
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleOtpRequest}
                                    className="text-primary-600 hover:text-primary-700 text-sm"
                                >
                                    ورود با کد یکبار مصرف
                                </button>
                            </div>
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
                                    placeholder="کد را وارد کنید"
                                    required
                                    maxLength={6}
                                />
                            </div>

                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                تایید و ورود
                            </Button>

                            <div className="text-center space-y-2">
                                <button
                                    type="button"
                                    onClick={handleOtpRequest}
                                    className="text-primary-600 hover:text-primary-700 text-sm block"
                                >
                                    ارسال مجدد کد
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOtpMode(false);
                                        setOtpCode('');
                                    }}
                                    className="text-gray-600 hover:text-gray-700 text-sm block"
                                >
                                    بازگشت به ورود با رمز عبور
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

