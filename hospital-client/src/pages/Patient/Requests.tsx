import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { serviceRequestService, type ServiceRequest } from '../../api/services/serviceRequestService';
import { Loading } from '../../components/common/Loading';
import { Button } from '../../components/common/Button';

const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
        pending: { text: 'در انتظار', className: 'bg-yellow-100 text-yellow-800' },
        approved: { text: 'تایید شده', className: 'bg-blue-100 text-blue-800' },
        in_progress: { text: 'در حال انجام', className: 'bg-purple-100 text-purple-800' },
        done: { text: 'تکمیل شده', className: 'bg-green-100 text-green-800' },
        rejected: { text: 'لغو شده', className: 'bg-red-100 text-red-800' },
    };

    const statusInfo = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}>
            {statusInfo.text}
        </span>
    );
};

export const Requests = () => {
    const { user } = useAuth();

    const { data: requests, isLoading } = useQuery<ServiceRequest[]>({
        queryKey: ['patientRequests', user?.id],
        queryFn: () => serviceRequestService.getByPatientId(user!.id),
        enabled: !!user?.id,
    });

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">درخواست‌های من</h1>
                <Link to="/services">
                    <Button>درخواست جدید</Button>
                </Link>
            </div>

            {!requests || requests.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg mb-4">درخواستی یافت نشد</p>
                    <Link to="/services">
                        <Button>ثبت درخواست جدید</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div key={request.id} className="card hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {request.serviceName || 'خدمت نامشخص'}
                                            </h3>
                                            {request.clinicName && (
                                                <p className="text-sm text-gray-600 mt-1">مرکز: {request.clinicName}</p>
                                            )}
                                        </div>
                                        {getStatusBadge(request.status)}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                        {request.trackingCode && (
                                            <div>
                                                <span className="text-gray-600">کد رهگیری:</span>
                                                <span className="font-mono font-semibold text-primary-600 mr-2">
                                                    {request.trackingCode}
                                                </span>
                                            </div>
                                        )}
                                        {request.preferredTime && (
                                            <div>
                                                <span className="text-gray-600">زمان:</span>
                                                <span className="mr-2">
                                                    {new Date(request.preferredTime).toLocaleDateString('fa-IR')}
                                                </span>
                                            </div>
                                        )}
                                        {request.totalPrice && (
                                            <div>
                                                <span className="text-gray-600">قیمت کل:</span>
                                                <span className="font-semibold mr-2">
                                                    {request.totalPrice.toLocaleString()} تومان
                                                </span>
                                            </div>
                                        )}
                                        {request.patientPayable && (
                                            <div>
                                                <span className="text-gray-600">پرداختی:</span>
                                                <span className="font-semibold text-green-600 mr-2">
                                                    {request.patientPayable.toLocaleString()} تومان
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {request.notes && (
                                        <p className="text-sm text-gray-600 mt-2">یادداشت: {request.notes}</p>
                                    )}

                                    <div className="text-xs text-gray-500 mt-2">
                                        تاریخ ثبت: {new Date(request.createdAt).toLocaleDateString('fa-IR')}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {request.trackingCode && (
                                        <Link to={`/laboratory/track?code=${request.trackingCode}`}>
                                            <Button variant="outline" size="sm">
                                                رهگیری
                                            </Button>
                                        </Link>
                                    )}
                                    {request.status === 'done' && request.serviceResults && request.serviceResults.length > 0 && (
                                        <Button variant="secondary" size="sm">
                                            دانلود نتایج
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

