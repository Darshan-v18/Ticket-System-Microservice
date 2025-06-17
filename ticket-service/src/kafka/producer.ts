import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'ticket-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

export const producer = kafka.producer();

export const connectKafka = async () => {
  try {
    await producer.connect();
    console.log(' Kafka connected');
  } catch (err) {
    console.error(' Kafka connection failed', err);
  }
};

export const publishEvent = async (event: string, data: any) => {
  await producer.send({
    topic: 'tickets', 
    messages: [
      {
        key: event,
        value: JSON.stringify({ event, data })
      }
    ]
  });
};
