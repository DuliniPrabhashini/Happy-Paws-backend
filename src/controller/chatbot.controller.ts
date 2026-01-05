import { Request, Response } from "express"
import axios from "axios"

export const chatBot = async (req: Request, resp: Response) => {
  try {
    const { data } = req.body;

    const prompt = `
                    answer the following question if its only about related to animals or else answer not related to this question.

                    The answer should be professional and should complete one.
                    It should sound like a professional and complete related what user asked. use only 800 maximum words and complete the answer

                    Do NOT add explanations, headings, or commentary.
                    Return ONLY the answer.
                    Original question:
                    ${data}
                    `

    const maxToken = 1000

    const aiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: maxToken,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": "AIzaSyCsm-2oluWwWcBi6O2bu3cGBr_yPDpS3ck",
        },
      }
    );

    const genratedContent =
      aiResponse.data?.candidates?.[0]?.content?.[0]?.text ||
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No data";

    console.log(genratedContent);

    resp.status(200).json({
      message: "success",
      data: genratedContent,
    });
  } catch (error) {
    console.error(error);
    resp.status(500).json({
      message: "Internal server error",
    });
  }

}