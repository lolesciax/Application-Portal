import { getNameParts } from '../../../utils/nameUtils';
export const EMPTY_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: '',
  position: ''
};
export const formatDateForInput = value => {
  if (!value) {
    return '';
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString().split('T')[0];
};
export const getProfileFormData = user => {
  const {
    firstName,
    lastName
  } = getNameParts(user || {});
  return {
    firstName,
    lastName,
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: formatDateForInput(user?.dateOfBirth)
  };
};
export const getApplicationFormData = (application, user) => {
  const profileData = getProfileFormData(user);
  const {
    firstName,
    lastName
  } = getNameParts(application?.personalInfo || {});
  return {
    ...profileData,
    position: application?.personalInfo?.position || '',
    firstName: firstName || profileData.firstName,
    lastName: lastName || profileData.lastName,
    email: application?.personalInfo?.email || profileData.email,
    phone: application?.personalInfo?.phone || profileData.phone,
    address: application?.personalInfo?.address || profileData.address,
    dateOfBirth: formatDateForInput(application?.personalInfo?.dateOfBirth || profileData.dateOfBirth)
  };
};
