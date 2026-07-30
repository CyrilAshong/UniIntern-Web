import api from './api';
import { type AuthResponse } from '../types';

export const registerStudent = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', {
    email,
    password,
    role: 'STUDENT',
    firstName,
    lastName,
  });
  return response.data.data;
};

export const registerCompany = async (
  email: string,
  password: string,
  companyName: string,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', {
    email,
    password,
    role: 'COMPANY',
    companyName,
  });
  return response.data.data;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data;
};

export const verifyOTP = async (
  email: string,
  otp: string,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/verify-otp', { email, otp });
  return response.data.data;
};

export const resendOTP = async (email: string): Promise<{ message: string }> => {
  const response = await api.post('/auth/resend-otp', { email });
  return response.data.data;
};