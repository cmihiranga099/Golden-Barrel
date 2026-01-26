import { apiGet, apiPatch } from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';

export type Address = {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

export type UserProfile = {
  name: string;
  phone?: string;
  email: string;
  addresses?: Address[];
};

export async function fetchProfile(): Promise<UserProfile> {
  return apiGet<UserProfile>('/users/me');
}

export async function updateProfile(payload: Partial<UserProfile>) {
  return apiPatch<UserProfile>('/users/me', payload);
}