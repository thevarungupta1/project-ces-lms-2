import { Router } from 'express';
import { IssuedCertificateController } from './issued-certificate.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  issueCertificateSchema,
  getCertificateByNumberSchema,
} from '../../schemas/issuedCertificate.schema';

const router = Router();
const issuedCertificateController = new IssuedCertificateController();

// Public routes
router.get('/verify/:certificateNumber', validate(getCertificateByNumberSchema), issuedCertificateController.getCertificateByNumber);
router.get('/', issuedCertificateController.getCertificates);
router.get('/:id', issuedCertificateController.getCertificate);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(issueCertificateSchema),
  issuedCertificateController.issueCertificate
);

export default router;

