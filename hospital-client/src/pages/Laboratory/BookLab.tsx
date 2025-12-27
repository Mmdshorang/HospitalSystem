import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { serviceService, type Service } from '../../api/services/serviceService';
import { insuranceService } from '../../api/services/insuranceService';
import { clinicService, type Clinic } from '../../api/services/clinicService';
import { serviceRequestService, type CreateServiceRequestDto } from '../../api/services/serviceRequestService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Loading } from '../../components/common/Loading';

export const BookLab = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [mode, setMode] = useState<'with-tracking' | 'without-tracking'>('without-tracking');
    const [trackingCode, setTrackingCode] = useState('');
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [selectedInsuranceId, setSelectedInsuranceId] = useState<number | undefined>();
    const [selectedClinicId, setSelectedClinicId] = useState<number | undefined>();
    const [notes, setNotes] = useState('');

    const { data: labServices, isLoading: servicesLoading } = useQuery<Service[]>({
        queryKey: ['labServices'],
        queryFn: () => serviceService.getAll(undefined, undefined),
    });

    const { data: insurances } = useQuery({
        queryKey: ['insurances'],
        queryFn: () => insuranceService.getAll(undefined, true),
    });

    const { data: clinics } = useQuery<Clinic[]>({
        queryKey: ['clinics', selectedInsuranceId],
        queryFn: () => clinicService.getAll(undefined, undefined, true, selectedInsuranceId),
        enabled: !!selectedInsuranceId,
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

    const labServicesList = labServices?.filter((s) =>
        s.name?.toLowerCase().includes('آزمایش') ||
        s.categoryId === 2 // Assuming category 2 is laboratory
    ) || [];

    const toggleService = (serviceId: number) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleSubmit = async () => {
        if (!user || selectedServices.length === 0) return;

        // For now, create one request per service
        // In a real app, you might want to create a single request with multiple services
        const firstServiceId = selectedServices[0];

        const requestData: CreateServiceRequestDto = {
            patientId: user.id,
            serviceId: firstServiceId,
            clinicId: selectedClinicId,
            insuranceId: selectedInsuranceId,
            notes: notes || undefined,
            trackingCode: mode === 'with-tracking' && trackingCode ? trackingCode : undefined,
        };

        createRequestMutation.mutate(requestData);
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-gray-600 mb-4">برای ثبت درخواست آزمایش، لطفا وارد شوید</p>
                <Button onClick={() => navigate('/patient/login')}>ورود</Button>
            </div>
        );
    }

    if (servicesLoading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-xl font-bold mb-8 text-gray-800">ثبت درخواست آزمایش</h1>

                {/* Mode Selection */}
                <div className="card border-2 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">نوع درخواست</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setMode('without-tracking');
                                setTrackingCode('');
                            }}
                            className={`p-6 rounded-lg border-2 text-right ${mode === 'without-tracking'
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="font-semibold text-lg mb-2">بدون کد رهگیری</div>
                            <div className="text-sm text-gray-600">
                                انتخاب مستقیم آزمایش‌ها
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('with-tracking')}
                            className={`p-6 rounded-lg border-2 text-right ${mode === 'with-tracking'
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="font-semibold text-lg mb-2">با کد رهگیری</div>
                            <div className="text-sm text-gray-600">
                                آزمایش با تجویز پزشک
                            </div>
                        </button>
                    </div>
                </div>

                {/* Tracking Code Input */}
                {mode === 'with-tracking' && (
                    <div className="card mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">کد رهگیری پزشک</h2>
                        <Input
                            label="کد رهگیری"
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value)}
                            placeholder="کد رهگیری تجویز پزشک را وارد کنید"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                            این کد را از پزشک معالج خود دریافت کرده‌اید.
                        </p>
                    </div>
                )}

                {/* Service Selection */}
                <div className="card border-2 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">انتخاب آزمایش‌ها</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {labServicesList.length === 0 ? (
                            <p className="text-gray-600 text-center py-8">آزمایشی یافت نشد</p>
                        ) : (
                            labServicesList.map((service) => (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => toggleService(service.id)}
                                    className={`w-full p-4 rounded-lg border-2 text-right transition-all ${selectedServices.includes(service.id)
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="font-semibold">{service.name}</div>
                                            {service.description && (
                                                <div className="text-sm text-gray-600 mt-1">{service.description}</div>
                                            )}
                                            {service.basePrice && (
                                                <div className="text-sm text-primary-600 mt-1">
                                                    {service.basePrice.toLocaleString()} تومان
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className={`w-6 h-6 rounded border-2 flex items-center justify-center ml-4 ${selectedServices.includes(service.id)
                                                ? 'border-primary-600 bg-primary-600'
                                                : 'border-gray-300'
                                                }`}
                                        >
                                            {selectedServices.includes(service.id) && (
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Insurance Selection */}
                <div className="card mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">انتخاب بیمه (اختیاری)</h2>
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

                {/* Clinic Selection */}
                {selectedInsuranceId && (
                    <div className="card mb-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">انتخاب مرکز</h2>
                        <div className="space-y-3">
                            {clinics && clinics.length > 0 ? (
                                clinics.map((clinic) => (
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
                                    </button>
                                ))
                            ) : (
                                <p className="text-gray-600 text-center py-4">
                                    مرکزی با بیمه انتخابی یافت نشد
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div className="card mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت (اختیاری)</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="input-field"
                        rows={3}
                        placeholder="یادداشت یا درخواست خاص..."
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/services')}
                    >
                        لغو
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        isLoading={createRequestMutation.isPending}
                        disabled={selectedServices.length === 0}
                    >
                        ثبت درخواست
                    </Button>
                </div>
            </div>
        </div>
    );
};

