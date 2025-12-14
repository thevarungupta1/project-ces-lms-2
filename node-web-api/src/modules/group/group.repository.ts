import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { Group, IGroup } from '../../models/Group.model';

export class GroupRepository extends BaseRepository<IGroup> {
  constructor() {
    super(Group);
  }

  async findByCreator(createdBy: string) {
    return this.find({ createdBy });
  }

  async findActiveGroups() {
    return this.find({ isActive: true });
  }

  async findByMember(memberId: string) {
    return this.find({ members: memberId });
  }
}

