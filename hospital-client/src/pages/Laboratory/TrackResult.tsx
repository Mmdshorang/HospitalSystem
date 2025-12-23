import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { serviceRequestService, type ServiceRequest } from '../../api/services/serviceRequestService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Loading } from '../../components/common/Loading';

const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
        pending: { text: 'ثبت شده', className: 'bg-yellow-100 text-yellow-800' },
        approved: { text: 'تایید شده', className: 'bg-blue-100 text-blue-800' },
        in_progress: { text: 'در حال انجام', className: 'bg-purple-100 text-purple-800' },
        done: { text: 'آماده', className: 'bg-green-100 text-green-800' },
        rejected: { text: 'لغو شده', className: 'bg-red-100 text-red-800' },
    };

    const statusInfo = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
    return (
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.className}`}>
            {statusInfo.text}
        </span>
    );
};

export const TrackResult = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [trackingCode, setTrackingCode] = useState(searchParams.get('code') || '');

    const { data: request, isLoading, error, refetch } = useQuery<ServiceRequest>({
        queryKey: ['trackRequest', trackingCode],
        queryFn: () => serviceRequestService.getByTrackingCode(trackingCode),
        enabled: false,
    });

    const handleTrack = () => {
        if (trackingCode.trim()) {
            setSearchParams({ code: trackingCode });
            refetch();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">رهگیری نتیجه آزمایش</h1>

                <div className="card mb-6">
                    <div className="flex gap-4">
                        <Input
                            placeholder="کد رهگیری را وارد کنید"
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleTrack();
                                }
                            }}
                            className="flex-1"
                        />
                        <Button onClick={handleTrack} isLoading={isLoading}>
                            رهگیری
                        </Button>
                    </div>
                </div>

                {isLoading && <Loading />}

                {error && (
                    <div className="card bg-red-50 border border-red-200">
                        <p className="text-red-700 text-center">
                            {error instanceof Error ? error.message : 'کد رهگیری یافت نشد'}
                        </p>
                    </div>
                )}

                {request && (
                    <div className="card">
                        <div className="mb-6 pb-6 border-b">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">وضعیت درخواست</h2>
                                {getStatusBadge(request.status)}
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>کد رهگیری: <span className="font-mono font-semibold text-primary-600">{request.trackingCode}</span></p>
                                {request.serviceName && <p className="mt-2">خدمت: {request.serviceName}</p>}
                                {request.clinicName && <p>مرکز: {request.clinicName}</p>}
                                {request.createdAt && (
                                    <p>تاریخ ثبت: {new Date(request.createdAt).toLocaleDateString('fa-IR')}</p>
                                )}
                            </div>
                        </div>

                        {request.status === 'done' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">نتایج آزمایش</h3>
                                {request.serviceResults && request.serviceResults.length > 0 ? (
                                    <div className="space-y-4">
                                        {request.serviceResults.map((result: any, index: number) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                <p className="font-semibold mb-2">{result.name || `نتیجه ${index + 1}`}</p>
                                                {result.fileUrl && (
                                                    <a
                                                        href={result.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary-600 hover:text-primary-700 text-sm"
                                                    >
                                                        دانلود فایل نتایج
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">نتایج هنوز آماده نشده است.</p>
                                )}
                            </div>
                        )}

                        {request.status !== 'done' && (
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-4">
                                    {request.status === 'pending' && 'درخواست شما ثبت شده و در انتظار بررسی است.'}
                                    {request.status === 'approved' && 'درخواست شما تایید شده است.'}
                                    {request.status === 'in_progress' && 'آزمایش در حال انجام است. لطفا صبر کنید.'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    پس از آماده شدن نتایج، می‌توانید آن‌ها را از این صفحه مشاهده و دانلود کنید.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

