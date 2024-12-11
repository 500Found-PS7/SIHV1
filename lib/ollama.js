// Initialize Ollama client with Docker configuration
const OLLAMA_BASE_URL = process.env.NEXT_PUBLIC_OLLAMA_HOST || 'http://localhost:11434';
const MODEL_NAME = 'llama3.2:latest';

// Request queue and rate limiting
let requestQueue = [];
let isProcessing = false;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

// Cache for responses
const responseCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processQueue() {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  const { resolve, reject, data, type } = requestQueue[0];

  try {
    const result = await makeRequest(data, type);
    resolve(result);
  } catch (error) {
    reject(error);
  }

  requestQueue.shift();
  isProcessing = false;
  
  // Process next request after interval
  if (requestQueue.length > 0) {
    await wait(MIN_REQUEST_INTERVAL);
    processQueue();
  }
}

async function makeRequest(data, type) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      // Simplify the data structure to reduce complexity
      const relevantData = {
        type: type,
        summary: type === "currentLoad" 
          ? { load: data.hourlyLoad?.slice(-3) }  // Only last 3 hours
          : type === "pricing" 
          ? { price: data.prices?.slice(-3) }     // Only last 3 hours
          : { data: JSON.stringify(data).slice(0, 500) }  // Limit data size
      };

      // Very simple prompt
      const prompt = `Give 3 short insights about this ${type} data: ${JSON.stringify(relevantData)}`;

      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.5,        // Reduced temperature
            top_k: 40,              // Reduced from 50
            top_p: 0.9,             // Reduced from 0.95
            num_predict: 200,        // Reduced from 500
            stop: ["\n\n", "4."],   // Stop after 3 points
            repeat_penalty: 1.1,     // Add repeat penalty
            length_penalty: 1.1,     // Add length penalty
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error('Ollama Error Response:', errorText);

        if (response.status === 500) {
          // Try to recover by using a simpler prompt
          const recoveryResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: MODEL_NAME,
              prompt: "Analyze this data briefly: " + type,
              stream: false,
              options: {
                temperature: 0.1,
                num_predict: 100,
              }
            }),
          });

          if (recoveryResponse.ok) {
            const result = await recoveryResponse.json();
            return result.response || 'Analysis not available at the moment.';
          }

          throw new Error(
            `Model may be overloaded. Try:\n` +
            `1. Restart container: docker restart ollama\n` +
            `2. Check memory: docker stats ollama\n` +
            `3. Use smaller model: docker exec -it ollama ollama pull llama2:7b`
          );
        }

        throw new Error(
          `Request failed (${response.status}): ${errorText}\n` +
          `Try restarting the container: docker restart ollama`
        );
      }

      const result = await response.json();
      return result.response || 'No insights available.';

    } catch (error) {
      console.error(`Ollama API Error (Attempt ${retries + 1}/${MAX_RETRIES}):`, error);
      retries++;
      
      if (retries < MAX_RETRIES) {
        // Exponential backoff
        await wait(RETRY_DELAY * Math.pow(2, retries - 1));
        continue;
      }
      return 'Unable to generate insights at the moment. Please try again later.';
    }
  }

  return 'Service temporarily unavailable. Please check system resources.';
}

export async function generateInsights(data, type = "general") {
  // Check cache first
  const cacheKey = JSON.stringify({ data, type });
  const cachedResponse = responseCache.get(cacheKey);
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
    return cachedResponse.text;
  }

  // Add request to queue
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, data, type });
    
    // Start processing queue if not already processing
    if (!isProcessing) {
      processQueue();
    }
  }).then(result => {
    // Cache successful response
    responseCache.set(cacheKey, {
      text: result,
      timestamp: Date.now()
    });
    return result;
  });
} 