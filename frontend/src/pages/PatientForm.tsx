import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { patientService } from '../api/services/patientService';
import { CreatePatient, UpdatePatient } from '../api/types';

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreatePatient>({
    firstName: '',
    lastName: '',
    nationalId: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    address: '',
    bloodType: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  // Fetch patient data if editing
  const { data: patient } = useQuery(
    ['patient', id],
    () => patientService.getById(id!),
    { enabled: isEdit }
  );

  // Update form data when patient data is loaded
  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        nationalId: patient.nationalId,
        dateOfBirth: patient.dateOfBirth,
        phoneNumber: patient.phoneNumber,
        email: patient.email,
        address: patient.address,
        bloodType: patient.bloodType,
        emergencyContact: patient.emergencyContact,
        emergencyPhone: patient.emergencyPhone,
      });
    }
  }, [patient]);

  const createMutation = useMutation(patientService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('patients');
      navigate('/patients');
    },
  });

  const updateMutation = useMutation(
    (data: UpdatePatient) => patientService.update(id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('patients');
        queryClient.invalidateQueries(['patient', id]);
        navigate('/patients');
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Patient' : 'Add New Patient'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEdit ? 'Update patient information' : 'Enter patient details'}
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
              <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
                National ID
              </label>
              <input
                type="text"
                name="nationalId"
                id="nationalId"
                required
                value={formData.nationalId}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="input mt-1"
              />
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
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                Blood Type
              </label>
              <select
                name="bloodType"
                id="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="input mt-1"
              >
                <option value="">Select Blood Type</option>
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

            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                Emergency Contact
              </label>
              <input
                type="text"
                name="emergencyContact"
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">
                Emergency Phone
              </label>
              <input
                type="tel"
                name="emergencyPhone"
                id="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/patients')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Saving...' : isEdit ? 'Update Patient' : 'Create Patient'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
