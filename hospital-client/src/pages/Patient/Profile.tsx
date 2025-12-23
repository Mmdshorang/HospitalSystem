import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { patientService, type UpdatePatientProfileDto } from '../../api/services/patientService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Loading } from '../../components/common/Loading';

export const Profile = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UpdatePatientProfileDto>({
        bloodType: '',
        height: undefined,
        weight: undefined,
        medicalHistory: '',
        emergencyName: '',
        emergencyRelationship: '',
        emergencyPhone: '',
    });

    const { data: profile, isLoading } = useQuery({
        queryKey: ['patientProfile', user?.id],
        queryFn: () => patientService.getProfile(user!.id),
        enabled: !!user?.id,
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdatePatientProfileDto) =>
            patientService.updateProfile(user!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patientProfile', user?.id] });
            setIsEditing(false);
        },
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                bloodType: profile.bloodType || '',
                height: profile.height,
                weight: profile.weight,
                medicalHistory: profile.medicalHistory || '',
                emergencyName: profile.emergencyName || '',
                emergencyRelationship: profile.emergencyRelationship || '',
                emergencyPhone: profile.emergencyPhone || '',
            });
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">پروفایل بیمار</h1>

                <div className="card">
                    <div className="mb-6 pb-6 border-b">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">اطلاعات شخصی</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                                <p className="text-gray-900">{user?.firstName || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                                <p className="text-gray-900">{user?.lastName || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی</label>
                                <p className="text-gray-900">{user?.nationalCode || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">شماره موبایل</label>
                                <p className="text-gray-900">{user?.phone}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 pb-6 border-b">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">اطلاعات پزشکی</h2>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setIsEditing(!isEditing);
                                        if (profile) {
                                            setFormData({
                                                bloodType: profile.bloodType || '',
                                                height: profile.height,
                                                weight: profile.weight,
                                                medicalHistory: profile.medicalHistory || '',
                                                emergencyName: profile.emergencyName || '',
                                                emergencyRelationship: profile.emergencyRelationship || '',
                                                emergencyPhone: profile.emergencyPhone || '',
                                            });
                                        }
                                    }}
                                >
                                    {isEditing ? 'لغو' : 'ویرایش'}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {isEditing ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">گروه خونی</label>
                                            <select
                                                value={formData.bloodType}
                                                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                                className="input-field"
                                            >
                                                <option value="">انتخاب کنید</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>
                                        <Input
                                            label="قد (سانتی‌متر)"
                                            type="number"
                                            value={formData.height || ''}
                                            onChange={(e) => setFormData({ ...formData, height: e.target.value ? Number(e.target.value) : undefined })}
                                        />
                                        <Input
                                            label="وزن (کیلوگرم)"
                                            type="number"
                                            value={formData.weight || ''}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value ? Number(e.target.value) : undefined })}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">گروه خونی</label>
                                            <p className="text-gray-900">{profile?.bloodType || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">قد</label>
                                            <p className="text-gray-900">{profile?.height ? `${profile.height} سانتی‌متر` : '-'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">وزن</label>
                                            <p className="text-gray-900">{profile?.weight ? `${profile.weight} کیلوگرم` : '-'}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">سابقه پزشکی</label>
                                    <textarea
                                        value={formData.medicalHistory}
                                        onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                                        className="input-field"
                                        rows={4}
                                        placeholder="سابقه بیماری‌ها، آلرژی‌ها و..."
                                    />
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">سابقه پزشکی</label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{profile?.medicalHistory || '-'}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">اطلاعات تماس اضطراری</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {isEditing ? (
                                    <>
                                        <Input
                                            label="نام"
                                            value={formData.emergencyName}
                                            onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                                            placeholder="نام تماس اضطراری"
                                        />
                                        <Input
                                            label="نسبت"
                                            value={formData.emergencyRelationship}
                                            onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                                            placeholder="مثل: پدر، مادر، همسر"
                                        />
                                        <Input
                                            label="شماره تماس"
                                            type="tel"
                                            value={formData.emergencyPhone}
                                            onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                                            placeholder="09123456789"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                                            <p className="text-gray-900">{profile?.emergencyName || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">نسبت</label>
                                            <p className="text-gray-900">{profile?.emergencyRelationship || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس</label>
                                            <p className="text-gray-900">{profile?.emergencyPhone || '-'}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-6 flex gap-4">
                                <Button type="submit" isLoading={updateMutation.isPending}>
                                    ذخیره تغییرات
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        if (profile) {
                                            setFormData({
                                                bloodType: profile.bloodType || '',
                                                height: profile.height,
                                                weight: profile.weight,
                                                medicalHistory: profile.medicalHistory || '',
                                                emergencyName: profile.emergencyName || '',
                                                emergencyRelationship: profile.emergencyRelationship || '',
                                                emergencyPhone: profile.emergencyPhone || '',
                                            });
                                        }
                                    }}
                                >
                                    لغو
                                </Button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

