import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { fetchApplicantApplication, submitApplication } from '../../../services/applicationApi';
import { validName, validEmail, validPhone, validBirthDate } from '../../../utils/validation';
import { getStatusText } from '../../../utils/applicationStatus';
import { EMPTY_FORM_DATA, getProfileFormData, getApplicationFormData } from '../utils/applicationForm';
export default function useApplicantApplication() {
  const {
    user,
    logout
  } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [loadFailed, setLoadFailed] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const resumeInput = useRef(null);
  const fetchApplication = useCallback(async (currentUser = user) => {
    setLoadFailed(false);
    try {
      const res = await fetchApplicantApplication();
      setApplication(res.data);
      setFormData(getApplicationFormData(res.data, currentUser));
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('');
        setApplication(null);
        setFormData(getProfileFormData(currentUser));
      } else {
        console.error(err);
        setLoadFailed(true);
        setError('We could not load your application. Please retry before making changes.');
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, [user]);
  useEffect(() => {
    if (!user || user.role === 'admin') return;
    fetchApplication(user);
  }, [user, fetchApplication]);
  useEffect(() => {
    if (!user || application) {
      return;
    }
    const profileData = getProfileFormData(user);
    setFormData(currentFormData => ({
      firstName: currentFormData.firstName || profileData.firstName,
      lastName: currentFormData.lastName || profileData.lastName,
      email: currentFormData.email || profileData.email,
      phone: currentFormData.phone || profileData.phone,
      address: currentFormData.address || profileData.address,
      ...currentFormData,
      dateOfBirth: currentFormData.dateOfBirth || profileData.dateOfBirth
    }));
  }, [user, application]);
  const buildPersonalInfo = () => ({
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    address: formData.address.trim(),
    dateOfBirth: formData.dateOfBirth || '',
    position: (formData.position || '').trim()
  });
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) {
      setResumeFile(null);
      return;
    }
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, DOC, DOCX, or image files only.');
      setResumeFile(null);
      e.target.value = '';
      return;
    }
    if (file.size > maxSize) {
      setError('File size exceeds 5MB limit.');
      setResumeFile(null);
      e.target.value = '';
      return;
    }
    setResumeFile(file);
    setError('');
    if (validationErrors.resume) {
      setValidationErrors({
        ...validationErrors,
        resume: ''
      });
    }
  };
  const validateForm = () => {
    const personalInfo = buildPersonalInfo();
    const errors = {};
    if (!validName(personalInfo.firstName)) {
      errors.firstName = 'Enter a first name with 2-50 characters.';
    }
    if (!validName(personalInfo.lastName)) {
      errors.lastName = 'Enter a last name with 2-50 characters.';
    }
    if (!validEmail(personalInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!validPhone(personalInfo.phone)) {
      errors.phone = 'Phone number must contain exactly 11 digits';
    }
    if (!validBirthDate(personalInfo.dateOfBirth) && personalInfo.dateOfBirth) {
      errors.dateOfBirth = 'Enter a valid birth date. Applicants must be 18-100 years old.';
    }
    if (!resumeFile && !application?.resume) {
      errors.resume = 'Please upload your resume/CV';
    }
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      requestAnimationFrame(() => document.getElementById(Object.keys(errors)[0] === 'resume' ? 'resume-upload' : Object.keys(errors)[0])?.focus());
      return null;
    }
    setFormData(personalInfo);
    return personalInfo;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (submitting || loadFailed) return;
    const personalInfo = validateForm();
    if (!personalInfo) {
      return;
    }
    setSubmitting(true);
    setMessage('');
    setError('');
    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify({
      personalInfo
    }));
    if (resumeFile) {
      formDataToSend.append('resume', resumeFile);
    }
    try {
      const response = await submitApplication(formDataToSend);
      setMessage(application ? 'Application updated successfully!' : 'Application submitted successfully!');
      setResumeFile(null);
      setValidationErrors({});
      if (resumeInput.current) resumeInput.current.value = '';
      if (response.data.application) {
        setApplication(response.data.application);
        setFormData(getApplicationFormData(response.data.application, user));
      } else await fetchApplication();
    } catch (err) {
      setError(err.response?.data?.msg || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };
  const contactReady = validName(formData.firstName || '') && validName(formData.lastName || '') && validEmail(formData.email || '') && validPhone(formData.phone || '');
  const complete = [validName(formData.firstName || ''), validName(formData.lastName || ''), validEmail(formData.email || ''), validPhone(formData.phone || ''), !!(resumeFile || application?.resume)].filter(Boolean).length;
  const nextStep = !application ? 'Review your details and attach a resume to apply.' : application.status === 'interview_scheduled' ? 'Your interview is scheduled. Check the details in your status panel.' : application.status === 'hired' ? "You have been hired. Check the hiring team's update for next steps." : application.status === 'rejected' ? "Your application has been reviewed. Check the hiring team's feedback." : 'Your application is with the hiring team. Open My application to update your details.';
  const stage = application ? getStatusText(application.status) : 'Not submitted';
  const steps = ['Submitted', 'In review', 'Interview', 'Decision'];
  const stageIndex = !application ? -1 : application.status === 'pending' ? 1 : application.status === 'interview_scheduled' ? 2 : 3;
  const removeResume = () => {
    setResumeFile(null);
    if (resumeInput.current) resumeInput.current.value = '';
  };
  const retryApplication = () => {
    setRetrying(true);
    fetchApplication();
  };
  return {
    user,
    logout,
    application,
    loading,
    submitting,
    message,
    error,
    resumeFile,
    validationErrors,
    formData,
    loadFailed,
    retrying,
    resumeInput,
    handleChange,
    handleFileChange,
    handleSubmit,
    contactReady,
    complete,
    nextStep,
    stage,
    stageIndex,
    steps,
    removeResume,
    retryApplication
  };
}
