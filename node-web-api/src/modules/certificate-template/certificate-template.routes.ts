import { Router } from 'express';
import { CertificateTemplateController } from './certificate-template.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createCertificateTemplateSchema,
  updateCertificateTemplateSchema,
} from '../../schemas/certificateTemplate.schema';

const router = Router();
const certificateTemplateController = new CertificateTemplateController();

// Public routes
router.get('/', certificateTemplateController.getTemplates);
router.get('/default', certificateTemplateController.getDefaultTemplate);
router.get('/:id', certificateTemplateController.getTemplate);

// Protected routes - Admin only
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createCertificateTemplateSchema),
  certificateTemplateController.createTemplate
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateCertificateTemplateSchema),
  certificateTemplateController.updateTemplate
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  certificateTemplateController.deleteTemplate
);

export default router;

