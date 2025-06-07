
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'owner' | 'manager' | 'admin' | 'user';

interface UserRoleData {
  role: UserRole | null;
  loading: boolean;
  isOwner: boolean;
  isManager: boolean;
  isAdmin: boolean;
  canManageUsers: boolean;
}

export const useUserRole = (): UserRoleData => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user');
        } else {
          setRole(data?.role || 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isOwner = role === 'owner';
  const isManager = role === 'manager';
  const isAdmin = role === 'admin';
  const canManageUsers = isOwner || isManager || isAdmin;

  return {
    role,
    loading,
    isOwner,
    isManager,
    isAdmin,
    canManageUsers
  };
};
