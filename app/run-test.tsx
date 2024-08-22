'use client'

import { useState } from 'react'

export function RunTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('openai')

  const handleProcessCsv = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/process-csv?model=${selectedModel}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error fetching API:', error)
      setResult({ error: 'Failed to process CSV' })
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
          {/* <option value="another-provider">Another AI Provider</option> */}
        </select>
      </div>

      <button
        onClick={handleProcessCsv}
        className="rounded bg-blue-500 px-4 py-2 text-white"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Process CSV'}
      </button>

      {result && (
        <div className="mt-4">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <div>
              <p>True Positive: {result.truePositive}</p>
              <p>False Positive: {result.falsePositive}</p>
              <p>True Negative: {result.trueNegative}</p>
              <p>False Negative: {result.falseNegative}</p>
              <p>Total Emergencies: {result.emergencyCount}</p>
              <p>Total Non-Emergencies: {result.nonEmergencyCount}</p>
              <p>False Positive Text: {result.falsePositiveText.join(', ')}</p>
              <p>False Negative Text: {result.falseNegativeText.join(', ')}</p>
              <p>Accuracy: {result.accuracy}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
