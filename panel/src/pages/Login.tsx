import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {

  Smartphone,
  Clock4,
  ArrowRight,
  ArrowRightCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { PhoneInput } from "../components/ui/phone-input";
import { OtpInput } from "../components/ui/otp-input";
import { Button } from "../components/ui/button";
import OTP from "../assets/OTP.svg";
type Step = "phone" | "otp";

const Login: React.FC = () => {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; otp?: string }>({});
  const { requestOtp, loginWithOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === "otp" && countdown > 0) {
      const timer = setInterval(
        () => setCountdown((prev) => Math.max(prev - 1, 0)),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [countdown, step]);

  const validatePhone = () => {
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: "شماره موبایل الزامی است" }));
      return false;
    }
    if (!/^09\d{9}$/.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "شماره را با فرمت 09xxxxxxxxx وارد کنید",
      }));
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
      toast.success("کد تایید ارسال شد");
      setStep("otp");
      setOtp("");
      setCountdown(60);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "ارسال کد با خطا مواجه شد");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleLogin = async () => {
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: "شماره موبایل الزامی است" }));
      return;
    }
    if (otp.length < 4) {
      setErrors((prev) => ({ ...prev, otp: "کد تایید باید حداقل ۴ رقم باشد" }));
      return;
    }
    setIsSubmitting(true);
    try {
      await loginWithOtp(phone, otp);
      toast.success("خوش آمدید!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "کد تایید نامعتبر است");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl">
        <div className="grid items-center gap-0 lg:grid-cols-2">
          <section className="order-2 space-y-8 bg-white p-8 lg:order-0 lg:p-12">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-slate-800">
                  مرحله {step === "phone" ? "۱" : "۲"} از ۲
                </span>
                <span className="flex items-center gap-2 text-primary-600">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-primary-600">ورود امن</span>
                </span>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-primary-600 to-primary-400 transition-all"
                  style={{ width: step === "phone" ? "50%" : "100%" }}
                />
              </div>

              <div className="mt-8 space-y-6">
                {step === "phone" && (
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
                      className="h-12 w-full rounded-2xl bg-gradient-to-l from-blue-600 to-blue-500 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-600"
                      disabled={isRequesting}
                      onClick={handleRequestOtp}
                    >
                      {isRequesting ? "در حال ارسال..." : "ارسال کد تایید"}
                    </Button>
                  </>
                )}

                {step === "otp" && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <button
                        className="flex items-center gap-2 text-primary-600 transition hover:text-primary-700"
                        onClick={() => setStep("phone")}
                        type="button"
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span className="text-primary-600">ویرایش شماره</span>
                      </button>
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
                        <Clock4 className="h-4 w-4" />
                        {countdown > 0
                          ? `ارسال مجدد تا ${countdown} ثانیه`
                          : "امکان ارسال مجدد"}
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
                        className="h-12 flex-1 rounded-2xl border-slate-300 text-base text-slate-700 hover:bg-slate-50"
                        onClick={handleRequestOtp}
                      >
                        ارسال مجدد کد
                      </Button>
                      <Button
                        className="h-12 flex-1 rounded-2xl bg-gradient-to-l from-blue-600 to-blue-500 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-600"
                        disabled={isSubmitting}
                        onClick={handleLogin}
                      >
                        {isSubmitting ? "در حال ورود..." : "ورود به پنل"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <Link
                to="/register"
                className="flex items-center gap-2 text-primary-600 transition hover:text-primary-700"
              >
                <ArrowRightCircle className="h-4 w-4" />
                <span className="text-primary-600">ثبت‌نام مدیر جدید</span>
              </Link>
              <p className="text-slate-800">پشتیبانی ۲۴ ساعته: ۰۲۱-۴۵۶۷۸۹</p>
            </div>
          </section>

          <section className="relative flex h-full flex-col justify-between text-white">
            <img
              src={OTP}
              alt="ورود امن با کد تایید"
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
