const express = require('express');
const router = express.Router();
const axios = require('axios');

// Judge0 API credentials
const RAPIDAPI_KEY = "8c4071769emsh412426bef5adb27p1bba4bjsnd2bc8dd2b38d";
const RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";
const RAPIDAPI_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

router.post('/', async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) return res.status(400).json({ error: 'Code and language required' });

  // Judge0 language IDs (example)
  const languageMap = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54,
  };

  const language_id = languageMap[language];
  if (!language_id) return res.status(400).json({ error: 'Unsupported language' });

  try {
    const response = await axios.post(
      RAPIDAPI_URL,
      { source_code: code, stdin: input || "", language_id },
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({ output: response.data.stdout || response.data.stderr || "No output" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
