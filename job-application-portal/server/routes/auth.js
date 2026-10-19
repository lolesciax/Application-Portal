const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { validName, validEmail, validPhone, validPassword, validBirthDate, validLoginIdentifier } = require('../utils/validation');

const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RESERVED_USERNAMES = new Set(['admin']);

const normalizeUsername = (value = '') => String(value).trim().toLowerCase();

const validateUsername = (value = '') => /^[a-zA-Z0-9_]{4,20}$/.test(value);

const isReservedUsername = (value = '') => RESERVED_USERNAMES.has(normalizeUsername(value));

const splitFullName = (value = '') => {
  const normalizedValue = String(value).trim().replace(/\s+/g, ' ');

  if (!normalizedValue) {
    return { firstName: '', lastName: '' };
  }

  const [firstName, ...lastNameParts] = normalizedValue.split(' ');

  return {
    firstName,
    lastName: lastNameParts.join(' ')
  };
};

const getUserNameParts = (user) => {
  const fallbackParts = splitFullName(user.name || '');

  return {
    firstName: (user.firstName || fallbackParts.firstName || '').trim(),
    lastName: (user.lastName || fallbackParts.lastName || '').trim()
  };
};

const getDisplayName = (user) => {
  const { firstName, lastName } = getUserNameParts(user);
  return `${firstName} ${lastName}`.trim() || (user.name || '').trim();
};

const findUserByEmail = async (email) => {
  const normalizedEmail = (email || '').trim();
  if (!normalizedEmail) {
    return null;
  }

  return User.findOne({
    email: new RegExp(`^${escapeRegExp(normalizedEmail)}$`, 'i')
  });
};

const findUserByUsername = async (username) => {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) {
    return null;
  }

  return User.findOne({ username: normalizedUsername });
};

const formatUserResponse = (user) => ({
  username: user.username || '',
  firstName: getUserNameParts(user).firstName,
  lastName: getUserNameParts(user).lastName,
  id: user.id,
  name: getDisplayName(user),
  email: user.email,
  phone: user.phone || '',
  address: user.address || '',
  dateOfBirth: user.dateOfBirth || null,
  role: user.role
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, fullName, firstName, lastName, username, email, password, phone, address, dateOfBirth } = req.body;
    const fields = { name, fullName, firstName, lastName, username, email, password, phone, address, dateOfBirth };
    if (Object.values(fields).some(value => value != null && typeof value !== 'string')) {
      return res.status(400).json({ msg: 'Account fields must contain text.' });
    }
    const fallbackParts = splitFullName(fullName || name || '');
    const normalizedFirstName = (firstName || fallbackParts.firstName || '').trim();
    const normalizedLastName = (lastName || fallbackParts.lastName || '').trim();
    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedFirstName || !normalizedLastName || !normalizedUsername || !normalizedEmail || !password) {
      return res.status(400).json({ msg: 'Username, first name, last name, email, and password are required' });
    }

    if (!validateUsername(normalizedUsername)) {
      return res.status(400).json({ msg: 'Username must be 4-20 characters and use only letters, numbers, or underscores' });
    }

    if (isReservedUsername(normalizedUsername)) {
      return res.status(400).json({ msg: 'This username is not available' });
    }

    const errors = {};
    if (!validName(normalizedFirstName)) errors.firstName = 'Enter a valid first name (2-50 characters).';
    if (!validName(normalizedLastName)) errors.lastName = 'Enter a valid last name (2-50 characters).';
    if (!validEmail(normalizedEmail)) errors.email = 'Enter a valid email address.';
    if (!validPhone(phone || '')) errors.phone = 'Enter exactly 11 digits without spaces or punctuation.';
    if (!validPassword(password)) errors.password = 'Use 8 or more characters with uppercase, lowercase, and a number. Letters and numbers only.';
    if (!validBirthDate(dateOfBirth || '')) errors.dateOfBirth = 'Applicants must be 18-100 years old. Enter a valid birth date.';
    if (Object.keys(errors).length) return res.status(400).json({ msg: Object.values(errors)[0], errors });

    let user = await findUserByUsername(normalizedUsername);
    if (user) {
      return res.status(400).json({ msg: 'Username is already taken' });
    }

    user = await findUserByEmail(normalizedEmail);
    if (user) {
      return res.status(400).json({ msg: 'Email is already registered' });
    }

    user = new User({
      username: normalizedUsername,
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      email: normalizedEmail,
      password,
      phone: (phone || '').trim(),
      address: (address || '').trim(),
      dateOfBirth: dateOfBirth || null,
      role: 'engineer'
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: formatUserResponse(user) });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Check if username is already taken
router.get('/check-username', async (req, res) => {
  try {
    const normalizedUsername = normalizeUsername(req.query.username);

    if (!normalizedUsername) {
      return res.status(400).json({ msg: 'Username is required' });
    }

    if (isReservedUsername(normalizedUsername)) {
      return res.json({ exists: true });
    }

    const user = await findUserByUsername(normalizedUsername);
    res.json({ exists: Boolean(user) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Check if email is already registered
router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    const normalizedEmail = (email || '').trim();

    if (!normalizedEmail) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const user = await findUserByEmail(normalizedEmail);
    res.json({ exists: Boolean(user) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = username || email || '';
    if ([username, email].some(value => value != null && typeof value !== 'string') || typeof identifier !== 'string' || typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({ msg: 'Enter your username or email and password.' });
    }
    if (!validLoginIdentifier(identifier.trim())) {
      return res.status(400).json({ msg: 'Enter a valid username or email address.' });
    }
    const normalizedUsername = normalizeUsername(username || '');
    let user = await findUserByUsername(normalizedUsername);

    if (!user && email) {
      user = await findUserByEmail(email);
    }

    if (!user && !email && String(username || '').includes('@')) {
      user = await findUserByEmail(username);
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: formatUserResponse(user) });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(formatUserResponse(user));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
