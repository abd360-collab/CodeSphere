

// controllers/aiController.js
const aiService = require('../services/aiService');

exports.generate = async (req, res) => {
  try {
    const { prompt, language } = req.body;
    const code = await aiService.generateCode(prompt, language);
    res.json({ ok: true, code });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.review = async (req, res) => {
  try {
    const { code, language } = req.body;
    const review = await aiService.reviewCode(code, language);
    res.json({ ok: true, review });
  } catch (err) {
     console.error("AI Review Error:", err); // <-- Add this line
     console.log("Loaded Gemini API key:", process.env.GEMINI_KEY);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.explain = async (req, res) => {
  try {
    const { code, language } = req.body;
    const explanation = await aiService.explainCode(code, language);
    res.json({ ok: true, explanation });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
