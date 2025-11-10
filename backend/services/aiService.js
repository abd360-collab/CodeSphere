const axios = require('axios');
const OPENROUTER_API_KEY = process.env.OPENROUTER_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "mistralai/mistral-7b-instruct"; // pick any free model!

// Generate code
const generateCode = async (prompt, language = "javascript") => {
  const fullPrompt = `Write a function in ${language}: ${prompt}`;
  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: DEFAULT_MODEL,
      messages: [{role: "user", content: fullPrompt}]
    },
    {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );
  return response.data.choices[0].message.content;
};

const reviewCode = async (code, language = "javascript") => {
  const fullPrompt = `Review this ${language} code and suggest improvements or fixes:\n${code}`;
  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: DEFAULT_MODEL,
      messages: [{role: "user", content: fullPrompt}]
    },
    {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );
  return response.data.choices[0].message.content;
};

const explainCode = async (code, language = "javascript") => {
  const fullPrompt = `Explain this ${language} code in simple words:\n${code}`;
  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: DEFAULT_MODEL,
      messages: [{role: "user", content: fullPrompt}]
    },
    {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );
  return response.data.choices[0].message.content;
};

module.exports = { generateCode, reviewCode, explainCode };
