import { validName, validBirthDate, validPassword } from './validation';
test('accepts names with accents, apostrophes, and hyphens', () => {
  expect(validName('Ana-Maria')).toBe(true); expect(validName("O'Connor")).toBe(true); expect(validName('José')).toBe(true); expect(validName('123')).toBe(false);
});
test('rejects invalid and future birth dates while permitting an omitted date', () => {
  expect(validBirthDate('2025-02-30')).toBe(false); expect(validBirthDate('2099-01-01')).toBe(false); expect(validBirthDate('')).toBe(true);
});
test('password guidance agrees with the existing signup policy', () => {
  expect(validPassword('Example123')).toBe(true); expect(validPassword('example123')).toBe(false); expect(validPassword('Example!123')).toBe(false);
});


test('phone numbers require exactly 11 digits', () => {
  const { validPhone } = require('./validation');
  expect(validPhone('09123456789')).toBe(true);
  for (const phone of ['', '0912345678', '091234567890', '09123abc789', '+639123456789', '0912 345678']) expect(validPhone(phone)).toBe(false);
});
