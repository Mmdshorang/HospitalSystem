// Generated types based on backend DTOs
// This file should be regenerated when backend DTOs change

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  expires: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

// Patient types
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
  bloodType: string;
  emergencyContact: string;
  emergencyPhone: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePatient {
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
  bloodType: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface UpdatePatient {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
  bloodType: string;
  emergencyContact: string;
  emergencyPhone: string;
}

// Doctor types
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialization: string;
  phoneNumber: string;
  email: string;
  officeLocation: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDoctor {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialization: string;
  phoneNumber: string;
  email: string;
  officeLocation: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  isAvailable: boolean;
}

export interface UpdateDoctor {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialization: string;
  phoneNumber: string;
  email: string;
  officeLocation: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  isAvailable: boolean;
}

// Appointment types
export interface Appointment {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string;
  reason: string;
  patientId: string;
  doctorId: string;
  patient: Patient;
  doctor: Doctor;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAppointment {
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes: string;
  reason: string;
  patientId: string;
  doctorId: string;
}

export interface UpdateAppointment {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string;
  reason: string;
  patientId: string;
  doctorId: string;
}
