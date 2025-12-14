import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/app/providers';
import { ArrowLeft, Clock, FileQuestion, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { QuizAssignmentDialog } from '@/components/QuizAssignmentDialog';
import { useQuiz } from '../hooks/useQuizzes';
import { useQuizAssignments } from '../hooks/useQuizAssignments';
import { useSubmitQuiz } from '../hooks/useQuizAssignments';
import { PageLoader, InlineLoader } from '@/shared/components';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const isLearner = role === 'learner';

  // Fetch quiz from API
  const { data: quizData, isLoading: loadingQuiz } = useQuiz(id || '');
  
  // Fetch user's assignment if learner
  const { data: assignmentsResponse } = useQuizAssignments(
    isLearner && user?.id && id ? { quiz: id, learner: user.id } : undefined
  );
  const userAssignment = assignmentsResponse?.data?.[0];

  // Submit mutation
  const submitMutation = useSubmitQuiz();

  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  // Map API data to component format
  const quiz = useMemo(() => {
    if (!quizData) return null;
    
    const courseName = typeof quizData.course === 'object' ? quizData.course.title : 'Unknown Course';
    const createdByName = typeof quizData.createdBy === 'object' ? quizData.createdBy.name : 'Unknown';
    
    return {
      id: quizData._id || quizData.id || '',
      title: quizData.title,
      courseId: typeof quizData.course === 'object' ? quizData.course._id : quizData.course,
      courseName,
      createdBy: createdByName,
      createdDate: quizData.createdAt,
      duration: quizData.duration,
      totalQuestions: quizData.totalQuestions,
      passingScore: quizData.passingScore,
      attempts: quizData.attempts,
      questions: quizData.questions.map((q, idx) => ({
        id: idx.toString(),
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    };
  }, [quizData]);

  if (loadingQuiz) {
    return <PageLoader text="Loading quiz..." />;
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Quiz not found</h2>
        <Button onClick={() => navigate('/quizzes')} className="mt-4">
          Back to Quizzes
        </Button>
      </div>
    );
  }

  const handleStartQuiz = () => {
    setIsStarted(true);
  };

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userAssignment?._id || !userAssignment?.id) {
      return;
    }

    // Convert answers to API format
    const submitAnswers = Object.entries(answers).map(([questionIndex, selectedAnswer]) => ({
      questionIndex: parseInt(questionIndex),
      selectedAnswer,
    }));

    try {
      const result = await submitMutation.mutateAsync({
        id: userAssignment._id || userAssignment.id,
        data: { answers: submitAnswers },
      });
      
      setScore(result.score);
      setPassed(result.passed);
      setIsCompleted(true);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className={`h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              passed ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
            }`}>
              {passed ? <CheckCircle className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
            </div>
            <CardTitle className="text-2xl">
              {passed ? 'Congratulations!' : 'Quiz Completed'}
            </CardTitle>
            <CardDescription>
              You scored {score.toFixed(0)}% on this quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Your Score</span>
                <span className="font-semibold">{score.toFixed(0)}%</span>
              </div>
              <Progress value={score} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Passing score: {quiz.passingScore}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-success">
                  {Object.entries(answers).filter(([idx, ans]) => 
                    quiz.questions[parseInt(idx)]?.correctAnswer === ans
                  ).length}
                </p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-destructive">
                  {quiz.questions.length - Object.entries(answers).filter(([idx, ans]) => 
                    quiz.questions[parseInt(idx)]?.correctAnswer === ans
                  ).length}
                </p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" onClick={() => navigate('/quizzes')}>
                Back to Quizzes
              </Button>
              <Button className="flex-1" variant="outline" asChild>
                <Link to={`/courses/${quiz.courseId}`}>View Course</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/quizzes')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quizzes
        </Button>

        <Card>
          <CardHeader>
            <Badge variant="outline" className="w-fit mb-2">{quiz.courseName}</Badge>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <CardDescription>
              Created by {quiz.createdBy} • {new Date(quiz.createdDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <FileQuestion className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{quiz.totalQuestions}</p>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{quiz.duration}</p>
                  <p className="text-sm text-muted-foreground">Minutes</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">Quiz Information</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Passing score: {quiz.passingScore}%</li>
                <li>• Attempts allowed: {quiz.attempts}</li>
                <li>• All questions must be answered</li>
                <li>• You can navigate between questions before submitting</li>
              </ul>
            </div>

            {isLearner ? (
              <Button size="lg" className="w-full" onClick={handleStartQuiz}>
                Start Quiz
              </Button>
            ) : (
              <div className="space-y-2">
                <QuizAssignmentDialog quizId={id || ''} quizTitle={quiz.title}>
                  <Button size="lg" className="w-full" variant="default">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign to Learners
                  </Button>
                </QuizAssignmentDialog>
                <Button size="lg" className="w-full" asChild>
                  <Link to={`/quizzes/${id}/edit`}>Edit Quiz</Link>
                </Button>
                <Button size="lg" className="w-full" variant="outline" onClick={handleStartQuiz}>
                  Preview Quiz
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </h2>
        <Badge variant="outline">
          <Clock className="mr-1 h-3 w-3" />
          {quiz.duration}m
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQuestion]?.toString()}
            onValueChange={(value) => handleAnswerChange(currentQuestion, parseInt(value))}
          >
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <div className="flex-1" />
        {currentQuestion === quiz.questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== quiz.questions.length || submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <InlineLoader size="sm" text="Submitting..." />
            ) : (
              'Submit Quiz'
            )}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizDetail;
