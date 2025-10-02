import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Subject, InsertSubject } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Trash2, Edit, Plus, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const emojiOptions = ['📚', '📖', '📝', '🔬', '🧪', '🧬', '💻', '🎨', '🎵', '⚽', '🏀', '🌍', '📊', '🔢', '✍️'];
const colorOptions = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6'];

export default function Subjects() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const { toast } = useToast();

  const form = useForm<Omit<InsertSubject, 'userId'>>({
    defaultValues: {
      name: '',
      color: '#8B5CF6',
      icon: '📚',
      targetHours: 10,
    },
  });

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ['/api/subjects'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<InsertSubject, 'userId'>) =>
      apiRequest('POST', '/api/subjects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subjects'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Subject created",
        description: "Your subject has been added successfully! 🎉",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<InsertSubject, 'userId'>> }) =>
      apiRequest('PUT', `/api/subjects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subjects'] });
      setIsDialogOpen(false);
      setEditingSubject(null);
      form.reset();
      toast({
        title: "Subject updated",
        description: "Your changes have been saved! ✨",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      apiRequest('DELETE', `/api/subjects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subjects'] });
      toast({
        title: "Subject deleted",
        description: "Subject removed successfully",
      });
    },
  });

  const handleSubmit = (data: Omit<InsertSubject, 'userId'>) => {
    if (editingSubject) {
      updateMutation.mutate({ id: editingSubject.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    form.reset({
      name: subject.name,
      color: subject.color || '#8B5CF6',
      icon: subject.icon || '📚',
      targetHours: subject.targetHours || 10,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingSubject(null);
    form.reset({
      name: '',
      color: '#8B5CF6',
      icon: '📚',
      targetHours: 10,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Subjects 📚
          </h2>
          <p className="text-muted-foreground">Manage your subjects and study goals</p>
        </div>
        <Button onClick={handleAdd} data-testid="button-add-subject">
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              No subjects yet
            </CardTitle>
            <CardDescription>
              Create your first subject to start tracking your study progress!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAdd} variant="outline" data-testid="button-create-first-subject">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Subject
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="border-l-4 transition-all hover:shadow-lg"
              style={{ borderLeftColor: subject.color || '#8B5CF6' }}
              data-testid={`card-subject-${subject.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl" data-testid={`icon-subject-${subject.id}`}>
                      {subject.icon || '📚'}
                    </div>
                    <div>
                      <CardTitle className="text-lg" data-testid={`title-subject-${subject.id}`}>
                        {subject.name}
                      </CardTitle>
                      <CardDescription data-testid={`target-subject-${subject.id}`}>
                        Target: {subject.targetHours || 0}h/week
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(subject)}
                      data-testid={`button-edit-${subject.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(subject.id)}
                      data-testid={`button-delete-${subject.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent data-testid="dialog-subject-form">
          <DialogHeader>
            <DialogTitle data-testid="dialog-title">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </DialogTitle>
            <DialogDescription>
              {editingSubject ? 'Update your subject details' : 'Create a new subject to track your studies'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: 'Subject name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mathematics" {...field} data-testid="input-subject-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <div className="flex gap-2 flex-wrap">
                        {emojiOptions.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => field.onChange(emoji)}
                            className={`text-2xl p-2 rounded-md transition-all ${
                              field.value === emoji ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'
                            }`}
                            data-testid={`button-icon-${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-2 flex-wrap">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => field.onChange(color)}
                            className={`w-10 h-10 rounded-md transition-all ${
                              field.value === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                            }`}
                            style={{ backgroundColor: color }}
                            data-testid={`button-color-${color}`}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Target (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="168"
                        value={field.value || 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                        name={field.name}
                        data-testid="input-target-hours"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-subject"
                >
                  {editingSubject ? 'Update' : 'Create'} Subject
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
