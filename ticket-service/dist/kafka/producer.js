"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishEvent = exports.connectKafka = exports.producer = void 0;
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: 'ticket-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});
exports.producer = kafka.producer();
const connectKafka = async () => {
    try {
        await exports.producer.connect();
        console.log(' Kafka connected');
    }
    catch (err) {
        console.error(' Kafka connection failed', err);
    }
};
exports.connectKafka = connectKafka;
const publishEvent = async (event, data) => {
    await exports.producer.send({
        topic: 'tickets',
        messages: [
            {
                key: event,
                value: JSON.stringify({ event, data })
            }
        ]
    });
};
exports.publishEvent = publishEvent;
