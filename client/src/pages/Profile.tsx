import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { User } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { User as UserIcon, GraduationCap, Heart, Trash2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { toast } = useToast();
  const [major, setMajor] = useState('');
  const [hobbyInput, setHobbyInput] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/auth/user'],
  });

  useEffect(() => {
    if (user) {
      setMajor(user.major || '');
      setHobbies(user.hobbies || []);
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { major?: string; hobbies?: string[] }) =>
      apiRequest('PUT', '/api/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Profile updated! 🎉",
        description: "Your changes have been saved successfully.",
      });
    },
  });

  const resetDataMutation = useMutation({
    mutationFn: async () => apiRequest('POST', '/api/data/reset'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/subjects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Data reset complete! 🔄",
        description: "All your data has been cleared. Start fresh!",
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({ major, hobbies });
  };

  const handleAddHobby = () => {
    if (hobbyInput.trim() && !hobbies.includes(hobbyInput.trim())) {
      const newHobbies = [...hobbies, hobbyInput.trim()];
      setHobbies(newHobbies);
      setHobbyInput('');
    }
  };

  const handleRemoveHobby = (hobby: string) => {
    setHobbies(hobbies.filter(h => h !== hobby));
  };

  const handleResetData = () => {
    resetDataMutation.mutate();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Student Profile 👤
        </h2>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Profile Info */}
      <Card data-testid="card-profile-info">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Your basic profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Major / Field of Study
            </Label>
            <Input
              placeholder="e.g., Computer Science, Biology, Engineering..."
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              data-testid="input-major"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Hobbies & Interests
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a hobby..."
                value={hobbyInput}
                onChange={(e) => setHobbyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()}
                data-testid="input-hobby"
              />
              <Button onClick={handleAddHobby} variant="outline" data-testid="button-add-hobby">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {hobbies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3" data-testid="hobbies-list">
                {hobbies.map((hobby, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-3 pr-1 py-1 gap-1"
                    data-testid={`hobby-${index}`}
                  >
                    {hobby}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 hover:bg-transparent"
                      onClick={() => handleRemoveHobby(hobby)}
                      data-testid={`button-remove-hobby-${index}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={updateProfileMutation.isPending}
            className="w-full"
            data-testid="button-save-profile"
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card data-testid="card-account-info">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your login details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {user && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="font-medium" data-testid="text-user-name">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="font-medium" data-testid="text-user-email">
                  {user.email}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Data Reset */}
      <Card className="border-destructive/50" data-testid="card-data-reset">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete all your data including tasks, notes, subjects, and study sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" data-testid="button-reset-data-trigger">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-testid="dialog-confirm-reset">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    This action cannot be undone. This will permanently delete:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>All your tasks</li>
                    <li>All your notes</li>
                    <li>All your subjects</li>
                    <li>All your study sessions</li>
                    <li>Your profile information (major & hobbies)</li>
                  </ul>
                  <p className="font-semibold text-destructive mt-3">
                    This will NOT delete your account - you'll still be able to log in.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-testid="button-cancel-reset">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  data-testid="button-confirm-reset"
                >
                  Yes, Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
