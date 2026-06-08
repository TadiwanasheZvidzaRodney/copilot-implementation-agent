import { HfInference } from '@huggingface/inference'
import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const { projectDescription } = await readBody(event)
  const config = useRuntimeConfig()

  if (!projectDescription) {
    throw createError({ statusCode: 400, message: 'Project description is required.' })
  }

  // Validate HF token
  if (!config.hfToken) {
    throw createError({ statusCode: 500, message: 'Hugging Face API token is not configured.' })
  }

  // Load the system prompt from the MD file
  const filePath = path.resolve(process.cwd(), 'server/utils/copilot-implementation-agent.md')
  const systemPrompt = fs.readFileSync(filePath, 'utf-8')

  // Initialize the Hugging Face Inference client
  const hf = new HfInference(config.hfToken)

  try {
    // Use chatCompletion with Meta Llama 3 8B Instruct
    const response = await hf.chatCompletion({
      model: 'meta-llama/Meta-Llama-3-8B-Instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: projectDescription }
      ],
      temperature: 0.2, // Low temperature for deterministic, structured output
      max_tokens: 4096, // Allow for detailed implementation plans
    })

    const responseText = response.choices[0]?.message?.content || ''
    
    if (!responseText) {
      throw new Error('Empty response from AI model')
    }

    return { success: true, markdown: responseText }
  } catch (error: any) {
    console.error('Hugging Face API Error:', error)
    
    // Handle specific error types
    if (error.message?.includes('rate limit') || error.status === 429) {
      throw createError({ 
        statusCode: 429, 
        message: 'Rate limit exceeded. Please wait a moment and try again.' 
      })
    }
    
    if (error.message?.includes('token') || error.status === 401) {
      throw createError({ 
        statusCode: 401, 
        message: 'Invalid Hugging Face API token.' 
      })
    }

    throw createError({ 
      statusCode: 500, 
      message: error.message || 'Failed to generate implementation plan.' 
    })
  }
})
