import { ApiError } from '../../core/http/ApiError';
import { QuizAssignmentRepository } from './quiz-assignment.repository';
import { IQuizAssignment } from '../../models/QuizAssignment.model';
import { CreateQuizAssignmentInput, SubmitQuizInput } from '../../schemas/quizAssignment.schema';
import { Quiz } from '../../models/Quiz.model';
import { User } from '../../models/User.model';
import { Group } from '../../models/Group.model';

export class QuizAssignmentService {
  private quizAssignmentRepository: QuizAssignmentRepository;

  constructor() {
    this.quizAssignmentRepository = new QuizAssignmentRepository();
  }

  async createAssignment(data: CreateQuizAssignmentInput, assignedBy: string): Promise<IQuizAssignment> {
    // Verify quiz exists
    const quiz = await Quiz.findById(data.quiz);
    if (!quiz) {
      throw ApiError.notFound('Quiz not found');
    }

    // Verify learner exists and is a learner
    const learner = await User.findById(data.learner);
    if (!learner) {
      throw ApiError.notFound('Learner not found');
    }
    if (learner.role !== 'learner') {
      throw ApiError.badRequest('User must be a learner');
    }

    // Verify group if provided
    if (data.group) {
      const group = await Group.findById(data.group);
      if (!group) {
        throw ApiError.notFound('Group not found');
      }
    }

    // Check if assignment already exists
    const existing = await this.quizAssignmentRepository.findByLearnerAndQuiz(data.learner, data.quiz);
    if (existing) {
      throw ApiError.conflict('Quiz already assigned to this learner');
    }

    return this.quizAssignmentRepository.create({
      ...data,
      assignedBy,
      status: 'assigned',
      attemptsUsed: 0,
    } as any);
  }

  async assignToGroup(quizId: string, groupId: string, assignedBy: string, dueDate?: string): Promise<IQuizAssignment[]> {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw ApiError.notFound('Quiz not found');
    }

    const group = await Group.findById(groupId);
    if (!group) {
      throw ApiError.notFound('Group not found');
    }

    const assignments: IQuizAssignment[] = [];
    for (const memberId of group.members) {
      const existing = await this.quizAssignmentRepository.findByLearnerAndQuiz(memberId.toString(), quizId);
      if (!existing) {
        const assignment = await this.quizAssignmentRepository.create({
          quiz: quizId,
          learner: memberId,
          assignedBy,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          group: groupId,
          status: 'assigned',
          attemptsUsed: 0,
        } as any);
        assignments.push(assignment);
      }
    }

    return assignments;
  }

  async getAssignmentById(id: string): Promise<IQuizAssignment> {
    const assignment = await this.quizAssignmentRepository.findById(id);
    if (!assignment) {
      throw ApiError.notFound('Assignment not found');
    }
    return assignment;
  }

  async getAssignments(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.quizAssignmentRepository.findWithPagination(
      filters,
      page,
      limit,
      { assignedAt: -1 }
    );
    return { data, total, page, limit };
  }

  async submitQuiz(id: string, data: SubmitQuizInput, quiz: any): Promise<{ score: number; passed: boolean }> {
    const assignment = await this.quizAssignmentRepository.findById(id);
    if (!assignment) {
      throw ApiError.notFound('Assignment not found');
    }

    if (assignment.attemptsUsed >= quiz.attempts) {
      throw ApiError.badRequest('Maximum attempts reached');
    }

    // Calculate score
    let correctAnswers = 0;
    data.answers.forEach((answer) => {
      const question = quiz.questions[answer.questionIndex];
      if (question && question.correctAnswer === answer.selectedAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Update assignment
    await this.quizAssignmentRepository.updateById(id, {
      attemptsUsed: assignment.attemptsUsed + 1,
      bestScore: assignment.bestScore ? Math.max(assignment.bestScore, score) : score,
      status: passed ? 'completed' : assignment.status === 'assigned' ? 'in_progress' : assignment.status,
    });

    return { score, passed };
  }

  async updateAssignment(id: string, data: any): Promise<IQuizAssignment> {
    const assignment = await this.quizAssignmentRepository.updateById(id, data);
    if (!assignment) {
      throw ApiError.notFound('Assignment not found');
    }
    return assignment;
  }

  async deleteAssignment(id: string): Promise<boolean> {
    const deleted = await this.quizAssignmentRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Assignment not found');
    }
    return deleted;
  }
}

