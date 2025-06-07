
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, Shield, Crown, Settings, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/hooks/useUserRole';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role: UserRole;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at');

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const usersWithRoles = profiles?.map(profile => {
        const userRole = roles?.find(role => role.user_id === profile.id);
        return {
          ...profile,
          role: (userRole?.role as UserRole) || 'user'
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole,
          assigned_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'manager': return <Shield className="h-4 w-4 text-purple-400" />;
      case 'admin': return <Settings className="h-4 w-4 text-blue-400" />;
      default: return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'owner': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'manager': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'admin': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardContent className="p-8 text-center">
          <div className="text-white">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <UserPlus className="h-5 w-5 text-purple-400" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white"
            />
          </div>

          {/* Users Table */}
          <div className="rounded-lg overflow-hidden border border-slate-600">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-700/50">
                  <TableHead className="text-slate-300">User</TableHead>
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Role</TableHead>
                  <TableHead className="text-slate-300">Joined</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="bg-slate-800/30 border-slate-600">
                    <TableCell className="text-white">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        {user.full_name || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: UserRole) => updateUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="user" className="text-white">User</SelectItem>
                          <SelectItem value="admin" className="text-white">Admin</SelectItem>
                          <SelectItem value="manager" className="text-white">Manager</SelectItem>
                          <SelectItem value="owner" className="text-white">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              No users found matching your search.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
