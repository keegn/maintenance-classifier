'use client'

// This File is for reference only. It is not used in the app.
import { useState } from 'react'

export function RunStreamTest() {
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('openai')

  const [truePositive, setTruePositive] = useState(0)
  const [falsePositive, setFalsePositive] = useState(0)
  const [trueNegative, setTrueNegative] = useState(0)
  const [falseNegative, setFalseNegative] = useState(0)
  const [emergencyCount, setEmergencyCount] = useState(0)
  const [nonEmergencyCount, setNonEmergencyCount] = useState(0)

  const [falsePositiveText, setFalsePositiveText] = useState<string[]>([])
  const [falseNegativeText, setFalseNegativeText] = useState<string[]>([])

  const handleProcessCsv = async () => {
    setLoading(true)
    setTruePositive(0)
    setFalsePositive(0)
    setTrueNegative(0)
    setFalseNegative(0)
    setEmergencyCount(0)
    setNonEmergencyCount(0)
    setFalsePositiveText([])
    setFalseNegativeText([])

    try {
      const response = await fetch(
        `/api/process-csv-stream?model=${selectedModel}`
      )
      const reader = response.body?.getReader()
      const decoder = new TextDecoder('utf-8')

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const parsedChunk = JSON.parse(chunk)

          if (parsedChunk.type === 'update') {
            setEmergencyCount(
              (prev) => prev + (parsedChunk.emergencyCount || 0)
            )
            setNonEmergencyCount(
              (prev) => prev + (parsedChunk.nonEmergencyCount || 0)
            )

            setTruePositive((prev) => prev + (parsedChunk.truePositive || 0))
            setFalsePositive((prev) => prev + (parsedChunk.falsePositive || 0))
            setTrueNegative((prev) => prev + (parsedChunk.trueNegative || 0))
            setFalseNegative((prev) => prev + (parsedChunk.falseNegative || 0))

            if (parsedChunk.falsePositiveText) {
              setFalsePositiveText((prev) => [
                ...prev,
                parsedChunk.falsePositiveText,
              ])
            }
            if (parsedChunk.falseNegativeText) {
              setFalseNegativeText((prev) => [
                ...prev,
                parsedChunk.falseNegativeText,
              ])
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching API:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label className="mb-2 block">Select Model:</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="rounded border px-2 py-1"
        >
          <option value="gpt-4o-mini">OpenAI gpt-4o-mini</option>
          {/* Add more options for different models/providers */}
        </select>
      </div>

      <button
        onClick={handleProcessCsv}
        className="rounded bg-blue-500 px-4 py-2 text-white"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Process CSV'}
      </button>

      <div className="mt-4">
        <p>True Positive: {truePositive}</p>
        <p>False Positive: {falsePositive}</p>
        <p>True Negative: {trueNegative}</p>
        <p>False Negative: {falseNegative}</p>
        <p>Total Emergencies: {emergencyCount}</p>
        <p>Total Non-Emergencies: {nonEmergencyCount}</p>

        {falsePositiveText.length > 0 && (
          <div>
            <h4>False Positive Text:</h4>
            {falsePositiveText.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        )}

        {falseNegativeText.length > 0 && (
          <div>
            <h4>False Negative Text:</h4>
            {falseNegativeText.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
