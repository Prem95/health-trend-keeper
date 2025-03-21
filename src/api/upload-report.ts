import { OpenAI } from 'openai';
import pdfParse from 'pdf-parse';
import { supabase } from '@/lib/db';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Since we're calling this from the client
});

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { fileUrl, fileType, userId, filePath } = body;

    if (!fileUrl || !fileType || !userId || !filePath) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract text from the file
    let extractedText = '';

    // For PDF files, use pdf-parse
    if (fileType === 'application/pdf') {
      try {
        // Fetch PDF file
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }
        
        const pdfBuffer = await response.arrayBuffer();
        const data = await pdfParse(Buffer.from(pdfBuffer));
        extractedText = data.text;
      } catch (error: any) {
        console.error('PDF parsing error:', error);
        return new Response(
          JSON.stringify({ message: `Failed to parse PDF: ${error.message}` }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    // For image files, use OpenAI's vision capabilities
    else if (['image/jpeg', 'image/jpg', 'image/png'].includes(fileType)) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a medical document scanner. Extract all visible text from the image of the medical report.',
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extract all the text from this medical report image:' },
                { type: 'image_url', image_url: { url: fileUrl } },
              ],
            },
          ],
          max_tokens: 2000,
        });
        
        extractedText = response.choices[0]?.message?.content || '';
      } catch (error: any) {
        console.error('OpenAI image processing error:', error);
        return new Response(
          JSON.stringify({ message: `Failed to process image: ${error.message}` }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ message: 'Unsupported file type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If no text was extracted, return an error
    if (!extractedText || extractedText.trim() === '') {
      return new Response(
        JSON.stringify({ message: 'No text could be extracted from the document' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use OpenAI to extract medical metrics and generate a summary
    const analysisResult = await extractMedicalMetrics(extractedText);

    // Return the extracted metrics and summary
    return new Response(JSON.stringify(analysisResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error processing report:', error);
    return new Response(
      JSON.stringify({ message: `Error processing report: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Function to extract medical metrics using OpenAI
async function extractMedicalMetrics(text: string) {
  try {
    // Define the prompt for extracting metrics
    const systemPrompt = `
      You are a medical data extraction assistant. Analyze the provided medical report text
      and extract the following key health metrics if present:
      
      1. Blood pressure (systolic/diastolic) - Units: mmHg
      2. Cholesterol:
         - Total cholesterol - Units: mg/dL
         - HDL (good) cholesterol - Units: mg/dL
         - LDL (bad) cholesterol - Units: mg/dL
      3. Glucose levels - Units: mg/dL
      
      For each metric, include:
      - The specific value
      - The confidence level (0.0-1.0) based on how clearly it was stated
      - The standard unit of measurement
      
      Also generate a concise summary (max 5 sentences) of the report's main findings.
      
      Format your response as a JSON object with the following structure:
      {
        "metrics": [
          {
            "type": "blood_pressure_systolic",
            "value": number,
            "unit": "mmHg",
            "confidence": number
          },
          {
            "type": "blood_pressure_diastolic",
            "value": number,
            "unit": "mmHg",
            "confidence": number
          },
          ...and so on for other metrics
        ],
        "summary": "Concise summary of the report."
      }
      
      Only include metrics that are actually present in the text. If a metric is mentioned multiple times,
      use the most recent value. For any unclear or ambiguous values, assign a lower confidence score.
    `;

    // Query OpenAI for extraction
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0,
    });

    // Parse the response
    const content = response.choices[0]?.message?.content || '';
    const parsedContent = JSON.parse(content);
    
    return parsedContent;
  } catch (error: any) {
    console.error('OpenAI extraction error:', error);
    throw new Error(`Failed to extract metrics: ${error.message}`);
  }
} 