import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreVertical, Tag } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Note } from "@shared/schema";

export default function NotesPanel() {
  const { user } = useAuth();
  
  const { data: notes = [] } = useQuery({
    queryKey: ['/api/notes'],
    enabled: !!user,
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    },
  });

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const noteDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - noteDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
    
    return noteDate.toLocaleDateString();
  };

  const truncateContent = (content: string | null, maxLength: number = 100) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getTagColor = (tag: string) => {
    const colors = {
      'General': 'secondary',
      'Formulas': 'default',
      'Reading': 'destructive',
      'Projects': 'outline',
    };
    return colors[tag as keyof typeof colors] || 'secondary';
  };

  return (
    <Card id="notes">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Quick Notes</CardTitle>
          <Button data-testid="button-create-note">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📝</div>
            <div className="text-sm">No notes yet</div>
            <div className="text-xs mt-1">Create your first note to get started</div>
          </div>
        ) : (
          notes.map((note: Note) => (
            <Card 
              key={note.id}
              className="hover:shadow-md transition-all cursor-pointer bg-background"
              onClick={() => console.log('Open note', note.id)}
              data-testid={`card-note-${note.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium" data-testid="text-note-title">
                    {note.title}
                  </h4>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-1" data-testid="button-note-menu">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Edit note', note.id);
                        }}
                        data-testid="button-edit-note"
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNoteMutation.mutate(note.id);
                        }}
                        className="text-destructive"
                        data-testid="button-delete-note"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {note.content && (
                  <p className="text-sm text-muted-foreground mb-3" data-testid="text-note-preview">
                    {truncateContent(note.content)}
                  </p>
                )}
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span data-testid="text-note-updated">
                    {formatTimeAgo(note.updatedAt)}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {note.tags && note.tags.length > 0 ? (
                      <div className="flex gap-1">
                        {note.tags.slice(0, 2).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant={getTagColor(tag)}
                            className="text-xs px-1 py-0"
                            data-testid="badge-note-tag"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 2 && (
                          <span className="text-muted-foreground">
                            +{note.tags.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No tags</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
