import { useEffect, useRef, useState } from 'react';
import { checkAccountAvailability } from '../../../services/authApi';
import { validUsername, validEmail } from '../../../utils/validation';
export default function useAccountAvailability(formData) {
  const [availability, setAvailability] = useState({});
  const requests = useRef({});
  useEffect(() => () => Object.values(requests.current).forEach(controller => controller.abort()), []);
  const clearAvailability = name => {
    requests.current[name]?.abort();
    setAvailability(states => ({
      ...states,
      [name]: null
    }));
  };
  const checkAvailability = async name => {
    const value = formData[name].trim().toLowerCase();
    if (!(name === 'username' ? validUsername(value) : validEmail(value))) return;
    requests.current[name]?.abort();
    const controller = new AbortController();
    requests.current[name] = controller;
    setAvailability(states => ({
      ...states,
      [name]: 'checking'
    }));
    try {
      const response = await checkAccountAvailability(name, value, controller.signal);
      if (!controller.signal.aborted) setAvailability(states => ({
        ...states,
        [name]: response.data.exists ? 'taken' : 'available'
      }));
    } catch {
      if (!controller.signal.aborted) setAvailability(states => ({
        ...states,
        [name]: 'unknown'
      }));
    }
  };
  return {
    availability,
    checkAvailability,
    clearAvailability
  };
}
