"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startConsumer = void 0;
const kafkajs_1 = require("kafkajs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const kafka = new kafkajs_1.Kafka({
    clientId: 'notification-service',
    brokers: [process.env.KAFKA_BROKER],
});
const consumer = kafka.consumer({ groupId: 'notification-group' });
const startConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield consumer.connect();
    console.log('📡 Notification service connected to Kafka');
    yield consumer.subscribe({ topic: 'tickets', fromBeginning: true });
    yield consumer.run({
        eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
            var _b;
            const value = (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString();
            if (!value)
                return;
            const parsed = JSON.parse(value);
            console.log(`📨 Notification: ${parsed.event} -`, parsed.data);
        }),
    });
});
exports.startConsumer = startConsumer;
