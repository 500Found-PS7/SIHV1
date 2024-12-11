const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Request queue and rate limiting
let requestQueue = [];
let isProcessing = false;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

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
      // Prepare data for analysis
      const relevantData = {
        type: type,
        summary: type === "currentLoad" 
          ? { load: data.hourlyLoad?.slice(-3) }
          : type === "pricing" 
          ? { price: data.prices?.slice(-3) }
          : { data: JSON.stringify(data).slice(0, 1000) }
      };

      // Create prompt based on data type
      const prompts = {
        general: `Examine this electricity data and identify 3 important points in bullet form and explain them in a way that is easy to understand: ${JSON.stringify(relevantData)}`,
        currentLoad: `Study this energy usage data and highlight 3 key findings in bullet points and explain them in a way that is easy to understand: ${JSON.stringify(relevantData)}`,
        pricing: `Review this electricity pricing data and summarize 3 significant insights in bullet points and explain them in a way that is easy to understand: ${JSON.stringify(relevantData)}`
      };

      const prompt = prompts[type] || prompts.general;

      // Generate content using Gemini
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      return text;

    } catch (error) {
      console.error(`Gemini API Error (Attempt ${retries + 1}/${MAX_RETRIES}):`, error);
      retries++;
      
      if (retries < MAX_RETRIES) {
        await wait(RETRY_DELAY * Math.pow(2, retries - 1));
        continue;
      }

      // Return a user-friendly message instead of throwing error
      return 'Unable to generate insights at the moment. Please try again later.';
    }
  }

  return 'Service temporarily unavailable. Please try again later.';
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