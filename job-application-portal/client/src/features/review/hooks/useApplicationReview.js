import { useEffect, useId, useRef, useState } from 'react';
import { getDisplayName } from '../../../utils/nameUtils';
import { getResumeUrl, saveApplicationReview } from '../../../services/applicationApi';
import { tabs, statuses, localDate } from '../utils/reviewFormatting';
export default function useApplicationReview(application, onClose, onSaved) {
  const id = useId();
  const titleId = id + '-title';
  const descriptionId = id + '-description';
  const info = application.personalInfo || {};
  const name = getDisplayName(info) || getDisplayName(application.user || {}) || 'Applicant';
  const initialInterview = {
    date: application.interviewSchedule?.date?.slice(0, 10) || '',
    time: application.interviewSchedule?.time || '',
    location: application.interviewSchedule?.location || '',
    notes: application.interviewSchedule?.notes || ''
  };
  const initialStatus = {
    status: application.status || 'pending',
    adminNotes: application.adminNotes || ''
  };
  const [section, setSection] = useState('overview');
  const [interview, setInterview] = useState(initialInterview);
  const [status, setStatus] = useState(initialStatus);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const busy = useRef(false);
  const keepButton = useRef(null);
  const heading = useRef(null);
  const body = useRef(null);
  const tabButtons = useRef({});
  const dirty = JSON.stringify(interview) !== JSON.stringify(initialInterview) || JSON.stringify(status) !== JSON.stringify(initialStatus);
  const formId = id + '-form';
  const resumeUrl = getResumeUrl(application.resume?.filename);
  useEffect(() => {
    if (pendingAction) keepButton.current?.focus();
  }, [pendingAction]);
  useEffect(() => {
    if (body.current) body.current.scrollTop = 0;
  }, [section]);
  const changeSection = next => {
    if (saving || next === section) return;
    if (dirty) {
      setPendingAction(next);
      return;
    }
    setSection(next);
    setErrors({});
    setError('');
  };
  const requestClose = () => {
    if (busy.current) return;
    if (pendingAction) {
      keepEditing();
      return;
    }
    if (dirty) setPendingAction('close');else onClose();
  };
  const keepEditing = () => {
    setPendingAction(null);
    requestAnimationFrame(() => heading.current?.focus({
      preventScroll: true
    }));
  };
  const discardChanges = () => {
    if (pendingAction === 'close') {
      onClose();
      return;
    }
    const next = pendingAction;
    setInterview(initialInterview);
    setStatus(initialStatus);
    setErrors({});
    setError('');
    setPendingAction(null);
    setSection(next);
    requestAnimationFrame(() => tabButtons.current[next]?.focus());
  };
  const keyboardTab = (event, index) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;else if (event.key === 'Home') next = 0;else if (event.key === 'End') next = tabs.length - 1;else return;
    event.preventDefault();
    changeSection(tabs[next].id);
    if (!dirty) tabButtons.current[tabs[next].id]?.focus();
  };
  const update = (kind, field, value) => {
    (kind === 'interview' ? setInterview : setStatus)(data => ({
      ...data,
      [field]: value
    }));
    setErrors(previous => ({
      ...previous,
      [field]: ''
    }));
    setError('');
  };
  const validate = () => {
    const result = {};
    if (section === 'interview') {
      if (!interview.date || !/^\d{4}-\d{2}-\d{2}$/.test(interview.date)) result.date = 'Choose an interview date.';else if (interview.date < localDate()) result.date = 'Choose today or a future date.';
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(interview.time)) result.time = 'Choose an interview time.';
      if (interview.location.trim().length < 5) result.location = 'Enter a meeting link or location with at least 5 characters.';
    } else {
      if (!statuses[status.status]) result.status = 'Choose an application status.';
      if (status.status === 'interview_scheduled' && !application.interviewSchedule?.date) result.status = 'Use the Interview section to schedule an interview first.';
      if (status.status === 'rejected' && !status.adminNotes.trim()) result.adminNotes = 'Add a reason so the applicant understands the decision.';
    }
    setErrors(result);
    if (Object.keys(result).length) {
      requestAnimationFrame(() => document.getElementById(id + '-' + Object.keys(result)[0])?.focus());
      return false;
    }
    return true;
  };
  const save = async event => {
    event.preventDefault();
    if (busy.current || !validate()) return;
    busy.current = true;
    setSaving(true);
    setError('');
    const schedule = section === 'interview';
    try {
      await saveApplicationReview(application._id, section, schedule ? {
        ...interview,
        location: interview.location.trim(),
        notes: interview.notes.trim()
      } : {
        ...status,
        adminNotes: status.adminNotes.trim()
      });
      onSaved(schedule ? 'Interview scheduled. The applicant can see the details in their dashboard.' : 'Application status updated.');
    } catch (failure) {
      setError(failure.response?.data?.msg || 'Your changes could not be saved. Please try again.');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };
  const inputProps = field => ({
    id: id + '-' + field,
    'aria-invalid': errors[field] ? 'true' : undefined,
    'aria-describedby': errors[field] ? id + '-' + field + '-error' : undefined
  });
  return {
    id,
    titleId,
    descriptionId,
    info,
    name,
    section,
    interview,
    status,
    errors,
    error,
    saving,
    pendingAction,
    keepButton,
    heading,
    body,
    tabButtons,
    dirty,
    formId,
    resumeUrl,
    changeSection,
    requestClose,
    keepEditing,
    discardChanges,
    keyboardTab,
    update,
    save,
    inputProps
  };
}
