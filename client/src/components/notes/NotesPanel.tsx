import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  StickyNote, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Tag, 
  Clock 
} from "lucide-react";
import type { Note, InsertNote } from "@shared/schema";

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
});

type CreateNoteForm = z.infer<typeof createNoteSchema>;

export function NotesPanel() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateNoteForm>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  });

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const createNoteMutation = useMutation({
    mutationFn: async (data: CreateNoteForm) => {
      const noteData: InsertNote = {
        ...data,
        userId: "", // Will be set by the backend
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
      };
      
      return await apiRequest("POST", "/api/notes", noteData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Note created",
        description: "Your note has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      return await apiRequest("DELETE", `/api/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateNoteForm) => {
    createNoteMutation.mutate(data);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (date: string | Date) => {
    const noteDate = new Date(date);
    const now = new Date();
    const diffTime = now.getTime() - noteDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffTime < 60 * 60 * 1000) { // Less than 1 hour
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffTime < 24 * 60 * 60 * 1000) { // Less than 1 day
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return noteDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: noteDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            Quick Notes
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="button-create-note">
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Note title" {...field} data-testid="input-note-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your note here..." 
                            rows={4}
                            {...field} 
                            data-testid="textarea-note-content" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Comma-separated tags" 
                            {...field} 
                            data-testid="input-note-tags"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      data-testid="button-cancel-note"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createNoteMutation.isPending}
                      data-testid="button-submit-note"
                    >
                      {createNoteMutation.isPending ? "Creating..." : "Create Note"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-notes"
          />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-background rounded-lg p-4 border border-border animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="space-y-2 mb-3">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-4 bg-muted rounded w-12"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No notes found" : "No notes yet"}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "Create your first note to capture ideas and important information"
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first-note">
                <Plus className="mr-2 h-4 w-4" />
                Create Note
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-background rounded-lg p-4 border border-border hover:shadow-md transition-all cursor-pointer group"
                data-testid={`note-card-${note.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium line-clamp-1 flex-1">{note.title}</h4>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-note-menu-${note.id}`}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid={`menu-edit-note-${note.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Note
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteNoteMutation.mutate(note.id)}
                        data-testid={`menu-delete-note-${note.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {note.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <div className="flex gap-1">
                          {note.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{note.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(note.updatedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
