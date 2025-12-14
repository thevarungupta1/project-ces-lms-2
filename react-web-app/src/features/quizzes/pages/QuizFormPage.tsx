import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { useCreateQuiz, useUpdateQuiz } from '../hooks/useQuizzes';
import { useQuiz } from '../hooks/useQuizzes';
import { useCourses } from '@/features/courses/hooks/useCourses';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const QuizForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedCourseId = searchParams.get('courseId');
  const isEditMode = !!id;

  // Fetch existing quiz if editing
  const { data: existingQuiz, isLoading: loadingQuiz } = useQuiz(id || '');
  
  // Fetch courses
  const { data: coursesResponse } = useCourses();
  const courses = coursesResponse?.data || [];

  // Mutations
  const createMutation = useCreateQuiz();
  const updateMutation = useUpdateQuiz();

  const [formData, setFormData] = useState({
    title: '',
    courseId: preselectedCourseId || '',
    duration: '',
    passingScore: '70',
    attempts: '3',
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  ]);

  // Populate form when editing
  useEffect(() => {
    if (existingQuiz) {
      const courseId = typeof existingQuiz.course === 'object' ? existingQuiz.course._id : existingQuiz.course;
      
      setFormData({
        title: existingQuiz.title,
        courseId: courseId || '',
        duration: existingQuiz.duration.toString(),
        passingScore: existingQuiz.passingScore.toString(),
        attempts: existingQuiz.attempts.toString(),
      });

      setQuestions(
        existingQuiz.questions.map((q, idx) => ({
          id: (idx + 1).toString(),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        }))
      );
    }
  }, [existingQuiz]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.courseId || !formData.duration || questions.length === 0) {
      return;
    }

    // Validate questions
    const invalidQuestions = questions.some(q => 
      !q.question || q.options.some(opt => !opt) || q.options.length < 2
    );
    
    if (invalidQuestions) {
      return;
    }

    const quizData = {
      title: formData.title,
      course: formData.courseId,
      duration: parseInt(formData.duration),
      totalQuestions: questions.length,
      passingScore: parseInt(formData.passingScore),
      attempts: parseInt(formData.attempts),
      questions: questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    };

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: quizData });
      } else {
        await createMutation.mutateAsync(quizData);
      }
      navigate('/quizzes');
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      id: (questions.length + 1).toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: string, value: string | number) => {
    const updated = [...questions];
    if (field === 'question') {
      updated[index].question = value as string;
    } else if (field === 'correctAnswer') {
      updated[index].correctAnswer = value as number;
    }
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/quizzes')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Quizzes
      </Button>

      {loadingQuiz && isEditMode ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading quiz...</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{isEditMode ? 'Edit Quiz' : 'Create New Quiz'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter quiz title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select value={formData.courseId} onValueChange={(value) => handleChange('courseId', value)}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => {
                      const courseId = course._id || course.id || '';
                      return (
                        <SelectItem key={courseId} value={courseId}>
                          {course.title}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  placeholder="30"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score (%) *</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => handleChange('passingScore', e.target.value)}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attempts">Attempts Allowed *</Label>
                <Input
                  id="attempts"
                  type="number"
                  value={formData.attempts}
                  onChange={(e) => handleChange('attempts', e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Questions</h3>
                <Button type="button" onClick={addQuestion} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                        {questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(qIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question Text *</Label>
                        <Input
                          value={question.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          placeholder="Enter your question"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Answer Options *</Label>
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex gap-2 items-center">
                            <span className="text-sm text-muted-foreground w-6">{oIndex + 1}.</span>
                            <Input
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label>Correct Answer *</Label>
                        <Select
                          value={question.correctAnswer.toString()}
                          onValueChange={(value) => updateQuestion(qIndex, 'correctAnswer', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options.map((_, oIndex) => (
                              <SelectItem key={oIndex} value={oIndex.toString()}>
                                Option {oIndex + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditMode ? 'Update Quiz' : 'Create Quiz'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/quizzes')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default QuizForm;
