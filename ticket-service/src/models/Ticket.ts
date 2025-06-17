import mongoose, { Document, Schema } from 'mongoose';

export type TicketStatus = 'open' | 'in_progress' | 'pending_approval' | 'resolved';

export interface ITicket extends Document {
  subject: string;
  description: string;
  status: TicketStatus;
  customer: string;
  agent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'pending_approval', 'resolved'],
      default: 'open',
    },
    customer: { type: String, required: true }, 
    agent: { type: String }, 
  },
  { timestamps: true }
);

export default mongoose.model<ITicket>('Ticket', ticketSchema);
