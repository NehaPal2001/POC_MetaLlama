import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const endpoint = "https://models.inference.ai.azure.com";
const modelName = "Meta-Llama-3.1-405B-Instruct";

function createAIClient() {
  const token = process.env["GITHUB_TOKEN"];
  if (!token) {
    throw new Error("API token (GITHUB_TOKEN) is missing.");
  }
  return ModelClient(endpoint, new AzureKeyCredential(token));
}
app.post("/evaluate-answer", async (req, res) => {
  try {
    const {
      question,
      user_answer,
      criteria = ["accuracy", "completeness", "clarity", "relevance"],
    } = req.body;
    if (!question || !user_answer) {
      return res.status(400).json({
        error: "Both question and user answer are required",
      });
      }
    const client = createAIClient();

   const evaluationPrompt = `
    Evaluate the user's answer to the provided question based on the following expectations:
    
    **Requirements for a "Good" Answer:**
    - The answer must provide a **detailed explanation** of at least 300 words.
    - It should include **context**, **depth**, and **examples or applications** (when relevant) to demonstrate thorough understanding.
    - The response must directly and comprehensively address the question.

    **Evaluation Levels:**
    - **Good:** The answer meets all the above requirements, is detailed, and provides sufficient context and examples.
    - **Partially_Correct:** The answer contains some correct information but lacks the required detail, depth, or examples, making it incomplete.
    - **Incorrect:** The answer fails to meet the requirements, is too brief, lacks depth, or does not sufficiently address the question.

    Grammar and spelling are **not** part of the evaluation.

    **Question:** ${question}
    
    **User's Answer:** ${user_answer}

    Provide your evaluation as one of the following levels: "Good," "Partially_Correct," or "Incorrect." 

    Only output one word: "Good," "Partially_Correct," or "Incorrect."
`;


    const requestBody = {
      messages: [
        {
          role: "system",
          content:
            "You are an expert evaluator providing detailed, objective feedback.",
        },
        { role: "user", content: evaluationPrompt },
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1000,
      model: modelName,
    };

    const response = await client.path("/chat/completions").post({
      body: requestBody,
    });

    if (response.status != 200) {
      return res.status(response.status).json({
        error: "Evaluation API returned an error",
        details: response.body,
      });
    }
    const evaluationText = response.body.choices[0]?.message?.content;

    if (!evaluationText) {
      return res.status(500).json({
        error: "No evaluation message found",
      });
    }

    res.json({
      question,
      user_answer,
      evaluation: {
        feedback: evaluationText,
      },
    });
  } catch (error) {
    console.error("Answer Evaluation Error:", error);
      res.status(500).json({
        
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
