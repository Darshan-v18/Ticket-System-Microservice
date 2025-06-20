"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.isAuth, (0, auth_1.hasRole)(['customer']), ticketController_1.createTicket);
router.patch('/:id/assign', auth_1.isAuth, (0, auth_1.hasRole)(['agent']), ticketController_1.assignTicket);
router.patch('/:id/approve', auth_1.isAuth, (0, auth_1.hasRole)(['manager']), ticketController_1.approveTicket);
router.patch('/:id/resolve', auth_1.isAuth, (0, auth_1.hasRole)(['agent', 'manager']), ticketController_1.resolveTicket);
router.patch('/:id/reject', auth_1.isAuth, (0, auth_1.hasRole)(['manager']), ticketController_1.rejectTicket);
exports.default = router;
