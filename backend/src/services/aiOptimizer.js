const OpenAI = require('openai');

/**
 * AI Optimization Service using OpenAI GPT
 * 
 * Prompt Engineering Approach:
 * 1. Title Optimization: Focus on keywords, readability, and Amazon's 200-character limit
 * 2. Bullet Points: Emphasize clarity, benefits over features, and proper formatting
 * 3. Description: Create persuasive content while maintaining compliance with Amazon guidelines
 * 4. Keywords: Generate SEO-relevant terms based on product context
 * 
 * All prompts include:
 * - Clear instructions and constraints
 * - Context about Amazon's requirements
 * - Emphasis on avoiding prohibited claims (medical, unsubstantiated, etc.)
 */
class AIOptimizer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async optimizeProduct(productData) {
    try {
      const { title, bulletPoints, description } = productData;

      // Create a comprehensive prompt for all optimizations
      const prompt = `You are an expert Amazon product listing optimizer. Analyze and optimize the following product listing.

Original Title: ${title}

Original Bullet Points:
${bulletPoints.map((bp, i) => `${i + 1}. ${bp}`).join('\n')}

Original Description:
${description}

Please provide optimized content following these guidelines:

1. OPTIMIZED TITLE (max 200 characters):
   - Include primary keywords naturally
   - Make it readable and compelling
   - Follow Amazon's title guidelines
   - Do not use ALL CAPS or promotional language

2. OPTIMIZED BULLET POINTS (5 points):
   - Start each with a benefit or key feature
   - Be clear, concise, and scannable
   - Highlight product value propositions
   - Use proper grammar and punctuation
   - Keep each point under 250 characters

3. OPTIMIZED DESCRIPTION (200-300 words):
   - Engaging opening that hooks the reader
   - Explain benefits and use cases
   - Address potential customer concerns
   - Include a call to action
   - Avoid unsubstantiated claims, medical claims, or superlatives without proof
   - Maintain compliance with Amazon's content policy

4. KEYWORD SUGGESTIONS (3-5 keywords):
   - Relevant search terms customers might use
   - Include long-tail keywords
   - SEO-focused for Amazon search

Format your response as JSON:
{
  "title": "optimized title here",
  "bulletPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "description": "optimized description here",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert Amazon product listing optimizer with deep knowledge of SEO, copywriting, and Amazon's content policies. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const content = response.choices[0].message.content;
      
      // Extract JSON from the response (handle potential markdown code blocks)
      let jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }

      const optimized = JSON.parse(jsonMatch[0]);

      // Validate the response structure
      if (!optimized.title || !optimized.bulletPoints || !optimized.description || !optimized.keywords) {
        throw new Error('Invalid optimization response structure');
      }

      return optimized;

    } catch (error) {
      console.error('AI Optimization Error:', error);
      
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid or missing. Please check your configuration.');
      }
      
      throw new Error(`AI optimization failed: ${error.message}`);
    }
  }
}

module.exports = new AIOptimizer();
