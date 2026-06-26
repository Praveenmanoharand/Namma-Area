import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route first: AI Complaint Assistant
  app.post('/api/complaint-helper', async (req, res) => {
    const { notes, language } = req.body;

    if (!notes) {
      return res.status(400).json({ error: 'Rough notes are required.' });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY environment variable is missing. Running smart rule-based fallback.');
        
        // Professional fallbacks if API key is not configured yet
        const isTamil = language === 'ta';
        const lowercaseNotes = notes.toLowerCase();
        
        let title = isTamil ? 'வழியில் உள்ள பிரச்சனை' : 'Reported Local Issue';
        let description = notes;
        let category = 'Other';
        let severity = 'Minor';

        if (lowercaseNotes.includes('pothole') || lowercaseNotes.includes('road') || lowercaseNotes.includes('pallam') || lowercaseNotes.includes('salai')) {
          title = isTamil ? 'சாலையில் ஆழமான குழி' : 'Dangerous Pothole on Road';
          description = isTamil 
            ? `சாலையில் உள்ள ஆழமான குழி வாகன ஓட்டிகளுக்கு பெரும் ஆபத்தை ஏற்படுத்துகிறது. உடனடியாக சீரமைக்கப்பட வேண்டும். (${notes})`
            : `A deep and hazardous pothole reported at the location, posing a severe risk to two-wheelers and night commuters. Prompt asphalt repaving is required. (${notes})`;
          category = 'Roads';
          severity = 'Major';
        } else if (lowercaseNotes.includes('garbage') || lowercaseNotes.includes('waste') || lowercaseNotes.includes('kuppai')) {
          title = isTamil ? 'குப்பை குவியல் அகற்றப்பட வேண்டும்' : 'Accumulated Garbage Dump Clearing';
          description = isTamil
            ? `குப்பைகள் குவிந்து கிடப்பதால் கடுமையான துர்நாற்றம் வீசுகிறது மற்றும் சுகாதார சீர்கேடு ஏற்படுகிறது. (${notes})`
            : `Illegal and heavy accumulation of commercial garbage and plastic waste on the public lane, emitting foul odors and attracting pests. Emergency sanitation cleanup is requested. (${notes})`;
          category = 'Sanitation';
          severity = 'Major';
        } else if (lowercaseNotes.includes('light') || lowercaseNotes.includes('dark') || lowercaseNotes.includes('vilakku')) {
          title = isTamil ? 'தெருவிளக்கு வேலை செய்யவில்லை' : 'Non-Functional Street Light';
          description = isTamil
            ? `தெருவிளக்கு எரியாததால் இரவு நேரத்தில் பொதுமக்கள் நடமாட அச்சப்படுகின்றனர். (${notes})`
            : `The local street light is burnt out, leaving the residential lane in complete darkness. This increases safety risks and requires swift bulb replacement. (${notes})`;
          category = 'Street Lights';
          severity = 'Minor';
        } else if (lowercaseNotes.includes('water') || lowercaseNotes.includes('leak') || lowercaseNotes.includes('thanneer')) {
          title = isTamil ? 'குடிநீர் குழாய் கசிவு' : 'Public Water Pipeline Leakage';
          description = isTamil
            ? `முக்கிய குடிநீர் குழாயில் கசிவு ஏற்பட்டு தண்ணீர் வீணாகிறது. (${notes})`
            : `A major leakage detected in the clean water supply pipeline, leading to significant drinking water wastage and road erosion. Repairs are urgently needed. (${notes})`;
          category = 'Water Supply';
          severity = 'Major';
        }

        return res.json({ title, description, category, severity });
      }

      // Lazy load the GoogleGenAI instance with named parameters
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const isTamil = language === 'ta';
      const systemInstruction = `You are an expert civic officer and public relations writer. Your task is to analyze rough citizen notes of an issue, and transform them into professional, clear titles and descriptions.
If the language requested is 'ta' (Tamil), output BOTH 'title' and 'description' entirely in elegant, clear Tamil.
If 'en' (English), output BOTH in highly professional, formal English.
Also, classify the issue into one of these strict categories: 'Sanitation', 'Roads', 'Water Supply', 'Street Lights', 'Safety', 'Other'.
Assign a suggested severity: 'Critical', 'Major', 'Minor' depending on hazards to human life, transport flow, or sanitation.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Rough notes: ${notes}. Translate/Output language: ${language}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'A formal, concise, and professional civic grievance title.',
              },
              description: {
                type: Type.STRING,
                description: 'A highly clear, formal description summarizing the issue, specific hazards, and action requested.',
              },
              category: {
                type: Type.STRING,
                enum: ['Sanitation', 'Roads', 'Water Supply', 'Street Lights', 'Safety', 'Other'],
              },
              severity: {
                type: Type.STRING,
                enum: ['Critical', 'Major', 'Minor'],
              },
            },
            required: ['title', 'description', 'category', 'severity'],
          },
        },
      });

      const resultText = response.text?.trim() || '{}';
      const parsed = JSON.parse(resultText);
      return res.json(parsed);

    } catch (error: any) {
      console.error('Error generating AI contents:', error);
      return res.status(500).json({ error: error.message || 'Error processing AI assistant request.' });
    }
  });

  // Vite Middleware or production static asset delivery
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch(console.error);
