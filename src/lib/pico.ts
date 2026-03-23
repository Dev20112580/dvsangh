const PICO_PK = import.meta.env.VITE_PICO_PK;
const LLM_URL = `https://backend.buildpicoapps.com/aero/run/llm-api?pk=${PICO_PK}`;

const SYSTEM_PROMPT = `You are "DVS Guru", the wise, encouraging, and highly professional AI mentor for Dronacharya Vidyarthi Sangh (DVS). 
Your persona: Supportive, knowledgeable, and culturally sensitive to rural and tribal students of Jharkhand.
Language: Respond primarily in professional Hinglish (a mix of Hindi and English) that is easy for rural students to understand. Use Hindi script for key greetings and encouragement.
Core Knowledge: You know everything about DVS programs (Scholarships, UPSC coaching, Digital Literacy, Sports, Girl Education).

GENERAL CHAT:
- Be encouraging. Use terms like "Beta", "Shandaar", "Himmat mat haro".
- If asked about DVS, mention it's Jharkhand's largest rural education NGO.
- Keep responses concise and focused. Avoid corporate jargon.`;

export async function askGuru(message: string) {
  try {
    const response = await fetch(LLM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: SYSTEM_PROMPT + "\n\nUser: " + message })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Guru API Error:', error);
    return { status: 'error', text: 'सर्वर वर्तमान में व्यस्त है। कृपया बाद में प्रयास करें।' };
  }
}
