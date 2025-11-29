import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, Sparkles, Smartphone, Clock4, ArrowRight, ArrowRightCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PhoneInput } from '../components/ui/phone-input';
import { OtpInput } from '../components/ui/otp-input';
import { Button } from '../components/ui/button';

type Step = 'phone' | 'otp';

const Login: React.FC = () => {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; otp?: string }>({});
  const { requestOtp, loginWithOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => Math.max(prev - 1, 0)), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, step]);

  const validatePhone = () => {
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: 'شماره موبایل الزامی است' }));
      return false;
    }
    if (!/^09\d{9}$/.test(phone)) {
      setErrors((prev) => ({ ...prev, phone: 'شماره را با فرمت 09xxxxxxxxx وارد کنید' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: undefined }));
    return true;
  };

  const handleRequestOtp = async () => {
    if (!validatePhone()) return;
    setIsRequesting(true);
    try {
      await requestOtp(phone);
      toast.success('کد تایید ارسال شد');
      setStep('otp');
      setOtp('');
      setCountdown(60);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ارسال کد با خطا مواجه شد');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleLogin = async () => {
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: 'شماره موبایل الزامی است' }));
      return;
    }
    if (otp.length < 4) {
      setErrors((prev) => ({ ...prev, otp: 'کد تایید باید حداقل ۴ رقم باشد' }));
      return;
    }
    setIsSubmitting(true);
    try {
      await loginWithOtp(phone, otp);
      toast.success('خوش آمدید!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'کد تایید نامعتبر است');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = useMemo(
    () => [
      { label: 'کلینیک فعال', value: '128+' },
      { label: 'پزشک تایید شده', value: '640+' },
      { label: 'نوبت موفق', value: '12k+' },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/20 bg-white/5 shadow-2xl backdrop-blur-2xl">
        <div className="grid items-center gap-0 lg:grid-cols-2">
          <section className="order-2 space-y-8 bg-white/95 p-8 text-slate-900 lg:order-none lg:p-12">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-600">
                <Sparkles className="h-4 w-4 text-primary-500" />
                نسخه جدید پنل ادمین
              </p>
              <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                ورود سریع با شماره موبایل و کد یک‌بار مصرف
              </h1>
              <p className="text-sm text-slate-500">
                برای امنیت بیشتر، ورود تنها با تأیید شماره و OTP انجام می‌شود. شماره خود را وارد کنید تا کد به صورت خودکار ارسال شود.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white/70 p-6 shadow-inner">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
                <span>مرحله {step === 'phone' ? '۱' : '۲'} از ۲</span>
                <span className="flex items-center gap-2 text-primary-600">
                  <Smartphone className="h-4 w-4" />
                  ورود امن
                </span>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-primary-600 to-primary-400 transition-all"
                  style={{ width: step === 'phone' ? '50%' : '100%' }}
                />
              </div>

              <div className="mt-8 space-y-6">
                {step === 'phone' && (
                  <>
                    <PhoneInput
                      label="شماره موبایل"
                      placeholder="0912xxxxxxx"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      error={errors.phone}
                      helperText="کد تایید به همین شماره ارسال می‌شود"
                      maxLength={11}
                    />
                    <Button
                      className="h-12 rounded-2xl text-base font-semibold"
                      disabled={isRequesting}
                      onClick={handleRequestOtp}
                    >
                      {isRequesting ? 'در حال ارسال...' : 'ارسال کد تایید'}
                    </Button>
                  </>
                )}

                {step === 'otp' && (
                  <>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <button
                        className="flex items-center gap-2 text-primary-600 transition hover:text-primary-700"
                        onClick={() => setStep('phone')}
                        type="button"
                      >
                        <ArrowRight className="h-4 w-4" />
                        ویرایش شماره
                      </button>
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        <Clock4 className="h-4 w-4" />
                        {countdown > 0 ? `ارسال مجدد تا ${countdown} ثانیه` : 'امکان ارسال مجدد'}
                      </span>
                    </div>

                    <OtpInput
                      label="کد تایید"
                      value={otp}
                      onChange={(value) => {
                        setOtp(value);
                        if (value.length >= 4 || !phone) {
                          setErrors((prev) => ({ ...prev, otp: undefined }));
                        }
                      }}
                      error={errors.otp}
                      length={4}
                    />

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={countdown > 0 || isRequesting}
                        className="h-12 flex-1 rounded-2xl border-slate-200 text-base"
                        onClick={handleRequestOtp}
                      >
                        ارسال مجدد کد
                      </Button>
                      <Button
                        className="h-12 flex-1 rounded-2xl bg-gradient-to-l from-primary-600 to-primary-400 text-base font-semibold shadow-lg shadow-primary/30"
                        disabled={isSubmitting}
                        onClick={handleLogin}
                      >
                        {isSubmitting ? 'در حال ورود...' : 'ورود به پنل'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
              <Link to="/register" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
                <ArrowRightCircle className="h-4 w-4" />
                ثبت‌نام مدیر جدید
              </Link>
              <p>پشتیبانی ۲۴ ساعته: ۰۲۱-۴۵۶۷۸۹</p>
            </div>
          </section>

          <section className="relative flex h-full flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 text-white">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                سلامت دیجیتال
              </span>
              <h2 className="text-4xl font-black leading-tight">
                پنل مدیریت بیمارستان با تجربه‌ای چشمگیر
              </h2>
              <p className="text-white/70">
                تمام تمرکز شما بر ارائه خدمات درمانی؛ مدیریت هوشمند کلینیک، بیمه و تیم پزشکی را به ما بسپارید.
              </p>
            </div>

            <div className="grid gap-6 text-right">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-black/10 backdrop-blur"
                >
                  <div className="text-3xl font-black text-white">{item.value}</div>
                  <div className="mt-1 text-sm text-white/70">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                امنیت تایید شده
              </div>
              <p className="mt-2 text-sm text-white/70">
                دسترسی مدیران و پزشکان پس از تایید ادمین فعال می‌شود. تمامی ورود‌ها ثبت و مانیتور می‌شوند.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
