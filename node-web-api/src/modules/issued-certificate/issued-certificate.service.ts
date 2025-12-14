import { ApiError } from '../../core/http/ApiError';
import { IssuedCertificateRepository } from './issued-certificate.repository';
import { IIssuedCertificate } from '../../models/IssuedCertificate.model';
import { IssueCertificateInput } from '../../schemas/issuedCertificate.schema';
import { Course } from '../../models/Course.model';
import { User } from '../../models/User.model';
import { CertificateTemplate } from '../../models/CertificateTemplate.model';
import { CertificateTemplateRepository } from '../certificate-template/certificate-template.repository';

export class IssuedCertificateService {
  private issuedCertificateRepository: IssuedCertificateRepository;
  private certificateTemplateRepository: CertificateTemplateRepository;

  constructor() {
    this.issuedCertificateRepository = new IssuedCertificateRepository();
    this.certificateTemplateRepository = new CertificateTemplateRepository();
  }

  async issueCertificate(data: IssueCertificateInput): Promise<IIssuedCertificate> {
    // Verify course exists
    const course = await Course.findById(data.course);
    if (!course) {
      throw ApiError.notFound('Course not found');
    }

    // Verify learner exists
    const learner = await User.findById(data.learner);
    if (!learner) {
      throw ApiError.notFound('Learner not found');
    }

    // Check if certificate already issued
    const existing = await this.issuedCertificateRepository.findByCourseAndLearner(data.course, data.learner);
    if (existing) {
      throw ApiError.conflict('Certificate already issued for this course');
    }

    // Get template (use provided or default)
    let templateId = data.template;
    if (!templateId) {
      const defaultTemplate = await this.certificateTemplateRepository.findDefault();
      if (!defaultTemplate) {
        throw ApiError.notFound('No default certificate template found');
      }
      templateId = defaultTemplate._id.toString();
    } else {
      const template = await CertificateTemplate.findById(templateId);
      if (!template) {
        throw ApiError.notFound('Certificate template not found');
      }
    }

    // Generate certificate number
    const year = new Date().getFullYear();
    const count = await this.issuedCertificateRepository.count();
    const certificateNumber = `CERT-${year}-${String(count + 1).padStart(3, '0')}`;

    return this.issuedCertificateRepository.create({
      certificateNumber,
      course: data.course,
      learner: data.learner,
      template: templateId,
      issuedAt: new Date(),
      completionDate: new Date(data.completionDate),
    } as any);
  }

  async getCertificateById(id: string): Promise<IIssuedCertificate> {
    const certificate = await this.issuedCertificateRepository.findById(id);
    if (!certificate) {
      throw ApiError.notFound('Certificate not found');
    }
    return certificate;
  }

  async getCertificateByNumber(certificateNumber: string): Promise<IIssuedCertificate> {
    const certificate = await this.issuedCertificateRepository.findByCertificateNumber(certificateNumber);
    if (!certificate) {
      throw ApiError.notFound('Certificate not found');
    }
    return certificate;
  }

  async getCertificates(page: number = 1, limit: number = 10, filters: any = {}) {
    const { data, total } = await this.issuedCertificateRepository.findWithPagination(
      filters,
      page,
      limit,
      { issuedAt: -1 }
    );
    return { data, total, page, limit };
  }
}

