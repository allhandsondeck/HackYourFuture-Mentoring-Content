/*
  Pair Exercise: Environment-Aware Configuration

  How this works:
  • Person A builds isProduction() and getApiUrl(), Person B reviews and tests them
  • Person B builds getConfig(), Person A reviews and tests it
  • Swap and discuss: where in your portfolio would you actually call getConfig()?

  Context:
  Your portfolio is live on Vercel. In production it uses a real API endpoint,
  but during local development you want it to point to localhost instead.
  You also want to show a "⚠️ Development Mode" banner only when running locally.

  Next.js makes two environment variables available everywhere:
  • process.env.NODE_ENV          → "development" | "production" | "test"
  • process.env.NEXT_PUBLIC_API_URL → the API base URL you set in Vercel's dashboard

  Functions to build:

  1. isProduction()
     - Returns true if NODE_ENV is exactly "production", false otherwise

  2. getApiUrl()
     - Returns process.env.NEXT_PUBLIC_API_URL if it is set and non-empty
     - Falls back to "http://localhost:3000/api" when in development
     - Falls back to "" (empty string) in production if the variable is missing
     - Never throws — always returns a string

  3. getConfig()
     - Returns an object with the shape:
       { isProduction: boolean, apiUrl: string, showDevBanner: boolean }
     - showDevBanner should be true only when NOT in production
     - Must call isProduction() and getApiUrl() — do not duplicate their logic

  Requirements:
  • Arrow functions only
  • Pure functions — read from process.env but do not modify it
  • One function = one job
  • No throwing — defensive returns only
*/

// Start your functions here
