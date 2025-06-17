import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
dotenv.config();

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER!],
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

export const startConsumer = async () => {
  await consumer.connect();
  console.log('📡 Notification service connected to Kafka');

  await consumer.subscribe({ topic: 'tickets', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value?.toString();
      if (!value) return;

      const parsed = JSON.parse(value);
      console.log(`📨 Notification: ${parsed.event} -`, parsed.data);
    },
  });
};
