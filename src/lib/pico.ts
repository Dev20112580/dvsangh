/// <reference types="vite/client" />
const PICO_PK = import.meta.env.VITE_PICO_PK;

export async function askGuru(message: string) {
  try {
    const response = await fetch('https://backend.buildpicoapps.com/aero/run/llm-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `You are Guru, the wise and helpful AI assistant for Dronacharya Vidyarthi Sangh (DVS). 
        DVS is an NGO and Student Union dedicated to student welfare, education, and community support.
        
        Answer based on this identity. Keep responses natural and helpful.
        
        User Message: ${message}`,
        appId: 'dvs-guru-ai',
        id: PICO_PK
      }),
    });

    if (!response.ok) {
      throw new Error('Pico AI request failed');
    }

    const data = await response.json();
    return data.status === 'success' ? data.text : 'Sorry, I am having trouble connecting right now.';
  } catch (error) {
    console.error('Pico AI Error:', error);
    return 'I apologize, but I encountered an error. Please try again later.';
  }
}
