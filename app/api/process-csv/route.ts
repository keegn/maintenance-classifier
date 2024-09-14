import fs from 'fs'
import { NextResponse } from 'next/server'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { mistral } from '@ai-sdk/mistral'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import csv from 'csv-parser'

// Import other model providers similarly if needed

let emergencyCount = 0
let nonEmergencyCount = 0
let truePositive = 0
let falsePositive = 0
let trueNegative = 0
let falseNegative = 0
let falsePositiveText: string[] = []
let falseNegativeText: string[] = []

async function isEmergency(
  text: string,
  model: string,
  temperature: number = 0.5,
  prompt?: string
): Promise<boolean> {
  console.log('Temperature at function start:', temperature)
  try {
    const systemPrompt = `You are Jonesy from Stonehaven Property Management after hours phone line. You are an expert customer service rep in the field of multifamily apartment maintenance. You are pleasant and friendly, understanding that the resident calling might be in distress due to a maintenance emergency related to their rented apartment. Begin the call with "Hello, this is Jerry from Stonehaven Property Management Maintenance Division. How can I assist you?"
  Style Guardrails:
  - Be Concise: Respond succinctly, addressing one topic at a time.
  - Don't get sidetracked. Keep the conversation focused on the maintenance issue and don't deviate if the tenant mentions other things.
  - Be Quick and Efficient: Prioritize resolving the issue promptly, transferring the call or ending the call.
  - Be Proactive: Lead the conversation, often concluding with a question or next-step suggestion. Only offer solutions if you're certain they'll resolve the issue.
  - Ask One Question at a Time: Avoid multiple questions in a single response.
  - Seek Clarity: If the user's answer is partial or unclear, continue asking for more information.
  - Use Colloquial Date References: For example, "Friday, Jan 14th" or "Tuesday, Jan 12th, 2024 at 8am".
  Response Guideline:
  - Quickly gather the tenant's name. Your goal is to determine if the situation is an emergency or non-emergency as quickly as possible to dispatch the appropriate help or end the call.
  - Determine if the situation qualifies as a maintenance emergency:
  - Very fast running water leak, flood, or Heat/AC failure when outside temperature is below 40°F or above 90°F.
  - Remember that emergencies mean that tenants are not charged and do not mention a charge or cost. Never state anything like "x qualifies as an emergency" if it is an emergency.
  - If the tenant is unsure or expresses frustration or concern, please advise them to hang up and call 573-355-6175 to speak with the on-call maintenance technician, but tell them to please keep in mind if the technician deems it a non-emergency, they will be charged $50.
  Other emergencies include:
   - Gas leaks or broken gas lines
   - Plumbing issues causing flooding
   - Broken locks, doors, or windows that compromise security, or front doors that wont close
   - Dangerous ice on walkways or over entrances
   - Safety hazards in common areas
  - For life-threatening situations (fire, major flooding), advise calling 911.
  - If deemed non-emergency:
  - Inform the tenant they can be forwarded to the on-call maintenance technician.
  - Clearly state that a $50 charge will be applied to their account for non-emergency calls if they would still like to speak with a technician. Give the resident the option to be transferred to a tech and warn that they could incur this charge if the tech deems it a non emergency.
  Non-emergency issues include:
  - Non-working appliances (e.g., stove, fridge)
  - Cosmetic issues like cracked drywall
  - No hot water
  - Hot water isn't working
  - Running toilet not causing flooding
  - External flooding from rain
  - Clogged garbage disposal
  - Clogged toilet or sink (advise to buy a plunger and plunge before making a maintenance request)
  - Broken lights/light fixtures
  - Malfunctioning laundry equipment
  - Minor mold or mildew
  - Minor pest issues like ants or small insects
  Based on this context, you will analyze the maintenance request provided and determine if it's an emergency.
  You must respond with ONLY 'true' for emergency or 'false' for non-emergency, without any additional explanation.`

    const prompt = `Is this an emergency maintenance request: "${text}"? Respond with only "true" or "false".`

    // Select the appropriate model
    let selectedModel
    switch (model) {
      case 'openai':
        selectedModel = openai('gpt-4o-mini')
        break
      case 'anthropic':
        selectedModel = anthropic('claude-3-5-sonnet-20240620')
        break
      case 'google':
        selectedModel = google('models/gemini-1.5-pro-latest')
        break
      case 'mistral':
        selectedModel = mistral('mistral-large-latest')
        break
      default:
        selectedModel = openai('gpt-4o-mini') // Default to OpenAI if no valid model is provided
    }

    console.log('Temperature used in API call:', temperature)
    const { text: responseText } = await generateText({
      model: selectedModel,
      system: systemPrompt,
      prompt: prompt,
      temperature: temperature,
    })
    const result = responseText.trim().toLowerCase()
    return result === 'true'
  } catch (error) {
    console.error(
      'Error generating text with AI model:',
      (error as Error).message
    )
    return false
  }
}
async function processCsv(model: string, temperature: number) {
  const rows: any[] = []
  return new Promise<void>((resolve, reject) => {
    const filePath = 'app/api/process-csv/maintenance_requests.csv'
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row)
      })
      .on('end', async () => {
        try {
          for (const row of rows) {
            const emergencyRequest = row['Emergency Requests']?.trim() || ''
            const nonEmergencyRequest =
              row['Non-Emergency Requests']?.trim() || ''
            if (emergencyRequest) {
              emergencyCount++
              const apiResult = await isEmergency(
                emergencyRequest,
                model,
                temperature
              )
              if (apiResult) {
                truePositive++
              } else {
                falsePositive++
                falsePositiveText.push(emergencyRequest)
              }
            }
            if (nonEmergencyRequest) {
              nonEmergencyCount++
              const apiResult = await isEmergency(
                nonEmergencyRequest,
                model,
                temperature
              )
              if (apiResult) {
                falseNegative++
                falseNegativeText.push(nonEmergencyRequest)
              } else {
                trueNegative++
              }
            }
          }
          resolve()
        } catch (error) {
          console.error('Error in processing rows:', (error as Error).message)
          reject(error)
        }
      })
      .on('error', (error) => {
        console.error('Error processing CSV:', error.message)
        reject(error)
      })
  })
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const model = url.searchParams.get('model') || 'openai' // Default to OpenAI if no model is specified
  const temperature = parseFloat(url.searchParams.get('temperature') || '0.5')

  console.log('Received parameters:', { model, temperature })

  try {
    await processCsv(model, temperature)

    const totalPredictions =
      truePositive + trueNegative + falsePositive + falseNegative
    const accuracy =
      totalPredictions > 0
        ? (truePositive + trueNegative) / totalPredictions
        : 0

    return NextResponse.json({
      truePositive,
      falsePositive,
      trueNegative,
      falseNegative,
      emergencyCount,
      nonEmergencyCount,
      falsePositiveText,
      falseNegativeText,
      accuracy: (accuracy * 100).toFixed(2),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process CSV' },
      { status: 500 }
    )
  }
}
