import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { clinicService, type Clinic } from '../../api/services/clinicService';
import { insuranceService, type Insurance } from '../../api/services/insuranceService';
import { serviceService, type Service } from '../../api/services/serviceService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Loading } from '../../components/common/Loading';

export const SelectClinic = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const serviceId = searchParams.get('serviceId') ? Number(searchParams.get('serviceId')) : undefined;
    const insuranceIdParam = searchParams.get('insuranceId') ? Number(searchParams.get('insuranceId')) : undefined;

    const [selectedInsuranceId, setSelectedInsuranceId] = useState<number | undefined>(insuranceIdParam);
    const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(serviceId);
    const [cityFilter, setCityFilter] = useState('');
    const [selectedClinic, setSelectedClinic] = useState<number | null>(null);

    const { data: clinics, isLoading: clinicsLoading } = useQuery<Clinic[]>({
        queryKey: ['clinics', selectedInsuranceId, selectedServiceId, cityFilter],
        queryFn: () => clinicService.getAll(undefined, cityFilter || undefined, true, selectedInsuranceId, selectedServiceId),
    });

    const { data: insurances, isLoading: insurancesLoading } = useQuery<Insurance[]>({
        queryKey: ['insurances'],
        queryFn: () => insuranceService.getAll(undefined, true),
    });

    const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
        queryKey: ['services'],
        queryFn: () => serviceService.getAll(),
    });

    const handleSelectClinic = (clinicId: number) => {
        setSelectedClinic(clinicId);
        // Navigate back to booking with selected clinic
        if (selectedServiceId) {
            navigate(`/book/${selectedServiceId}?clinicId=${clinicId}&insuranceId=${selectedInsuranceId || ''}`);
        } else {
            navigate(`/clinics/select?clinicId=${clinicId}&insuranceId=${selectedInsuranceId || ''}&serviceId=${selectedServiceId || ''}`);
        }
    };

    if (clinicsLoading || insurancesLoading || servicesLoading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">انتخاب مرکز</h1>

            {/* Filters */}
            <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">فیلترها</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">بیمه</label>
                        <select
                            value={selectedInsuranceId || ''}
                            onChange={(e) => setSelectedInsuranceId(e.target.value ? Number(e.target.value) : undefined)}
                            className="input-field"
                        >
                            <option value="">همه بیمه‌ها</option>
                            {insurances?.map((insurance) => (
                                <option key={insurance.id} value={insurance.id}>
                                    {insurance.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">خدمت</label>
                        <select
                            value={selectedServiceId || ''}
                            onChange={(e) => setSelectedServiceId(e.target.value ? Number(e.target.value) : undefined)}
                            className="input-field"
                        >
                            <option value="">همه خدمات</option>
                            {services?.filter(s => s.isActive).map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">شهر</label>
                        <Input
                            placeholder="جستجو بر اساس شهر"
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Clinics List */}
            {!clinics || clinics.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-600 text-lg">مرکزی با فیلترهای انتخابی یافت نشد</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {clinics.map((clinic) => {
                        const clinicService = clinic.clinicServices?.find(
                            (cs) => cs.serviceId === selectedServiceId
                        );
                        const price = clinicService?.price;

                        return (
                            <div
                                key={clinic.id}
                                className={`card cursor-pointer transition-all ${selectedClinic === clinic.id
                                    ? 'ring-2 ring-primary-600 bg-primary-50'
                                    : 'hover:shadow-lg'
                                    }`}
                                onClick={() => handleSelectClinic(clinic.id)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{clinic.name}</h3>
                                        {clinic.addresses && clinic.addresses.length > 0 && (
                                            <p className="text-sm text-gray-600">
                                                {clinic.addresses[0].city && `${clinic.addresses[0].city}, `}
                                                {clinic.addresses[0].street}
                                            </p>
                                        )}
                                    </div>
                                    {clinic.logoUrl && (
                                        <img
                                            src={clinic.logoUrl}
                                            alt={clinic.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    )}
                                </div>

                                {price && (
                                    <div className="mb-4">
                                        <span className="text-sm text-gray-600">قیمت خدمت: </span>
                                        <span className="text-lg font-bold text-primary-600">
                                            {price.toLocaleString()} تومان
                                        </span>
                                    </div>
                                )}

                                {clinic.workHours && clinic.workHours.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">ساعات کاری:</p>
                                        <div className="text-xs text-gray-600 space-y-1">
                                            {clinic.workHours
                                                .filter((wh) => wh.isActive)
                                                .slice(0, 3)
                                                .map((wh) => (
                                                    <div key={wh.id}>
                                                        {wh.dayOfWeek}: {wh.startTime} - {wh.endTime}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {clinic.phone && (
                                    <p className="text-sm text-gray-600 mb-4">تلفن: {clinic.phone}</p>
                                )}

                                <Button
                                    variant={selectedClinic === clinic.id ? 'primary' : 'outline'}
                                    className="w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectClinic(clinic.id);
                                    }}
                                >
                                    {selectedClinic === clinic.id ? 'انتخاب شده' : 'انتخاب این مرکز'}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

