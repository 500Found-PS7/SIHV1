"use client"
import React, { useEffect } from 'react'

const Page = () => {
    const inputData = { key: 'value' } // Define your input data here

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Hello")
                const response = await fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ input: inputData }),
                })
                console.log("Response: ", response)

                if (!response.ok) {
                    throw new Error('Failed to get prediction')
                }

                const data = await response.json()
                console.log("Data: ", data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchData() // Call the async function
    }, []) // Dependency array ensures this runs only once

    return (
        <div>page</div>
    )
}

export default Page
