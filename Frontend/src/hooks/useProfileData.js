import { useEffect, useState } from 'react';
import api from '../services/api';

/**
 * Custom hook to fetch the public admin profile data.
 *
 * Fetches from GET /api/v1/auth/profile (public endpoint).
 * The UserResource already formats avatar/avatars fields with full URLs.
 *
 * Returns { profile, loading, error }
 */
const useProfileData = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        // UserResource is returned directly (not wrapped in a 'data' key)
        const data = response.data?.data || response.data;
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile data:', err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};

export default useProfileData;