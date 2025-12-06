import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Sparkles, Plus, Stethoscope, Trash2 } from 'lucide-react';
import {
  specialtyService,
  type CreateSpecialtyDto,
  type Specialty,
} from '../../../api/services/specialtyService';
import { Button } from '../../../components/ui/button';
import { EmptyState } from '../../../components/states/EmptyState';
import { PageLoader } from '../../../components/states/PageLoader';
import { SpecialtyFormDialog } from './SpecialtyFormDialog';


const SpecialtiesList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: specialties = [], isLoading } = useQuery<Specialty[]>({
    queryKey: ['specialties', searchTerm],
    queryFn: () => specialtyService.getAll(searchTerm || undefined),
  });

  const createSpecialty = useMutation({
    mutationFn: (payload: CreateSpecialtyDto) => specialtyService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['specialties'] });
      await queryClient.refetchQueries({ queryKey: ['specialties'] });
      toast.success('تخصص ثبت شد');
    },
    onError: (error: any) => {
      let errorMessage = 'ثبت تخصص با خطا مواجه شد';

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error?.response?.data?.errors &&
        Array.isArray(error.response.data.errors) &&
        error.response.data.errors.length > 0
      ) {
        errorMessage = error.response.data.errors.join(', ');
      }

      toast.error(errorMessage);
    },
  });

  const deleteSpecialty = useMutation({
    mutationFn: (id: number) => specialtyService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['specialties'] });
      toast.success('تخصص حذف شد');
    },
    onError: (error: any) => {
      let errorMessage = 'حذف تخصص با خطا مواجه شد';

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('آیا از حذف این تخصص اطمینان دارید؟')) {
      deleteSpecialty.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-100 bg-white px-6 py-10 shadow-sm shadow-slate-200/60">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 text-right">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1 text-xs font-semibold text-primary-600">
              <Stethoscope className="h-4 w-4" />
              شبکه تخصص‌ها
            </span>
            <h2 className="text-3xl font-black text-slate-900">مدیریت تخصص‌های پزشکی</h2>
            <p className="text-sm text-slate-500">
              تعریف و مدیریت تخصص‌ها برای انتساب دقیق کادر درمانی و گزارش‌گیری بهتر.
            </p>
          </div>
          <Button
            className="h-12 rounded-2xl bg-gradient-to-l from-blue-600 to-blue-500 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-600"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="ml-2 h-4 w-4" />
            افزودن تخصص
          </Button>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-md">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 text-right">
            <p className="text-sm font-medium text-slate-700">لیست تخصص‌ها</p>
            <p className="text-xs text-slate-400">
              شما می‌توانید تخصص‌های مورد نیاز را تعریف و در انتساب پزشکان استفاده کنید.
            </p>
          </div>
          <input
            type="text"
            placeholder="جستجو بر اساس نام یا توضیحات تخصص..."
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-primary md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <PageLoader />
        ) : specialties.length === 0 ? (
          <EmptyState title="تخصصی ثبت نشده است" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {specialties.map((specialty, index) => (
              <article
                key={specialty.id}
                className="group rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900">{specialty.name}</p>
                      {specialty.categoryName && (
                        <p className="text-xs text-slate-400">دسته: {specialty.categoryName}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-2xl border border-rose-50 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-100"
                    onClick={() => handleDelete(specialty.id)}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Trash2 className="h-3 w-3" />
                      حذف
                    </span>
                  </button>
                </div>
                {specialty.description && (
                  <p className="mt-4 text-sm text-slate-500 line-clamp-3">{specialty.description}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <SpecialtyFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={async (values) => {
          await createSpecialty.mutateAsync(values);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

export default SpecialtiesList;


