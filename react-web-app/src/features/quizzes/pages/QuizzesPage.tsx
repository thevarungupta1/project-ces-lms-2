import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, FileQuestion, Plus, Loader2 } from 'lucide-react';
import { useQuizzes } from '../hooks/useQuizzes';
import type { Quiz } from '../api/quiz.api';

const Quizzes = () => {
  const { user, role } = useAuth();
  
  // Fetch quizzes based on role
  const filters = role === 'educator' && user?.id 
    ? { createdBy: user.id } 
    : undefined;
  
  const { data: quizzesResponse, isLoading } = useQuizzes(filters);
  
  // Map API response to component format
  const quizzes = quizzesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading quizzes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
          <p className="text-muted-foreground mt-2">
            {role === 'admin' && 'Manage all quizzes across courses'}
            {role === 'educator' && 'Create and manage your quizzes'}
            {role === 'learner' && 'View and take available quizzes'}
          </p>
        </div>
        {(role === 'admin' || role === 'educator') && (
          <Button asChild>
            <Link to="/quizzes/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Link>
          </Button>
        )}
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No quizzes found</h3>
            <p className="text-sm text-muted-foreground">
              {role === 'admin' || role === 'educator' 
                ? 'Create your first quiz to get started.'
                : 'No quizzes have been assigned to you yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((quiz) => {
            const quizId = quiz._id || quiz.id || '';
            const courseName = typeof quiz.course === 'object' ? quiz.course.title : 'Unknown Course';
            const createdByName = typeof quiz.createdBy === 'object' ? quiz.createdBy.name : 'Unknown';
            
            return (
              <Card key={quizId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{courseName}</Badge>
                    <Badge variant="secondary">{quiz.totalQuestions} questions</Badge>
                  </div>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription>
                    Created by {createdByName} • {new Date(quiz.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.passingScore}% to pass</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-3">
                        Attempts allowed: {quiz.attempts}
                      </p>
                      <Button className="w-full" variant={role === 'learner' ? 'default' : 'outline'} asChild>
                        <Link to={`/quizzes/${quizId}`}>
                          {role === 'learner' ? 'Start Quiz' : 'View Details'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
