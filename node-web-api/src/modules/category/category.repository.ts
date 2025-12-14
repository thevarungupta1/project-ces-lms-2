import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { Category, ICategory } from '../../models/Category.model';

export class CategoryRepository extends BaseRepository<ICategory> {
  constructor() {
    super(Category);
  }

  async findByName(name: string): Promise<ICategory | null> {
    return this.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  }
}

