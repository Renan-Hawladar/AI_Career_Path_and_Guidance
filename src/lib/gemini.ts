const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface CareerRecommendation {
  career_title: string;
  summary: string;
  market_demand: string;
  confidence_score: number;
  required_skills: string[];
  salary_range: string;
  growth_outlook: string;
}

export interface RoadmapItem {
  title: string;
  description: string;
  difficulty_level: string;
  estimated_duration: string;
  resource_links: Array<{ title: string; url: string; type: string }>;
  certification_paths: string[];
}

export interface SkillGap {
  missing_skill: string;
  importance: string;
  course_suggestions: Array<{ title: string; provider: string; url: string }>;
}

export async function generateCareerRecommendations(
  skills: string[],
  goals: string,
  education: string,
  bio: string
): Promise<CareerRecommendation[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `As a career guidance AI, analyze this profile and provide exactly 5 personalized career recommendations in JSON format.

Profile:
- Skills: ${skills.join(', ')}
- Career Goals: ${goals}
- Education: ${education}
- Bio: ${bio}

Provide a JSON array of 5 career recommendations. Each should have:
- career_title: specific job role name
- summary: 2-3 sentence role description
- market_demand: current market analysis
- confidence_score: number 60-95
- required_skills: array of 5-8 key skills
- salary_range: realistic range
- growth_outlook: future predictions

Return ONLY valid JSON array, no other text.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Gemini API error:', error);
    return [];
  }
}

export async function generateRoadmap(
  careerTitle: string,
  currentSkills: string[],
  requiredSkills: string[]
): Promise<RoadmapItem[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Create a detailed learning roadmap for becoming a ${careerTitle}.

Current Skills: ${currentSkills.join(', ')}
Required Skills: ${requiredSkills.join(', ')}

Provide 8-12 learning milestones in JSON format. Each milestone should have:
- title: clear milestone name
- description: what will be learned
- difficulty_level: Beginner/Intermediate/Advanced/Expert
- estimated_duration: realistic timeframe
- resource_links: array of 3-5 learning resources with title, url, and type (course/documentation/tutorial/project)
- certification_paths: array of relevant certifications

Return ONLY valid JSON array, no other text.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 3072,
        },
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error('Gemini API error:', error);
    return [];
  }
}

export async function analyzeSkillGaps(
  careerTitle: string,
  currentSkills: string[],
  requiredSkills: string[]
): Promise<SkillGap[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const missingSkills = requiredSkills.filter(
    skill => !currentSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
  );

  const prompt = `Analyze skill gaps for ${careerTitle} role.

Current Skills: ${currentSkills.join(', ')}
Missing Skills: ${missingSkills.join(', ')}

For each missing skill, provide:
- missing_skill: skill name
- importance: Critical/High/Medium/Low
- course_suggestions: array of 2-4 courses with title, provider, and realistic url

Return ONLY valid JSON array, no other text.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error('Gemini API error:', error);
    return [];
  }
}

export async function chatWithAI(message: string, conversationHistory: Array<{ role: string; message: string }>): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const systemPrompt = `You are a professional career mentor AI. Your role is to provide career guidance, mentorship, and advice. Stay focused on career-related topics including:
- Career path recommendations
- Skill development strategies
- Job search and interview preparation
- Professional growth and networking
- Industry trends and insights
- Work-life balance and career transitions

Keep responses concise, actionable, and supportive. If asked about non-career topics, politely redirect to career-related discussions.`;

  const conversationContext = conversationHistory
    .slice(-6)
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.message}`)
    .join('\n');

  const fullPrompt = `${systemPrompt}\n\nConversation history:\n${conversationContext}\n\nUser: ${message}\n\nAssistant:`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an error. Please try again.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'I apologize, but I encountered an error. Please try again.';
  }
}
