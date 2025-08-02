import quotes from "../data/quotes.json"

export function generateQuote() : {quote: string, author: string}{
  return quotes.quotes[Math.floor(Math.random() * quotes.quotes.length)]
}