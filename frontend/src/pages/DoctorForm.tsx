import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { doctorService } from '../api/services/doctorService';
import { CreateDoctor, UpdateDoctor } from '../api/types';

const DoctorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateDoctor>({
    firstName: '',
    lastName: '',
    licenseNumber: '',
    specialization: '',
    phoneNumber: '',
    email: '',
    officeLocation: '',
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    isAvailable: true,
  });

  // Fetch doctor data if editing
  const { data: doctor } = useQuery(
    ['doctor', id],
    () => doctorService.getById(id!),
    { enabled: isEdit }
  );

  // Update form data when doctor data is loaded
  useEffect(() => {
    if (doctor) {
      setFormData({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        licenseNumber: doctor.licenseNumber,
        specialization: doctor.specialization,
        phoneNumber: doctor.phoneNumber,
        email: doctor.email,
        officeLocation: doctor.officeLocation,
        workingHoursStart: doctor.workingHoursStart,
        workingHoursEnd: doctor.workingHoursEnd,
        isAvailable: doctor.isAvailable,
      });
    }
  }, [doctor]);

  const createMutation = useMutation(doctorService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('doctors');
      navigate('/doctors');
    },
  });

  const updateMutation = useMutation(
    (data: UpdateDoctor) => doctorService.update(id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('doctors');
        queryClient.invalidateQueries(['doctor', id]);
        navigate('/doctors');
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit) {
      await updateMutation.mutateAsync({
        id: id!,
        ...formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Doctor' : 'Add New Doctor'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEdit ? 'Update doctor information' : 'Enter doctor details'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                License Number
              </label>
              <input
                type="text"
                name="licenseNumber"
                id="licenseNumber"
                required
                value={formData.licenseNumber}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                Specialization
              </label>
              <select
                name="specialization"
                id="specialization"
                required
                value={formData.specialization}
                onChange={handleChange}
                className="input mt-1"
              >
                <option value="">Select Specialization</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Gastroenterology">Gastroenterology</option>
                <option value="Hematology">Hematology</option>
                <option value="Neurology">Neurology</option>
                <option value="Oncology">Oncology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Radiology">Radiology</option>
                <option value="Surgery">Surgery</option>
                <option value="Urology">Urology</option>
              </select>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="officeLocation" className="block text-sm font-medium text-gray-700">
                Office Location
              </label>
              <input
                type="text"
                name="officeLocation"
                id="officeLocation"
                value={formData.officeLocation}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="workingHoursStart" className="block text-sm font-medium text-gray-700">
                Working Hours Start
              </label>
              <input
                type="time"
                name="workingHoursStart"
                id="workingHoursStart"
                value={formData.workingHoursStart}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="workingHoursEnd" className="block text-sm font-medium text-gray-700">
                Working Hours End
              </label>
              <input
                type="time"
                name="workingHoursEnd"
                id="workingHoursEnd"
                value={formData.workingHoursEnd}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                  Available for appointments
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/doctors')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Saving...' : isEdit ? 'Update Doctor' : 'Create Doctor'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
