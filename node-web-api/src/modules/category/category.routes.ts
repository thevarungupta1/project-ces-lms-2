import { Router } from 'express';
import { CategoryController } from './category.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
} from '../../schemas/category.schema';

const router = Router();
const categoryController = new CategoryController();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', validate(getCategorySchema), categoryController.getCategory);

// Protected routes - Admin only
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(getCategorySchema),
  categoryController.deleteCategory
);

export default router;

