"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI;
mongoose_1.default.connect(MONGO_URI).then(() => {
    console.log('🔗 Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`🚀 Auth Service running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
