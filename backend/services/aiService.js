const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
 apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "models/gemini-2.5-flash-lite";

async function parseTask(text){

 const response = await genAI.models.generateContent({
  model: MODEL,
  contents: `Extract task info from sentence.

Return JSON:

{
"title":"", 
"deadline":"", 
"priority":"low|medium|high"
}

Sentence: ${text}
`,
 config:{
  temperature:0.1
 }
 });

 return response.text;
}

module.exports = { parseTask };