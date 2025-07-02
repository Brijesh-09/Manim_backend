import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL 
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

export const enqueueRenderJob = async ({ s3Key, fileUrl, metadata }) => {
  const jobId = s3Key.split('/').pop().replace('.py', '');

  const jobData = {
    jobId,
    status: 'queued',
    createdAt: new Date().toISOString(),
    s3Key,
    fileUrl,
    metadata: JSON.stringify(metadata),
  };

  await redisClient.hSet(`job:${jobId}`, jobData);
  await redisClient.rPush('renderQueue', JSON.stringify(jobData));
};
