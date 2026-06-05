import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const { projectDescription } = await readBody(event)
  const config = useRuntimeConfig()

  if (!projectDescription) {
    throw createError({ statusCode: 400, message: 'Project description is required.' })
  }

  // Load the system prompt from the MD file
  const filePath = path.resolve(process.cwd(), 'server/utils/copilot-implementation-agent.md')
  const systemPrompt = fs.readFileSync(filePath, 'utf-8')

  // Initialize the free-tier Gemini model
  const ai = new GoogleGenerativeAI(config.geminiApiKey)
  const model = ai.getGenerativeModel({ 
    model: 'gemini-2.0-flash', // Updated model name
    systemInstruction: systemPrompt 
  })

  try {
    const result = await model.generateContent(projectDescription)
    const responseText = result.response.text()
    
    return { success: true, markdown: responseText }
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    throw createError({ 
      statusCode: 500, 
      message: error.message || 'Failed to generate implementation plan.' 
    })
  }
})
