import { Request, Response, NextFunction } from 'express';
import { IssuedCertificateService } from './issued-certificate.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';

export class IssuedCertificateController {
  private issuedCertificateService: IssuedCertificateService;

  constructor() {
    this.issuedCertificateService = new IssuedCertificateService();
  }

  issueCertificate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const certificate = await this.issuedCertificateService.issueCertificate(req.body);
      res.status(201).json(ResponseBuilder.success(certificate, 'Certificate issued successfully'));
    } catch (error) {
      next(error);
    }
  };

  getCertificate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const certificate = await this.issuedCertificateService.getCertificateById(id);
      res.json(ResponseBuilder.success(certificate));
    } catch (error) {
      next(error);
    }
  };

  getCertificateByNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { certificateNumber } = req.params;
      const certificate = await this.issuedCertificateService.getCertificateByNumber(certificateNumber);
      res.json(ResponseBuilder.success(certificate));
    } catch (error) {
      next(error);
    }
  };

  getCertificates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      if (req.query.course) filters.course = req.query.course;
      if (req.query.learner) filters.learner = req.query.learner;

      const result = await this.issuedCertificateService.getCertificates(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };
}

