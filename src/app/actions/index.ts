"use server";
import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const HF_TOKEN = process.env.HF_TOKEN;
console.log("HF_TOKEN:", HF_TOKEN);
const inference = new HfInference(HF_TOKEN);
type AskQuestionData = {
  question: string;
};

type AskQuestionResponse = {
  status: number;
  message: string;
};

export const askQuestion = async (
  data: AskQuestionData
): Promise<AskQuestionResponse> => {
  const { question } = data;

  if (!question) {
    return { status: 400, message: "No question provided" };
  }

  try {
    // Set up the prompt with specific instructions and required format
    const prompt = `
            <s> [INST] Is the following food or beverage vegan? Please answer with only "yes" or "no". 
            If the food or beverage contains any animal products or derivatives (like milk, butter, cream, cheese, egg, or honey), answer "no". 
            If the question is not food-related or beverage-related, answer "not food". 
            If the food or beverage is explicitly labeled as vegan or plant-based, answer "yes". 
            If there's a possibility that the food or beverage is vegan but you are unsure, say "maybe" or ask for more detail.
            If it's not food or beverage related, answer "not food".
            All answers must be in a yes/no format.

            Food: ${question}
            Answer: [/INST] </s>
        `;

    const getTheAnswer = await inference.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: prompt.trim(),
      parameters: {
        max_new_tokens: 50, // Adjust token limit as needed for short answers
      },
    });

    // Log the raw response for debugging
    console.log("Raw response:", getTheAnswer.generated_text);

    let rawAnswer = getTheAnswer.generated_text.trim().toLowerCase();
    console.log("Raw answer:", rawAnswer);

    // Remove the special tokens from the response
    rawAnswer = rawAnswer
      .replace(/<\/?s>/g, "")
      .replace(/\[inst\]/g, "")
      .replace(/\[\/inst\]/g, "")
      .trim();
    console.log("Cleaned answer:", rawAnswer);

    // Extract the actual answer part
    const answerSegment = rawAnswer.split("answer:")[1]?.trim() || "";
    console.log("Answer segment:", answerSegment);

    const validAnswers = ["yes", "no", "maybe", "not food"];

    // Check each valid answer against the answer segment
    let foundAnswer = validAnswers.find((answer) => {
      const regex = new RegExp(`\\b${answer}\\b`, "i");
      return regex.test(answerSegment);
    });
    console.log("Found answer:", foundAnswer);

    // If the found answer is "not food", return it immediately
    if (foundAnswer === "not food") {
      return { status: 200, message: foundAnswer };
    }

    // Check for presence of non-vegan indicators and force "no" if found, but allow exceptions
    const nonVeganIndicators = [
      "milk",
      "butter",
      "cream",
      "cheese",
      "egg",
      "honey",
    ];
    const veganExceptions = [
      "coconut milk",
      "almond milk",
      "soy milk",
      "vegan",
      "plant-based",
    ];

    const containsNonVeganIndicator = nonVeganIndicators.some(
      (indicator) =>
        answerSegment.includes(indicator) &&
        !veganExceptions.some((exception) => answerSegment.includes(exception))
    );

    // If non-vegan indicators are found, override the answer to "no"
    if (containsNonVeganIndicator) {
      foundAnswer = "no";
    }

    if (!foundAnswer) {
      return { status: 200, message: "Invalid response, please try again." };
    }

    return { status: 200, message: foundAnswer };
  } catch (error) {
    console.error("Error generating response:", error);
    return { status: 500, message: "Error generating response" };
  }
};
