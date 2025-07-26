# V2.chat
Quick Start
3 min
Level: Beginner
This guide will help you quickly set up and run the V2 cryptocurrency prediction and analysis platform. You'll have the application running and be able to make your first prediction within 3 minutes.

Before you begin, make sure you have the following installed:

Node.js (v18 or later)
pnpm (recommended) or npm
Git
Installation
Clone the repository and navigate to the project directory:
git clone https://github.com/dxmaptin/V2.git
cd V2
Install dependencies:
pnpm install
# or
npm install
Sources: package.json

Configuration
The application uses several API keys for cryptocurrency data and AI functionality. For a basic setup:

Create a .env.local file in the root directory:
# Cryptocurrency data API key (optional - default key included)
CRYPTOCOMPARE_API_KEY=your_cryptocompare_api_key

# AI API key for predictions
DEEPSEEK_API_KEY=your_deepseek_api_key
The application includes fallback API keys for demo purposes, but for production use, you should register for your own keys.

Sources: route.ts#L6-L7, route.ts#L15-L16

Running the Application
Start the development server:

pnpm dev
# or
npm run dev
Open http://localhost:3000 in your browser. You'll see:

A loading screen
A login screen (no real authentication required for development)
The main cryptocurrency analysis interface
Sources: page.tsx#L8-L32

Making Your First Prediction
Once the application is running:

You'll be presented with the main cryptocurrency interface
Enter a cryptocurrency symbol (e.g., BTC, ETH, SOL) in the search field
Click the "Predict" button
The application will display price predictions for different timeframes (1h, 24h, 7d)
Core Features
Cryptocurrency Price Prediction
The platform provides price predictions for various cryptocurrencies using AI-powered analysis:

Enter any valid cryptocurrency symbol
View price predictions with confidence levels
See trend directions (up, down, or stable)
Access detailed analysis reports
Sources: crypto-product-site.tsx#L114-L129

Leverage Recommendation
Get personalized leverage strategy recommendations:

Based on risk tolerance
Considers current market conditions
Provides position management advice
Sources: leverage-recommendation.tsx

AI Chat Assistant
The application includes an AI-powered chat assistant:

Ask questions about market trends
Get explanations of technical analysis
Choose between normal mode and deep search mode
Sources: crypto-product-site.tsx#L385-L397

Language Support
The application supports multiple languages:

Chinese (Simplified)
Chinese (Traditional)
English
Japanese
Spanish
Change the language using the language selector in the interface.
