import { useState, useMemo } from 'react';
import { useAuth } from '@/app/providers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, UserPlus, Users, X, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUsers } from '@/features/users/hooks/useUsers';
import { useQuizAssignments } from '../hooks/useQuizAssignments';
import { useCreateQuizAssignment, useAssignQuizToGroup } from '../hooks/useQuizAssignments';

interface QuizAssignmentDialogProps {
  quizId: string;
  quizTitle: string;
  children: React.ReactNode;
}

export const QuizAssignmentDialog = ({
  quizId,
  quizTitle,
  children,
}: QuizAssignmentDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedLearners, setSelectedLearners] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch learners from API
  const { data: usersResponse, isLoading: usersLoading } = useUsers({ role: 'learner' });
  const learners = usersResponse?.data || [];

  // Fetch existing assignments
  const { data: assignmentsResponse } = useQuizAssignments({ quiz: quizId });
  const existingAssignments = assignmentsResponse?.data || [];

  // Mutations
  const createAssignmentMutation = useCreateQuizAssignment();
  const assignToGroupMutation = useAssignQuizToGroup();

  // Get assigned learner IDs
  const assignedLearnerIds = useMemo(() => {
    return existingAssignments.map(a => {
      const learnerId = typeof a.learner === 'string' ? a.learner : a.learner._id;
      return learnerId;
    });
  }, [existingAssignments]);

  // Filter learners - only show learners not already assigned
  const availableLearners = useMemo(() => {
    return learners
      .filter((u) => !assignedLearnerIds.includes(u.id))
      .filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [learners, assignedLearnerIds, searchTerm]);

  // Get learners from selected groups (TODO: Implement groups API)
  const getLearnersFromGroups = () => {
    // Groups API not yet implemented - return empty for now
    return [];
  };

  const handleAssign = async () => {
    // Handle group assignments first
    if (selectedGroups.length > 0) {
      for (const groupId of selectedGroups) {
        try {
          await assignToGroupMutation.mutateAsync({
            quizId,
            groupId,
            dueDate: dueDate ? dueDate.toISOString() : undefined,
          });
        } catch (error) {
          // Error is handled by the mutation hook
        }
      }
    }

    // Handle individual learner assignments
    if (selectedLearners.length > 0) {
      const dueDateStr = dueDate ? dueDate.toISOString() : undefined;
      
      for (const learnerId of selectedLearners) {
        try {
          await createAssignmentMutation.mutateAsync({
            quiz: quizId,
            learner: learnerId,
            dueDate: dueDateStr,
          });
        } catch (error) {
          // Error is handled by the mutation hook
        }
      }
    }

    if (selectedLearners.length === 0 && selectedGroups.length === 0) {
      return;
    }

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedLearners([]);
    setSelectedGroups([]);
    setDueDate(undefined);
    setSearchTerm('');
  };

  const toggleLearner = (learnerId: string) => {
    setSelectedLearners((prev) =>
      prev.includes(learnerId)
        ? prev.filter((id) => id !== learnerId)
        : [...prev, learnerId]
    );
  };

  const toggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  // TODO: Implement groups API
  const availableGroups: any[] = [];

  const totalSelected = selectedLearners.length + getLearnersFromGroups().length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Quiz to Learners</DialogTitle>
          <DialogDescription>
            Select learners or groups to assign "{quizTitle}" to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs defaultValue="learners" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="learners">
                <UserPlus className="mr-2 h-4 w-4" />
                Individual Learners ({selectedLearners.length})
              </TabsTrigger>
              <TabsTrigger value="groups">
                <Users className="mr-2 h-4 w-4" />
                Groups ({selectedGroups.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="learners" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search learners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-[300px] border rounded-md p-4">
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading learners...</span>
                  </div>
                ) : availableLearners.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {searchTerm ? 'No learners found' : 'All learners are already assigned'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {availableLearners.map((learner) => (
                      <div
                        key={learner.id}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => toggleLearner(learner.id)}
                      >
                        <Checkbox
                          checked={selectedLearners.includes(learner.id)}
                          onCheckedChange={() => toggleLearner(learner.id)}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{learner.name}</p>
                          <p className="text-xs text-muted-foreground">{learner.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="groups" className="space-y-4">
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Group assignment feature coming soon</p>
                  <p className="text-sm mt-1">Groups API integration in progress</p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Select due date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {totalSelected > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md">
              <span className="text-sm font-medium">Selected: {totalSelected} learner(s)</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign} 
              disabled={totalSelected === 0 || createAssignmentMutation.isPending || assignToGroupMutation.isPending}
            >
              {createAssignmentMutation.isPending || assignToGroupMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Quiz'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

