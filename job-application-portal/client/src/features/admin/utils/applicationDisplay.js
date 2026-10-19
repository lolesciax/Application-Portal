import { getDisplayName } from '../../../utils/nameUtils';
export const formatRoleDisplay = role => {
  if (!role) return 'Engineer';
  return role.charAt(0).toUpperCase() + role.slice(1);
};
export const getApplicationDisplayName = application => getDisplayName(application.personalInfo || application.user || {});
