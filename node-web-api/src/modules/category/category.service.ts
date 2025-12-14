import { ApiError } from '../../core/http/ApiError';
import { CategoryRepository } from './category.repository';
import { ICategory } from '../../models/Category.model';
import { CreateCategoryInput, UpdateCategoryInput } from '../../schemas/category.schema';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(data: CreateCategoryInput): Promise<ICategory> {
    const existingCategory = await this.categoryRepository.findByName(data.name);
    if (existingCategory) {
      throw ApiError.conflict('Category with this name already exists');
    }

    return this.categoryRepository.create(data as any);
  }

  async getCategoryById(id: string): Promise<ICategory> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    return category;
  }

  async getCategories(page: number = 1, limit: number = 100, filters: any = {}) {
    const { data, total } = await this.categoryRepository.findWithPagination(
      filters,
      page,
      limit
    );
    return { data, total, page, limit };
  }

  async updateCategory(id: string, data: UpdateCategoryInput): Promise<ICategory> {
    if (data.name) {
      const existingCategory = await this.categoryRepository.findByName(data.name);
      if (existingCategory && existingCategory._id.toString() !== id) {
        throw ApiError.conflict('Category with this name already exists');
      }
    }

    const category = await this.categoryRepository.updateById(id, data);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    return category;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const deleted = await this.categoryRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Category not found');
    }
    return deleted;
  }
}

