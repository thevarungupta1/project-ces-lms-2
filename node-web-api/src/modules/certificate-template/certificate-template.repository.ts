import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository';
import { CertificateTemplate, ICertificateTemplate } from '../../models/CertificateTemplate.model';

export class CertificateTemplateRepository extends BaseRepository<ICertificateTemplate> {
  constructor() {
    super(CertificateTemplate);
  }

  async findDefault() {
    return this.findOne({ isDefault: true, isActive: true });
  }

  async findActiveTemplates() {
    return this.find({ isActive: true });
  }
}

