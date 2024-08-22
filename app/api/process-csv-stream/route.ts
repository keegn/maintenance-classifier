import fs from 'fs'
import { NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import csv from 'csv-parser'

async function isEmergency(text: string, model: string): Promise<boolean> {
  let isEmergencyResult = false

  try {
    const prompt = text
      ? `Is this an emergency maintenance request: "${text}"? Respond with only "true" or "false".`
      : `You are Jerry from Stonehaven Property Management after hours phone line...`

    const result = await streamText({
      model: model === 'openai' ? openai('gpt-4o-mini') : openai('gpt-4o-mini'),
      prompt: prompt,
      onChunk({ chunk }) {
        if (chunk.type === 'text-delta') {
          const apiResult = chunk.textDelta.trim().toLowerCase()
          if (apiResult === 'true') {
            isEmergencyResult = true
          }
        }
      },
    })

    for await (const textPart of result.textStream) {
      if (textPart.trim().toLowerCase() === 'true') {
        isEmergencyResult = true
      }
    }

    return isEmergencyResult
  } catch (error) {
    console.error('Unhandled error:', (error as Error).message)
    return false
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const model = url.searchParams.get('model') || 'openai' // Default to OpenAI if no model is specified

  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  let emergencyCount = 0
  let nonEmergencyCount = 0
  let truePositive = 0
  let falsePositive = 0
  let trueNegative = 0
  let falseNegative = 0
  const falsePositiveTexts: string[] = []
  const falseNegativeTexts: string[] = []

  const processRow = async (row: any) => {
    const emergencyRequest = row['Emergency Requests']?.trim() || ''
    const nonEmergencyRequest = row['Non-Emergency Requests']?.trim() || ''

    if (emergencyRequest && emergencyCount < 50) {
      emergencyCount++
      const apiResult = await isEmergency(emergencyRequest, model)
      if (apiResult) {
        truePositive++
      } else {
        falseNegative++
        falseNegativeTexts.push(emergencyRequest)
      }
    }

    if (nonEmergencyRequest && nonEmergencyCount < 50) {
      nonEmergencyCount++
      const apiResult = await isEmergency(nonEmergencyRequest, model)
      if (apiResult) {
        falsePositive++
        falsePositiveTexts.push(nonEmergencyRequest)
      } else {
        trueNegative++
      }
    }

    // Send update with all current counts and texts
    await writer.write(
      encoder.encode(
        JSON.stringify({
          type: 'update',
          emergencyCount,
          nonEmergencyCount,
          truePositive,
          falsePositive,
          trueNegative,
          falseNegative,
          falsePositiveText: falsePositiveTexts,
          falseNegativeText: falseNegativeTexts,
        }) + '\n'
      )
    )
  }

  try {
    const filePath = 'app/api/process-csv/maintenance_requests.csv'
    const stream = fs.createReadStream(filePath).pipe(csv())

    const rows: any[] = []

    stream.on('data', (row) => {
      rows.push(row)
    })

    stream.on('end', async () => {
      for (const row of rows) {
        await processRow(row)
      }
      await writer.close() // Close the stream after all rows are processed and written
    })

    stream.on('error', async (error) => {
      console.error('Unhandled error:', (error as Error).message)
      await writer.write(
        encoder.encode(
          JSON.stringify({ error: 'Failed to process CSV' }) + '\n'
        )
      )
      await writer.close() // Ensure the stream is closed in case of an error
    })
  } catch (error) {
    console.error('Unhandled error:', (error as Error).message)
    await writer.write(
      encoder.encode(
        JSON.stringify({ error: 'Unhandled error during processing' }) + '\n'
      )
    )
    await writer.close() // Ensure the stream is closed in case of an unhandled error
  }

  return new Response(readable, {
    headers: { 'Content-Type': 'application/json' },
  })
}
