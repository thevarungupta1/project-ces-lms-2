import { ApiError } from '../../core/http/ApiError';
import { GroupRepository } from './group.repository';
import { IGroup } from '../../models/Group.model';
import { CreateGroupInput, UpdateGroupInput } from '../../schemas/group.schema';
import { User } from '../../models/User.model';

export class GroupService {
  private groupRepository: GroupRepository;

  constructor() {
    this.groupRepository = new GroupRepository();
  }

  async createGroup(data: CreateGroupInput, createdBy: string): Promise<IGroup> {
    // Verify all members exist if provided
    if (data.members && data.members.length > 0) {
      for (const memberId of data.members) {
        const user = await User.findById(memberId);
        if (!user) {
          throw ApiError.notFound(`User with ID ${memberId} not found`);
        }
      }
    }

    return this.groupRepository.create({
      ...data,
      createdBy,
    } as any);
  }

  async getGroupById(id: string): Promise<IGroup> {
    const group = await this.groupRepository.findById(id);
    if (!group) {
      throw ApiError.notFound('Group not found');
    }
    return group;
  }

  async getGroups(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.groupRepository.findWithPagination(
      filters,
      page,
      limit,
      { createdAt: -1 }
    );
    return { data, total, page, limit };
  }

  async updateGroup(id: string, data: UpdateGroupInput): Promise<IGroup> {
    // Verify all members exist if provided
    if (data.members && data.members.length > 0) {
      for (const memberId of data.members) {
        const user = await User.findById(memberId);
        if (!user) {
          throw ApiError.notFound(`User with ID ${memberId} not found`);
        }
      }
    }

    const group = await this.groupRepository.updateById(id, data);
    if (!group) {
      throw ApiError.notFound('Group not found');
    }
    return group;
  }

  async deleteGroup(id: string): Promise<boolean> {
    const deleted = await this.groupRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Group not found');
    }
    return deleted;
  }

  async addMember(groupId: string, memberId: string): Promise<IGroup> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw ApiError.notFound('Group not found');
    }

    const user = await User.findById(memberId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (group.members.includes(memberId as any)) {
      throw ApiError.conflict('User is already a member of this group');
    }

    group.members.push(memberId as any);
    await group.save();

    return group;
  }

  async removeMember(groupId: string, memberId: string): Promise<IGroup> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw ApiError.notFound('Group not found');
    }

    group.members = group.members.filter((id) => id.toString() !== memberId);
    await group.save();

    return group;
  }
}

