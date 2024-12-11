'use client'
import { useState } from 'react'

export default function DummyModel() {
    const [inputData, setInputData] = useState('')
    const [prediction, setPrediction] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: inputData }),
            })

            if (!response.ok) {
                throw new Error('Failed to get prediction')
            }

            const data = await response.json()
            setPrediction(data.prediction)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-center mb-8">Model Prediction</h1>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="input" className="block text-sm font-medium mb-2">
                            Enter Input Data
                        </label>
                        <textarea
                            id="input"
                            value={inputData}
                            onChange={(e) => setInputData(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows="4"
                            placeholder="Enter your input data here..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Processing...' : 'Get Prediction'}
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-md">
                        Error: {error}
                    </div>
                )}

                {/* Results Section */}
                {prediction && (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-100 rounded-md">
                            <h2 className="text-xl font-semibold mb-2">Prediction Results:</h2>
                            <pre className="whitespace-pre-wrap">
                                {JSON.stringify(prediction, null, 2)}
                            </pre>
                        </div>
                        
                        <button
                            onClick={handlePrint}
                            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                        >
                            Print Results
                        </button>
                    </div>
                )}
            </div>

            {/* Print-only styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .max-w-2xl, .max-w-2xl * {
                        visibility: visible;
                    }
                    .max-w-2xl {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    button {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    )
}
