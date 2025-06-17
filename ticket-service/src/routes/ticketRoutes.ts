import { Router } from 'express';
import {
  createTicket,
  assignTicket,
  approveTicket,
  resolveTicket,
  rejectTicket,
} from '../controllers/ticketController';
import { isAuth, hasRole } from '../middleware/auth';

const router = Router();
router.post('/', isAuth, hasRole(['customer']), createTicket);
router.patch('/:id/assign', isAuth, hasRole(['agent']), assignTicket);
router.patch('/:id/approve', isAuth, hasRole(['manager']), approveTicket);
router.patch('/:id/resolve', isAuth, hasRole(['agent', 'manager']), resolveTicket);
router.patch('/:id/reject', isAuth, hasRole(['manager']), rejectTicket);

export default router;
