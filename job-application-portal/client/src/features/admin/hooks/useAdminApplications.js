import { useCallback, useEffect, useState } from 'react';
import { fetchAdminApplications } from '../../../services/applicationApi';
export default function useAdminApplications(user) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [refreshingApplications, setRefreshingApplications] = useState(false);
  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetchAdminApplications();
      setApplications(res.data);
      setError('');
    } catch (err) {
      setError('Error fetching applications');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    fetchApplications();
  }, [user, fetchApplications]);
  const handleViewApplication = application => {
    setSelectedApplication(application);
  };
  const closeModal = () => setSelectedApplication(null);
  const handleReviewSaved = message => {
    closeModal();
    setMessage(message);
    fetchApplications();
  };
  const handleRefreshApplications = async () => {
    setRefreshingApplications(true);
    await fetchApplications();
    setRefreshingApplications(false);
  };
  return {
    applications,
    loading,
    selectedApplication,
    message,
    error,
    refreshingApplications,
    handleViewApplication,
    closeModal,
    handleReviewSaved,
    handleRefreshApplications
  };
}
