import { ApiError } from '../../core/http/ApiError';
import { CertificateTemplateRepository } from './certificate-template.repository';
import { ICertificateTemplate } from '../../models/CertificateTemplate.model';
import { CreateCertificateTemplateInput, UpdateCertificateTemplateInput } from '../../schemas/certificateTemplate.schema';

export class CertificateTemplateService {
  private certificateTemplateRepository: CertificateTemplateRepository;

  constructor() {
    this.certificateTemplateRepository = new CertificateTemplateRepository();
  }

  async createTemplate(data: CreateCertificateTemplateInput): Promise<ICertificateTemplate> {
    // If setting as default, unset other defaults
    if (data.isDefault) {
      const existingDefault = await this.certificateTemplateRepository.findDefault();
      if (existingDefault) {
        await this.certificateTemplateRepository.updateById(existingDefault._id.toString(), { isDefault: false });
      }
    }

    return this.certificateTemplateRepository.create(data as any);
  }

  async getTemplateById(id: string): Promise<ICertificateTemplate> {
    const template = await this.certificateTemplateRepository.findById(id);
    if (!template) {
      throw ApiError.notFound('Certificate template not found');
    }
    return template;
  }

  async getTemplates(page: number = 1, limit: number = 100, filters: any = {}) {
    const { data, total } = await this.certificateTemplateRepository.findWithPagination(
      filters,
      page,
      limit
    );
    return { data, total, page, limit };
  }

  async updateTemplate(id: string, data: UpdateCertificateTemplateInput): Promise<ICertificateTemplate> {
    // If setting as default, unset other defaults
    if (data.isDefault) {
      const existingDefault = await this.certificateTemplateRepository.findDefault();
      if (existingDefault && existingDefault._id.toString() !== id) {
        await this.certificateTemplateRepository.updateById(existingDefault._id.toString(), { isDefault: false });
      }
    }

    const template = await this.certificateTemplateRepository.updateById(id, data);
    if (!template) {
      throw ApiError.notFound('Certificate template not found');
    }
    return template;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const deleted = await this.certificateTemplateRepository.deleteById(id);
    if (!deleted) {
      throw ApiError.notFound('Certificate template not found');
    }
    return deleted;
  }

  async getDefaultTemplate(): Promise<ICertificateTemplate | null> {
    return this.certificateTemplateRepository.findDefault();
  }
}

