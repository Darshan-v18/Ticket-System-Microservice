"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const producer_1 = require("./kafka/producer");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/tickets', ticketRoutes_1.default);
const PORT = process.env.PORT || 4002;
const MONGO_URI = process.env.MONGO_URI;
mongoose_1.default.connect(MONGO_URI)
    .then(async () => {
    await (0, producer_1.connectKafka)();
    console.log('🔗 Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`🚀 Ticket Service running at http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
});
