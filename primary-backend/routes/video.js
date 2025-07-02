import express from 'express';
import { createCode, getProject } from '../services/jobService.js';
import { isAuthenticated } from './auth.js';
// import prisma from "../prisma"; // your Prisma client instance
import { PrismaClient } from '@prisma/client'; // ✅ Preferred and cleaner
import { updateProject } from '../services/llmService.js';
const prisma = new PrismaClient();
const router = express.Router();

router.get('/video', (req,res) => [
    res.json({message: "Hello from the video route!"})
])


// router.post('/generate' ,isAuthenticated, generateVideo);

router.post('/create' , isAuthenticated , createCode);

router.get('/:id' , isAuthenticated , getProject);

router.post('/chat/:id' , isAuthenticated , updateProject)





// routes/render.js or similar
router.post('/update-url', async (req, res) => {
  const { iterationId, videoUrl } = req.body;

  if (!iterationId || !videoUrl) {
    return res.status(400).json({ error: 'iterationId and videoUrl are required' });
  }

  try {
    const updatedIteration = await prisma.iteration.update({
      where: { id: iterationId },
      data: {
        videoUrl,
        status: 'COMPLETE'
      }
    });

    // Emit event via WebSocket
    const io = req.app.get('io');
    io.emit('videoReady', {
      iterationId,
      videoUrl,
    });

    console.log(`📡 Emitted videoReady for iteration ${iterationId}`);
    
    res.json({
      success: true,
      iterationId,
      videoUrl,
      status: updatedIteration.status
    });
    console.log('videoUrl updated successfully:', videoUrl);
  } catch (error) {
    console.error('🔥 Error updating iteration with video:', error);
    res.status(500).json({ error: 'Failed to update iteration with video URL' });
  }
});






export default router;