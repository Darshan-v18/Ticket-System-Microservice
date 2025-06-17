import { startConsumer } from './kafkaConsumer';

(async () => {
  try {
    await startConsumer();
    console.log('Notification service is running...');
  } catch (err) {
    console.error('Failed to start notification service', err);
  }
})();
