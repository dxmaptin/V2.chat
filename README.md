# V2.chat Cryptocurrency Prediction Platform Guide  
**Quick Start Guide**  
This guide will help you quickly set up and run the V2 cryptocurrency prediction and analysis platform. You'll have the application running and be able to make your first prediction within 3 minutes.  

**Prerequisites**  
Before you begin, make sure you have the following installed:  
- Node.js (v18 or later)  
- pnpm (recommended) or npm  
- Git  

**Installation Steps**  
1. Clone the repository:  
`git clone https://github.com/dxmaptin/V2.git`  
`cd V2`  

2. Install dependencies:  
`pnpm install`  
or  
`npm install`  
*Source: package.json*  

**Configuration**  
Create a .env.local file in the root directory with:  
`# Cryptocurrency data API key (optional)`  
`CRYPTOCOMPARE_API_KEY=your_key_here`  
`# AI API key for predictions`  
`DEEPSEEK_API_KEY=your_key_here`  
*Note: Fallback keys exist for demo purposes.*  
*Sources: route.ts#L6-L7, route.ts#L15-L16*  

**Running the Application**  
Start the development server:  
`pnpm dev`  
or  
`npm run dev`  
Access at http://localhost:3000  

**Making Your First Prediction**  
1. Enter cryptocurrency symbol (BTC/ETH/SOL)  
2. Click "Predict"  
3. View predictions for 1h/24h/7d timeframes  

**Core Features**  
- **Price Prediction**: AI-powered crypto predictions with confidence levels  
- **Leverage Recommendations**: Personalized strategies based on risk tolerance  
- **AI Chat Assistant**: Market trend explanations in Normal/Deep Search modes  
- **Multi-language Support**: EN/中文/日本語/Español  

*All code snippets are inline without separate blocks as requested*
