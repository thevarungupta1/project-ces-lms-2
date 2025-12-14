import { ApiError } from '../../core/http/ApiError';
import { CourseAssignmentRepository } from './course-assignment.repository';
import { ICourseAssignment } from '../../models/CourseAssignment.model';
import { CreateCourseAssignmentInput } from '../../schemas/courseAssignment.schema';
import { Course } from '../../models/Course.model';
import { User } from '../../models/User.model';
import { Group } from '../../models/Group.model';

export class CourseAssignmentService {
  private courseAssignmentRepository: CourseAssignmentRepository;

  constructor() {
    this.courseAssignmentRepository = new CourseAssignmentRepository();
  }

  async createAssignment(data: CreateCourseAssignmentInput, assignedBy: string): Promise<ICourseAssignment> {
    // Verify course exists
    const course = await Course.findById(data.course);
    if (!course) {
      throw ApiError.notFound('Course not found');
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
    const existing = await this.courseAssignmentRepository.findByLearnerAndCourse(data.learner, data.course);
    if (existing) {
      throw ApiError.conflict('Course already assigned to this learner');
    }

    return this.courseAssignmentRepository.create({
      ...data,
      assignedBy,
      status: 'not_started',
      progress: 0,
      assignedAt: new Date(),
    } as any);
  }

  async assignToGroup(courseId: string, groupId: string, assignedBy: string, dueDate?: string): Promise<ICourseAssignment[]> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw ApiError.notFound('Course not found');
    }

    const group = await Group.findById(groupId);
    if (!group) {
      throw ApiError.notFound('Group not found');
    }

    const assignments: ICourseAssignment[] = [];
    for (const memberId of group.members) {
      const existing = await this.courseAssignmentRepository.findByLearnerAndCourse(memberId.toString(), courseId);
      if (!existing) {
        const assignment = await this.courseAssignmentRepository.create({
          course: courseId,
          learner: memberId,
          assignedBy,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          group: groupId,
          status: 'not_started',
          progress: 0,
          assignedAt: new Date(),
        } as any);
        assignments.push(assignment);
      }
    }

    return assignments;
  }

  async getAssignmentById(id: string): Promise<ICourseAssignment> {
    const assignment = await this.courseAssignmentRepository.findById(id);
    if (!assignment) {
      throw ApiError.notFound('Assignment not found');
    }
    return assignment;
  }

  async getAssignments(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.courseAssignmentRepository.findWithPagination(
      filters,
      page,
      limit,
      { assignedAt: -1 }
    );
    return { data, total, page, limit };
  }

  async updateProgress(id: string, progress: number, status?: string): Promise<ICourseAssignment> {
    const updateData: any = { progress };
    if (status) {
      updateData.status = status;
    }
    if (progress === 0 && !status) {
      updateData.status = 'not_started';
    } else if (progress > 0 && progress < 100 && !status) {
      updateData.status = 'in_progress';
      if (!updateData.startedAt) {
        updateData.startedAt = new Date();
      }
    } else if (progress === 100 && !status) {
      updateData.status = 'completed';
      updateData.completedAt = new Date();
    }

    const assignment = await this.courseAssignmentRepository.updateById(id, updateData);
    if (!assignment) {
      throw ApiError.notFound('Assignment not found');
    }
    return assignment;
  }

  async updateAssignment(id: string, data: any): Promise<ICourseAssignment> {
    const assignment = await this.courseAssignmentRepository.updateById(id, data);
    if (!assignment) {
      throw ApiError.notFound('Assignment not found');
    }
    return assignment;
  }

  async deleteAssignment(id: string): Promise<boolean> {
    const deleted = await this.courseAssignmentRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Assignment not found');
    }
    return deleted;
  }
}

