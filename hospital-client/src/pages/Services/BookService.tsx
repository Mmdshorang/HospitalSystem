import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { serviceService, type Service } from '../../api/services/serviceService';
import { insuranceService } from '../../api/services/insuranceService';
import { clinicService, type Clinic } from '../../api/services/clinicService';
import { serviceRequestService, type CreateServiceRequestDto } from '../../api/services/serviceRequestService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Loading } from '../../components/common/Loading';

const STEPS = [
    'انتخاب خدمت',
    'اطلاعات بیمار',
    'انتخاب بیمه',
    'انتخاب مرکز',
    'انتخاب زمان',
    'تایید و ثبت',
];

export const BookService = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, isAuthenticated } = useAuth();

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedInsuranceId, setSelectedInsuranceId] = useState<number | undefined>();
    const [selectedClinicId, setSelectedClinicId] = useState<number | undefined>();
    const [preferredTime, setPreferredTime] = useState('');
    const [appointmentType, setAppointmentType] = useState<'in_person' | 'online' | 'phone'>('in_person');
    const [notes, setNotes] = useState('');
    const [patientInfo, setPatientInfo] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        nationalCode: user?.nationalCode || '',
        phone: user?.phone || '',
    });

    const { data: service, isLoading: serviceLoading } = useQuery<Service>({
        queryKey: ['service', serviceId],
        queryFn: () => serviceService.getById(Number(serviceId)),
        enabled: !!serviceId,
    });

    const { data: insurances } = useQuery({
        queryKey: ['insurances'],
        queryFn: () => insuranceService.getAll(undefined, true),
    });

    const { data: clinics } = useQuery<Clinic[]>({
        queryKey: ['clinics', selectedInsuranceId, serviceId],
        queryFn: () => clinicService.getAll(undefined, undefined, true, selectedInsuranceId, Number(serviceId)),
        enabled: !!selectedInsuranceId && !!serviceId,
    });

    const createRequestMutation = useMutation({
        mutationFn: (data: CreateServiceRequestDto) => serviceRequestService.create(data),
        onSuccess: (data) => {
            if (data.trackingCode) {
                navigate(`/laboratory/track?code=${data.trackingCode}`);
            } else {
                navigate('/patient/requests');
            }
        },
    });

    useEffect(() => {
        const clinicId = searchParams.get('clinicId');
        const insuranceId = searchParams.get('insuranceId');
        if (clinicId) {
            setSelectedClinicId(Number(clinicId));
            setCurrentStep(4); // Go to time selection
        }
        if (insuranceId) {
            setSelectedInsuranceId(Number(insuranceId));
        }
    }, [searchParams]);

    useEffect(() => {
        if (!isAuthenticated && currentStep > 0) {
            navigate('/patient/login');
        }
    }, [isAuthenticated, currentStep, navigate]);

    if (serviceLoading) {
        return <Loading />;
    }

    if (!service) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-gray-600 mb-4">خدمت یافت نشد</p>
                <Button onClick={() => navigate('/services')}>بازگشت به لیست خدمات</Button>
            </div>
        );
    }

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;

        const requestData: CreateServiceRequestDto = {
            patientId: user.id,
            serviceId: service.id,
            clinicId: selectedClinicId,
            insuranceId: selectedInsuranceId,
            preferredTime: preferredTime || undefined,
            appointmentType: appointmentType,
            notes: notes || undefined,
        };

        createRequestMutation.mutate(requestData);
    };

    const selectedClinic = clinics?.find((c) => c.id === selectedClinicId);
    const selectedInsurance = insurances?.find((i) => i.id === selectedInsuranceId);
    const clinicServicePrice = selectedClinic?.clinicServices?.find(
        (cs) => cs.serviceId === service.id
    )?.price || service.basePrice || 0;
    const insuranceCoverage = selectedInsurance?.coveragePercent || 0;
    const insuranceCovered = (clinicServicePrice * insuranceCoverage) / 100;
    const patientPayable = clinicServicePrice - insuranceCovered;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">رزرو خدمت</h1>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {STEPS.map((step, index) => (
                            <div key={index} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${index <= currentStep
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <span className="text-xs mt-2 text-center text-gray-600">{step}</span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`h-1 flex-1 mx-2 ${index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="card">
                    {currentStep === 0 && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{service.name}</h2>
                            {service.description && <p className="text-gray-600 mb-4">{service.description}</p>}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {service.basePrice && (
                                    <div>
                                        <span className="text-gray-600">قیمت پایه: </span>
                                        <span className="font-bold text-primary-600">
                                            {service.basePrice.toLocaleString()} تومان
                                        </span>
                                    </div>
                                )}
                                {service.durationMinutes && (
                                    <div>
                                        <span className="text-gray-600">مدت زمان: </span>
                                        <span>{service.durationMinutes} دقیقه</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">اطلاعات بیمار</h2>
                            <Input
                                label="نام"
                                value={patientInfo.firstName}
                                onChange={(e) => setPatientInfo({ ...patientInfo, firstName: e.target.value })}
                                required
                            />
                            <Input
                                label="نام خانوادگی"
                                value={patientInfo.lastName}
                                onChange={(e) => setPatientInfo({ ...patientInfo, lastName: e.target.value })}
                                required
                            />
                            <Input
                                label="کد ملی"
                                value={patientInfo.nationalCode}
                                onChange={(e) => setPatientInfo({ ...patientInfo, nationalCode: e.target.value })}
                                required
                                maxLength={10}
                            />
                            <Input
                                label="شماره تماس"
                                type="tel"
                                value={patientInfo.phone}
                                onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">انتخاب بیمه (اختیاری)</h2>
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedInsuranceId(undefined)}
                                    className={`w-full p-4 rounded-lg border-2 text-right ${!selectedInsuranceId
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    بدون بیمه
                                </button>
                                {insurances?.map((insurance) => (
                                    <button
                                        key={insurance.id}
                                        type="button"
                                        onClick={() => setSelectedInsuranceId(insurance.id)}
                                        className={`w-full p-4 rounded-lg border-2 text-right ${selectedInsuranceId === insurance.id
                                            ? 'border-primary-600 bg-primary-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="font-semibold">{insurance.name}</div>
                                        {insurance.coveragePercent && (
                                            <div className="text-sm text-gray-600">
                                                پوشش: {insurance.coveragePercent}%
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">انتخاب مرکز</h2>
                            {!selectedInsuranceId && (
                                <p className="text-yellow-600 mb-4 text-sm">
                                    توجه: برای مشاهده مراکز با پوشش بیمه، ابتدا بیمه را انتخاب کنید.
                                </p>
                            )}
                            <div className="space-y-3 mb-4">
                                {clinics && clinics.length > 0 ? (
                                    clinics.map((clinic) => {
                                        const cs = clinic.clinicServices?.find((cs) => cs.serviceId === service.id);
                                        return (
                                            <button
                                                key={clinic.id}
                                                type="button"
                                                onClick={() => setSelectedClinicId(clinic.id)}
                                                className={`w-full p-4 rounded-lg border-2 text-right ${selectedClinicId === clinic.id
                                                    ? 'border-primary-600 bg-primary-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="font-semibold">{clinic.name}</div>
                                                {clinic.addresses && clinic.addresses[0] && (
                                                    <div className="text-sm text-gray-600">
                                                        {clinic.addresses[0].city}, {clinic.addresses[0].street}
                                                    </div>
                                                )}
                                                {cs?.price && (
                                                    <div className="text-sm font-semibold text-primary-600 mt-1">
                                                        قیمت: {cs.price.toLocaleString()} تومان
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600 mb-4">مرکزی یافت نشد</p>
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate(`/clinics/select?serviceId=${service.id}&insuranceId=${selectedInsuranceId || ''}`)}
                                        >
                                            جستجوی مراکز
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">انتخاب زمان</h2>
                            {service.deliveryType === 'InClinic' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع ویزیت</label>
                                    <select
                                        value={appointmentType}
                                        onChange={(e) => setAppointmentType(e.target.value as any)}
                                        className="input-field"
                                    >
                                        <option value="in_person">حضوری</option>
                                        <option value="online">آنلاین</option>
                                        <option value="phone">تلفنی</option>
                                    </select>
                                </div>
                            )}
                            <Input
                                label="تاریخ و زمان مورد نظر (اختیاری)"
                                type="datetime-local"
                                value={preferredTime}
                                onChange={(e) => setPreferredTime(e.target.value)}
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                در صورت عدم انتخاب زمان، مرکز با شما تماس خواهد گرفت.
                            </p>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">خلاصه درخواست</h2>
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">خدمت:</span>
                                    <span className="font-semibold">{service.name}</span>
                                </div>
                                {selectedClinic && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">مرکز:</span>
                                        <span className="font-semibold">{selectedClinic.name}</span>
                                    </div>
                                )}
                                {selectedInsurance && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">بیمه:</span>
                                        <span className="font-semibold">{selectedInsurance.name}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">قیمت کل:</span>
                                    <span className="font-semibold">{clinicServicePrice.toLocaleString()} تومان</span>
                                </div>
                                {selectedInsurance && (
                                    <>
                                        <div className="flex justify-between text-green-600">
                                            <span>سهم بیمه:</span>
                                            <span>{insuranceCovered.toLocaleString()} تومان</span>
                                        </div>
                                        <div className="flex justify-between text-primary-600 font-bold">
                                            <span>پرداختی شما:</span>
                                            <span>{patientPayable.toLocaleString()} تومان</span>
                                        </div>
                                    </>
                                )}
                                {preferredTime && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">زمان:</span>
                                        <span>{new Date(preferredTime).toLocaleString('fa-IR')}</span>
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت (اختیاری)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="input-field"
                                    rows={3}
                                    placeholder="یادداشت یا درخواست خاص..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6 pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                        >
                            قبلی
                        </Button>
                        {currentStep < STEPS.length - 1 ? (
                            <Button onClick={handleNext}>
                                بعدی
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                isLoading={createRequestMutation.isPending}
                            >
                                ثبت درخواست
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

