import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const Register = () => {
    const [formData, setFormData] = useState({
        phone: '',
        nationalCode: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
    });
    const [otpCode, setOtpCode] = useState('');
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, requestOtp, verifyOtp, loginWithOtp } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.phone || !formData.nationalCode || !formData.firstName || !formData.lastName) {
            setError('لطفا تمام فیلدهای الزامی را پر کنید');
            return false;
        }

        if (formData.phone.length !== 11 || !formData.phone.startsWith('09')) {
            setError('شماره موبایل باید 11 رقم و با 09 شروع شود');
            return false;
        }

        if (formData.nationalCode.length !== 10) {
            setError('کد ملی باید 10 رقم باشد');
            return false;
        }

        return true;
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // First, try to register the user with a temporary password
            // This creates the user in database, then we can send OTP
            // Generate a secure temporary password
            const tempPassword = `Temp${Math.random().toString(36).slice(-8)}A1!`;
            const registerData: any = {
                phone: formData.phone,
                nationalCode: formData.nationalCode,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: tempPassword,
                confirmPassword: tempPassword,
                dateOfBirth: formData.dateOfBirth || undefined,
                gender: formData.gender || undefined,
            };

            try {
                // Try to register first (this creates the user)
                await register(registerData);
            } catch (regErr: any) {
                // If user already exists, that's okay - we'll just send OTP
                // Check for common "user exists" error codes
                const errorMessage = regErr.response?.data?.message || '';
                const isUserExistsError =
                    regErr.response?.status === 409 ||
                    regErr.response?.status === 400 ||
                    errorMessage.includes('موجود') ||
                    errorMessage.includes('exists') ||
                    errorMessage.includes('قبلا');

                if (!isUserExistsError) {
                    // If it's a different error, throw it
                    throw regErr;
                }
                // User might already exist, continue to send OTP
            }

            // Now send OTP (user exists now, either newly created or already existed)
            await requestOtp(formData.phone);
            setStep('otp');
        } catch (err: any) {
            console.error('Registration/OTP error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'خطا در ثبت‌نام یا ارسال کد';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!otpCode || otpCode.length !== 4) {
            setError('لطفا کد 4 رقمی را وارد کنید');
            return;
        }

        setIsLoading(true);

        try {
            // Verify OTP first
            await verifyOtp(formData.phone, otpCode);

            // After OTP verification, login with OTP to get the token
            await loginWithOtp(formData.phone, otpCode);

            navigate('/patient/profile');
        } catch (err: any) {
            setError(err.response?.data?.message || 'کد وارد شده صحیح نیست.');
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'otp') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">تایید شماره موبایل</h2>
                        <p className="mt-2 text-gray-600">
                            کد یکبار مصرف به شماره {formData.phone} ارسال شد
                        </p>
                    </div>

                    <div className="card">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <Input
                                label="کد یکبار مصرف"
                                type="text"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                placeholder="کد 4 رقمی را وارد کنید"
                                required
                                maxLength={4}
                            />

                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                تایید و ثبت‌نام
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await requestOtp(formData.phone);
                                        } catch (err) {
                                            setError('خطا در ارسال مجدد کد');
                                        }
                                    }}
                                    className="text-primary-600 hover:text-primary-700 text-sm"
                                >
                                    ارسال مجدد کد
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep('form')}
                                    className="text-gray-600 hover:text-gray-700 text-sm"
                                >
                                    بازگشت
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">ثبت‌نام</h2>
                    <p className="mt-2 text-gray-600">حساب کاربری جدید ایجاد کنید</p>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmitForm} className="space-y-4">
                        <Input
                            label="شماره موبایل *"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="09123456789"
                            required
                        />

                        <Input
                            label="کد ملی *"
                            type="text"
                            name="nationalCode"
                            value={formData.nationalCode}
                            onChange={handleInputChange}
                            placeholder="1234567890"
                            required
                            maxLength={10}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="نام *"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="نام"
                                required
                            />

                            <Input
                                label="نام خانوادگی *"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="نام خانوادگی"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="تاریخ تولد (اختیاری)"
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    جنسیت
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="">انتخاب کنید</option>
                                    <option value="Male">مرد</option>
                                    <option value="Female">زن</option>
                                </select>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            ادامه و ارسال کد تایید
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            قبلا ثبت‌نام کرده‌اید؟{' '}
                            <Link to="/patient/login" className="text-primary-600 hover:text-primary-700 font-medium">
                                وارد شوید
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

