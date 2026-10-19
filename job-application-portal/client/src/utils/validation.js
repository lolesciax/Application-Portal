export const validName = value => /^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,49}$/u.test(value.trim());
export const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const validPhone = value => /^[0-9]{11}$/.test(value.trim());
export const validUsername = value => /^[a-zA-Z0-9_]{4,20}$/.test(value.trim());
export const validPassword = value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value);
export function validBirthDate(value) {
  if (!value) return true;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
  const today = new Date();
  let age = today.getFullYear() - year;
  if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) age--;
  return age >= 18 && age <= 100;
}

export const validLoginIdentifier = value => value.includes('@') ? validEmail(value) : validUsername(value);
