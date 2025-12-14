import { ApiError } from '../../core/http/ApiError';
import { QuizRepository } from './quiz.repository';
import { IQuiz } from '../../models/Quiz.model';
import { CreateQuizInput, UpdateQuizInput } from '../../schemas/quiz.schema';
import { Course } from '../../models/Course.model';

export class QuizService {
  private quizRepository: QuizRepository;

  constructor() {
    this.quizRepository = new QuizRepository();
  }

  async createQuiz(data: CreateQuizInput, createdBy: string): Promise<IQuiz> {
    // Verify course exists
    const course = await Course.findById(data.course);
    if (!course) {
      throw ApiError.notFound('Course not found');
    }

    // Validate questions
    if (data.questions.length !== data.totalQuestions) {
      throw ApiError.badRequest('Number of questions must match totalQuestions');
    }

    // Validate correct answers
    data.questions.forEach((question, index) => {
      if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        throw ApiError.badRequest(`Invalid correct answer for question ${index + 1}`);
      }
    });

    return this.quizRepository.create({
      ...data,
      createdBy,
      totalQuestions: data.questions.length,
    } as any);
  }

  async getQuizById(id: string): Promise<IQuiz> {
    const quiz = await this.quizRepository.findById(id);
    if (!quiz) {
      throw ApiError.notFound('Quiz not found');
    }
    return quiz;
  }

  async getQuizzes(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.quizRepository.findWithPagination(
      filters,
      page,
      limit,
      { createdAt: -1 }
    );
    return { data, total, page, limit };
  }

  async updateQuiz(id: string, data: UpdateQuizInput): Promise<IQuiz> {
    if (data.questions) {
      // Validate questions if provided
      data.questions.forEach((question, index) => {
        if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
          throw ApiError.badRequest(`Invalid correct answer for question ${index + 1}`);
        }
      });
    }

    const quiz = await this.quizRepository.updateById(id, data);
    if (!quiz) {
      throw ApiError.notFound('Quiz not found');
    }
    return quiz;
  }

  async deleteQuiz(id: string): Promise<boolean> {
    const deleted = await this.quizRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Quiz not found');
    }
    return deleted;
  }

  async getQuizzesByCourse(courseId: string) {
    return this.quizRepository.findByCourse(courseId);
  }
}

