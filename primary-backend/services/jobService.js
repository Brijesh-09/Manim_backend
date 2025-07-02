import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import { generateCode } from './llmService.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();


export const createCode = async (req , res) => {
    const { prompt } = req.body;
  
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: 'Invalid prompt' });
    }
  
    const trimmedPrompt = prompt.trim();
  
    try {
      // Create project
      const project = await prisma.project.create({
        data: {
          name: trimmedPrompt,
          description: trimmedPrompt,
          user: { connect: { id: req.user.id } }
        }
      });
  
      // Create initial iteration
      const iteration = await prisma.iteration.create({
        data: {
          prompt: trimmedPrompt,
          projectId: project.id,
          status: 'PENDING'
        }
      });
  
      // ✅ Correct usage of generateCode with an object
      const llmCall = await generateCode({
        prompt: trimmedPrompt,
        userId: req.user.id,
        iterationId: iteration.id
      });
  
      res.json({
        success: true,
        projectId: project.id,
        iterationId: iteration.id,
        prompt: trimmedPrompt,
        aiResponse: llmCall.code,
        text: llmCall.text,
        userId: req.user.id
      });
  
    } catch (err) {
      console.error("Error in createCode:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  





// export const getJobStatus = async (req, res) => {
//   const { id } = req.params;
//   const status = await redisClient.hGet(id, 'status');

//   if (!status) return res.status(404).json({ error: 'Job not found' });

//   const response = { status };
//   if (status === 'done') {
//     response.url = `/outputs/${id}.mp4`; // you can serve this statically later
//   }

//   res.json(response);
// };

export const getProject = async(req,res) => {
    const { id: projectId } = req.params;

    try{
        const project = await prisma.project.findUnique({
            where: {id: projectId},
            include: {
                iterations:true
            }
        });

        if(!project){
            res.status(404).json({message: "Project Not found"})
        }
        res.json({ success: true, project });
    }
    catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
      }
    
}