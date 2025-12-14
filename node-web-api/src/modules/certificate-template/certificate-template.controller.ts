import { Request, Response, NextFunction } from 'express';
import { CertificateTemplateService } from './certificate-template.service';
import { ResponseBuilder } from '../../core/http/ApiResponse';

export class CertificateTemplateController {
  private certificateTemplateService: CertificateTemplateService;

  constructor() {
    this.certificateTemplateService = new CertificateTemplateService();
  }

  createTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const template = await this.certificateTemplateService.createTemplate(req.body);
      res.status(201).json(ResponseBuilder.success(template, 'Certificate template created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const template = await this.certificateTemplateService.getTemplateById(id);
      res.json(ResponseBuilder.success(template));
    } catch (error) {
      next(error);
    }
  };

  getTemplates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;
      const filters: any = {};

      if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';

      const result = await this.certificateTemplateService.getTemplates(page, limit, filters);
      res.json(ResponseBuilder.paginated(result.data, result.page, result.limit, result.total));
    } catch (error) {
      next(error);
    }
  };

  getDefaultTemplate = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const template = await this.certificateTemplateService.getDefaultTemplate();
      res.json(ResponseBuilder.success(template));
    } catch (error) {
      next(error);
    }
  };

  updateTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const template = await this.certificateTemplateService.updateTemplate(id, req.body);
      res.json(ResponseBuilder.success(template, 'Certificate template updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.certificateTemplateService.deleteTemplate(id);
      res.json(ResponseBuilder.success(null, 'Certificate template deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

