"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectTicket = exports.resolveTicket = exports.approveTicket = exports.assignTicket = exports.createTicket = void 0;
const Ticket_1 = __importDefault(require("../models/Ticket"));
const producer_1 = require("../kafka/producer");
const createTicket = async (req, res) => {
    try {
        const { subject, description } = req.body;
        const ticket = await Ticket_1.default.create({
            subject,
            description,
            customer: req.user.id,
        });
        await (0, producer_1.publishEvent)('ticket.created', {
            ticketId: ticket._id,
            subject: ticket.subject,
            status: ticket.status,
            customer: ticket.customer
        });
        res.status(201).json(ticket);
    }
    catch (err) {
        res.status(500).json({ error: 'Error creating ticket' });
    }
};
exports.createTicket = createTicket;
const assignTicket = async (req, res) => {
    try {
        const ticket = await Ticket_1.default.findById(req.params.id);
        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }
        if (ticket.status !== 'open') {
            res.status(400).json({ message: 'Only open tickets can be assigned' });
            return;
        }
        ticket.agent = req.user.id;
        ticket.status = 'in_progress';
        await ticket.save();
        await (0, producer_1.publishEvent)('ticket.assigned', {
            ticketId: ticket._id,
            status: ticket.status,
            agent: ticket.agent,
        });
        res.status(200).json(ticket);
    }
    catch {
        res.status(500).json({ message: 'Error assigning ticket' });
    }
};
exports.assignTicket = assignTicket;
const approveTicket = async (req, res) => {
    try {
        const ticket = await Ticket_1.default.findById(req.params.id);
        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }
        if (ticket.status !== 'pending_approval') {
            res.status(400).json({ message: 'Ticket not awaiting approval' });
            return;
        }
        ticket.status = 'resolved';
        await ticket.save();
        await (0, producer_1.publishEvent)('ticket.resolved', {
            ticketId: ticket._id,
            status: ticket.status,
        });
        res.status(200).json(ticket);
    }
    catch {
        res.status(500).json({ message: 'Error approving ticket' });
    }
};
exports.approveTicket = approveTicket;
const resolveTicket = async (req, res) => {
    try {
        const ticket = await Ticket_1.default.findById(req.params.id);
        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }
        if (ticket.status !== 'in_progress') {
            res.status(400).json({ message: 'Ticket is not in progress' });
            return;
        }
        if (req.user?.role === 'agent' && ticket.agent !== req.user.id) {
            res.status(403).json({ message: 'Only assigned agent can resolve' });
            return;
        }
        ticket.status = 'pending_approval';
        await ticket.save();
        await (0, producer_1.publishEvent)('ticket.pending_approval', {
            ticketId: ticket._id,
            status: ticket.status,
        });
        res.status(200).json(ticket);
    }
    catch {
        res.status(500).json({ message: 'Error resolving ticket' });
    }
};
exports.resolveTicket = resolveTicket;
const rejectTicket = async (req, res) => {
    try {
        const ticket = await Ticket_1.default.findById(req.params.id);
        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }
        if (ticket.status !== 'pending_approval') {
            res.status(400).json({ message: 'Only pending_approval tickets can be rejected' });
            return;
        }
        ticket.status = ticket.agent ? 'in_progress' : 'open';
        await ticket.save();
        await (0, producer_1.publishEvent)('ticket.rejected', {
            ticketId: ticket._id,
            status: ticket.status,
            revertedTo: ticket.agent ? 'in_progress' : 'open',
        });
        res.status(200).json(ticket);
    }
    catch {
        res.status(500).json({ message: 'Error rejecting ticket' });
    }
};
exports.rejectTicket = rejectTicket;
