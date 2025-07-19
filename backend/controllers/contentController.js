import { getGeminiModel } from '../utils/geminiClient.js';
import ContentProject from '../models/contentProjectModel.js';
import User from '../models/userModel.js';
import { getTrendingKeywords } from '../services/trendsService.js';
import asyncHandler from '../middleware/asyncHandler.js';

// Keep track of how many projects each user creates
const updateUserStats = async (userId, projectType) => {
  try {
    console.log('Updating user stats for:', userId, 'project type:', projectType);
    
    const updateObj = {
      $inc: {
        'stats.totalProjects': 1
      },
      $set: {
        'stats.lastActiveAt': new Date()
      }
    };

    // Count specific project types separately
    switch (projectType) {
      case 'content-drafting':
        updateObj.$inc['stats.contentDrafts'] = 1;
        break;
      case 'content-modification':
        updateObj.$inc['stats.contentModifications'] = 1;
        break;
      case 'image-prompt':
        updateObj.$inc['stats.imagePrompts'] = 1;
        break;
    }

    const result = await User.findByIdAndUpdate(userId, updateObj, { new: true });
    console.log('User stats updated successfully. New stats:', result.stats);
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};

// Generate new blog posts and marketing content
export const createContentDraft = asyncHandler(async (req, res) => {
  const {
    title,
    location,
    language,
    tone,
    category,
    contentIntent,
    desiredLength
  } = req.body;

  if (!title || !location || !language || !tone || !category || !contentIntent) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  let project;

  try {
    // Save project details to database
    project = new ContentProject({
      user: req.user._id,
      title,
      projectType: 'content-drafting',
      location,
      language,
      tone,
      category,
      contentIntent,
      desiredLength: desiredLength || '300-400 words',
      status: 'generating'
    });

    await project.save();

    // Find what's popular right now
    const trendingKeywords = await getTrendingKeywords(category, location,language);
   

    // Add trending keywords to the project
    project.trendingKeywords = trendingKeywords;
    await project.save();

    // Use AI to write the content
    const geminiModel = getGeminiModel();
    
    const trendKeywordsText = trendingKeywords.map(k => k.keyword).join(', ');
    const prompt = `
Write a ${tone} ${category} blog post in ${language} for ${location} market.

Trending keywords to include: ${trendKeywordsText}

Requirements:
- Write in ${tone} tone for ${location} audience
- Include the trending keywords naturally in the content
- Focus on ${category} products/brands
 

 
Content purpose: ${contentIntent}
Length: ${desiredLength}
 

Rules:
Input: 
- Location: Germany 
- Language: English 
- Tone: Persuasive 
- Category: Apparel 
- Given Task: Write a blog post about rising fashions in the Future. 
Output Example: 
Which fashion is rising in the Future?
Germany’s fashion landscape is undergoing a transformation—and if you're in the apparel business, now is the time to ride the wave of change. Recent consumer trends reveal a strong surge in interest toward future-facing fashion styles that blend sustainability, innovation, and personalization.
Search data shows that terms like “eco-friendly streetwear,” “modular fashion,” and “tech-integrated clothing” are rapidly gaining momentum across German audiences. These aren’t just fleeting keywords—they represent a shift in how consumers perceive clothing: not just as products, but as experiences and statements.
Eco-friendly streetwear is leading the charge, appealing especially to Gen Z and millennial shoppers who value both aesthetics and ethical sourcing. Organic cotton, recycled fabrics, and minimalist yet expressive designs are turning heads online—and in-store. For retailers, this is an opportunity to position themselves not just as fashion providers, but as contributors to a greener planet.
Equally compelling is the rise of modular clothing—garments designed with interchangeable parts or adjustable elements. In a world where flexibility is key, consumers are embracing items that can evolve with their needs, offering more value and uniqueness per purchase. This trend plays especially well in urban centers like Berlin, where individuality and practicality coexist.
Another game-changer is tech-integrated fashion. From temperature-adapting fabrics to garments that sync with wearables, fashion is moving into the digital age. Shoppers are increasingly intrigued by clothing that doesn’t just look good but performs smartly. As search volumes grow for phrases like “wearable fashion tech” and “AI-designed outfits,” brands that innovate here are likely to dominate the conversation.
For apparel brands targeting Germany, aligning with these emerging interests isn’t optional—it’s essential. By embracing the future now, you’re not just following trends. You’re leading them.
So, which fashion is rising in the future? The answer is clear: sustainable, smart, and modular. And the time to act is now.
 
Now, generate an initial promotional blog post draft based on trend data and user inputs. 
- Location: ${location}
- Language: ${language}
- Tone: ${tone}
- Category: ${category}
- Given Task: ${contentIntent}.
- Word Count: ${desiredLength}
Profile/Role
Context
Workflow
Constraints
Output Format/Style
Examples
Directive

Follow these rules:
Only use the trend data from ${trendKeywordsText} corresponding to the specified location and ${category}. 
Do not include keywords or trends unrelated to ${category}. 
Only return the blog post draft. Do not add any explanation or commentary.
If given, stay within the specified word count range, do not exceed it. 
Do not include headings unless required by the tone or style.
Mention about the trends, do not mention the exact scores.
Do not write the given input, analyze of this data or the cleaned version of this data, the things you have done or you will do. Reply this message with only pure the blog post draft.
Please when using ${contentIntent} always check if this is purposed
to be social media contenting. If it requests something or tries to give information which are irrelevant to chosen; ${language}, ${category}, ${tone},
${location} and content creation please always give the following response:
"Please give related content and dont abuse this application. If you continue to try abusing this app
you will be perma-banned"

`;

    let generatedContent;
    
    try {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      generatedContent = response.text();
    } catch (apiError) {
      console.error('Gemini Content Generation Error:');
      console.error('- Status:', apiError.status || 'unknown');
      console.error('- Message:', apiError.message || 'unknown');
      console.error('- Code:', apiError.code || 'unknown');
      if (apiError.status === 429) {
        console.error('RATE LIMIT EXCEEDED - Too many requests to Gemini API');
      }
      
      // Fallback content generation
      generatedContent = `
# ${title}

Are you looking for the perfect ${category} solution? Look no further! Our premium ${category} products are designed with ${location} customers in mind.

## Why Choose Our ${category} Products?

${trendKeywordsText.split(', ').map(keyword => 
  `• **${keyword.charAt(0).toUpperCase() + keyword.slice(1)}**: Top-quality ${keyword} that meets your needs`
).join('\n')}

## Perfect for ${location} Market

Our ${tone} approach ensures that every product delivers exceptional value. Whether you're a professional or enthusiast, our ${category} selection offers:

- Premium quality and reliability
- Cutting-edge features and technology  
- Designed specifically for ${language}-speaking customers
- Optimized for the ${location} market

${contentIntent}

**Ready to experience the difference?** Contact us today to learn more about our ${category} solutions!

---
*This content incorporates trending keywords: ${trendKeywordsText}*
      `.trim();
      
    }

    // Save the AI-generated content
    project.generatedContent = generatedContent;
    project.status = 'completed';
    await project.save();

    // Track user activity
    await updateUserStats(req.user._id, 'content-drafting');

    res.json({
      success: true,
      project: project,
      trendingKeywords
    });

  } catch (error) {
    console.error('Content drafting error:', error);
    
    // Update project status to failed
    if (project) {
      project.status = 'failed';
      await project.save();
    }
    
    res.status(500);
    throw new Error('Failed to generate content draft');
  }
});

// Edit and improve existing content
export const modifyContent = asyncHandler(async (req, res) => {
  const {
    title,
    language,
    tone,
    originalContent,
    modificationType
  } = req.body;

  if (!title || !language || !tone || !originalContent || !modificationType) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  let project;

  try {
    // Save project details to database
    project = new ContentProject({
      user: req.user._id,
      title,
      projectType: 'content-modification',
      language,
      tone,
      originalContent,
      modificationType,
      status: 'generating'
    });

    await project.save();

    // Generate modified content using Gemini AI
    const geminiModel = getGeminiModel();
    
    let prompt = '';
    switch (modificationType) {
      case 'elaborate':
        prompt = `Profile/Role:
 You are a ${tone} AI assistant specialized in expanding brief content into more informative, compelling, or explanatory text.
Context:
 You help users develop short or under-detailed texts into richer, fuller content. The goal is to stay true to the original intent while adding helpful context, examples, or benefits.
Workflow:
Understand the core idea and tone of the original text.

Expand the message by adding relevant context, supporting details, or examples.

Use a natural, flowing structure aligned with the specified tone and language.

Keep the elaboration purposeful and connected to the original intent.

Ensure clarity, coherence, and added value.
Constraints:
Stay true to the original message and tone. Do not change the intended meaning or include unnecessary repetition.

Expand with relevant details or examples, not unrelated content.

Keep the elaboration clear, focused, and natural. Do not return multiple versions or add editorial commentary.

Do not exceed the length that feels appropriate for the expanded purpose.
Output Format/Style:
Language:${language}

Tone: ${tone}

Style: Detailed, natural, value-driven

Output: Plain text elaborated version
Examples:
 Input:
Language: English

Tone: Persuasive

Given Text:
 "Our customer support team is here to help."

Output Example:
 "Our dedicated customer support team is available to assist you with any questions or issues you may encounter. Whether you're troubleshooting a product, seeking guidance on a service, or just need clarification, we're ready to help every step of the way. We pride ourselves on quick response times, friendly communication, and clear resolutions. Our support team is trained across all departments, ensuring you get expert advice tailored to your situation. You can reach us via chat, email, or phone, whichever you prefer. Your satisfaction is our top priority, and we're committed to making your experience smooth and stress-free."
Directive:
Look at the given input below, elaborate on the original sentence by adding valuable context, explanation, and relevant features while preserving the core idea and tone.

 Input:
Language:${language}

Tone: ${tone}

Given Text:
${originalContent}
`;
        break;
      case 'summarize':
        prompt = `Profile/Role:
You are a ${tone} AI assistant skilled at creating concise summaries of long-form content for faster reading and clearer understanding.
Context:
You help users extract the core message and most essential points from longer pieces of text, making them quicker to grasp without losing key information.
Workflow:
Read the input text thoroughly and identify its core message.

Extract only the most essential points and supporting details.

Remove repetition, minor elaborations, or filler content.

Ensure the summary remains accurate, clear, and matches the requested tone and language.

Keep the output structured and digestible.
Constraints:
Only include essential points and the core message. Do not add any personal opinions, additional information, or examples.

Maintain the original tone and context of the input. Do not include commentary about what was summarized.

Keep the summary brief, ideally around one-third the length of the original.
Output Format/Style:
Language:${language}

Tone: ${tone}

Style: Concise, structured, and clearly written

Output: Plain text summary only

Examples:
 Input:
Language: English

Tone: Professional

Given Text:
"Our internal training program is undergoing a major update this year. The new model will focus on hybrid learning, combining in-person workshops with flexible online modules. We've partnered with leading industry experts to design the new curriculum, ensuring it meets the evolving needs of our workforce. Employees will have access to certifications in areas like leadership, data literacy, and digital tools. We're also introducing mentorship programs and peer-to-peer learning to enhance collaboration and knowledge sharing. The rollout will begin in Q3, starting with high-priority departments. Managers will receive a toolkit to help guide their teams through the transition."

Output Example:
The company's updated training program will combine in-person and online learning, starting in Q3. It includes expert-designed content, certification opportunities, and mentoring. High-priority departments will be the first to implement it, with manager toolkits supporting the transition.
Directive:
Look at the given input below, summarize the given text by condensing it to the most important information while maintaining clarity and tone.
 Input:
Language:${language}

Tone: ${tone}

Given Text:
${originalContent}
`;
        break;
      case 'rephrase':
        prompt = `Profile/Role:
You are a ${tone} AI assistant skilled in content transformation and rewriting for improved clarity, tone, or engagement.
Context:
You assist users by rephrasing written content while preserving its original meaning. The aim is to improve tone, clarity, structure, or flow based on user-defined style and language preferences.
Workflow:
Read and comprehend the input text fully.

Rephrase it while keeping the original message intact.

Adjust word choice, syntax, and transitions for improved readability and fluency.

Reflect the specified tone and language throughout the rephrased version.

Return a single, well-phrased version tailored to the user's request.
Constraints:
Only return the rephrased version of the original text. Do not add explanations, notes, or multiple versions.

Match the specified tone and language precisely.

Keep all original ideas and intentions intact. Do not skip or omit any part of the original message.
Output Format/Style:
Language:${language}

Tone: ${tone}

Style: Fluent, clear, tone-aligned

Output: Plain text rephrased version only
Examples:
 Input:
Language: English

Tone: Professional

Given Text:
 "Our company has always been committed to delivering high-quality solutions tailored to client needs. Over the past year, we've invested heavily in improving our development process, ensuring greater speed and stability. We've also expanded our team with experienced professionals in UX design, data engineering, and AI. These changes allow us to offer even more innovative, scalable, and secure solutions to our clients. We understand that every project is unique, and we approach each one with fresh eyes. Thank you for trusting us as your partner in digital transformation."

Output Example:
"At our company, we remain dedicated to providing top-tier solutions that meet the unique requirements of our clients. Over the last year, we have enhanced our development workflows to increase efficiency and reliability. Our team has grown to include skilled experts in UX design, data engineering, and artificial intelligence. These additions empower us to build smarter, more scalable, and secure solutions. We treat each project as a new opportunity, tailoring our approach to meet your specific goals. We're grateful for the trust you've placed in us to support your digital evolution."
Directive:
Look at the given input below, rephrase the given text while keeping its meaning and tone, making it sound more natural and easy to read.
 Input:
Language:${language}

Tone: ${tone}

Given Text:
${originalContent}
`;
        break;
      default:
        prompt = 'Improve the following content while maintaining its core message.';
    }
    let generatedContent;
    
    try {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      generatedContent = response.text();
      console.log('Content modification successful via Gemini AI');
    } catch (apiError) {
      console.log('Gemini API failed, using fallback content modification...');
      
      // Fallback content modification based on type
      switch (modificationType) {
        case 'elaborate':
          generatedContent = `${originalContent}

**Enhanced Details:**

Building upon the original content, here's a more comprehensive perspective. This ${tone} approach provides additional context and valuable insights to help you better understand the content.

**Key Features & Benefits:**
• Enhanced functionality that delivers superior performance and value
• Improved clarity and comprehensive information
• Professional quality and attention to detail
• User-focused design and reliability

**Additional Advantages:**
- Optimized for ${language}-speaking audiences
- Clear, professional presentation
- Comprehensive coverage of important points
- Exceptional user experience and reliability

This enhanced version provides a thorough overview while maintaining the original message and intent.`;
          break;

        case 'summarize':
          const firstSentence = originalContent.split('.')[0];
          generatedContent = `**Summary:**

${firstSentence}. This ${tone} content provides key information in a concise format.

**Quick Benefits:** Clear communication, professional presentation, and focused on essential information for ${language} audiences.`;
          break;

        case 'rephrase':
          const sentences = originalContent.split('.').filter(s => s.trim());
          generatedContent = sentences.map(sentence => {
            if (sentence.includes('good')) {
              return sentence.replace('good', 'excellent').replace('decent', 'outstanding');
            }
            return sentence.charAt(0).toUpperCase() + sentence.slice(1).trim();
          }).join('. ') + '.';
          
          generatedContent += `\n\nThis ${tone} version maintains the original meaning while improving clarity and flow for ${language} readers.`;
          break;

        default:
          generatedContent = originalContent;
      }
      
      console.log('Fallback content modification generated, length:', generatedContent.length);
    }

    // Save the AI-generated content
    project.generatedContent = generatedContent;
    project.status = 'completed';
    await project.save();

    // Track user activity
    await updateUserStats(req.user._id, 'content-modification');

    res.json({
      success: true,
      project: project,
      originalContent,
      modifiedContent: generatedContent
    });

  } catch (error) {
    console.error('Content modification error:', error);
    
    if (project) {
      project.status = 'failed';
      await project.save();
    }
    
    res.status(500);
    throw new Error('Failed to modify content');
  }
});

// Create prompts for AI image generation
export const generateImagePrompt = asyncHandler(async (req, res) => {
  const {
    title,
    location,
    language,
    tone,
    category,
    baseContent,
    visualStyle
  } = req.body;

  if (!title || !location || !language || !tone || !category || !baseContent) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  let project;

  try {
    // Save project details to database
    project = new ContentProject({
      user: req.user._id,
      title,
      projectType: 'image-prompt',
      location,
      language,
      tone,
      category,
      originalContent: baseContent,
      visualStyle: visualStyle || 'minimalistic, high-contrast background',
      status: 'generating'
    });

    await project.save();

    // Find what's popular right now for context
    const trendingKeywords = await getTrendingKeywords(category, location,language);
    project.trendingKeywords = trendingKeywords;
    await project.save();

    // Generate image prompt using Gemini AI
    const geminiModel = getGeminiModel();
    
    const prompt = `
Create a detailed image generation prompt based on the following content and specifications:

Content: "${baseContent}"

Specifications:
- Category: ${category}
- Tone: ${tone}
- Target Location: ${location}
- Visual Style: ${visualStyle || 'minimalistic, high-contrast background'}

Requirements for the image prompt:
1. Create a detailed prompt suitable for AI image generation tools (like DALL-E, Midjourney, or SORA)
2. Include specific visual elements that align with the ${category} category
3. Incorporate the ${tone} tone through visual elements (colors, composition, mood)
4. Consider ${location} cultural preferences and market expectations
5. Ensure the prompt results in professional, marketing-ready visuals
6. Include technical specifications like lighting, composition, and style details

Generate a comprehensive image prompt that will create visuals perfectly aligned with the content and brand voice.
`;

    let imagePrompt;
    
    try {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      imagePrompt = response.text();
      console.log('Image prompt generation successful via Gemini AI');
    } catch (apiError) {
      console.log('Gemini API failed, using fallback image prompt generation...');
      
      // Fallback image prompt generation
      const trendKeywordsText = trendingKeywords.map(k => k.keyword).join(', ');
      
      imagePrompt = `You are an assistant that generates high-quality visual prompts for AI image-generation tools such as Sora. Your role is to transform structured inputs into a single, descriptive visual prompt that guides the model to produce a marketing-ready image. Your output must be clear, detailed, and unambiguous, helping the model accurately visualize the desired scene.
Use the following user-provided inputs:
Location: ${location}
Language: ${language}
Tone: ${tone}
Category: ${category}
Visual Style Preference: ${visualStyle}
Content Intent: ${originalContent}
Objective
Produce a fluent, platform-ready descriptive paragraph that fully captures the desired image. The description should reflect the user's campaign intent, target audience, and brand style. It must be clear enough to avoid ambiguity, focus on what should be included, and provide all necessary details to achieve a consistent, high-quality result.
Output Structure
Include the following elements in a cohesive paragraph, using precise, specific word choice:
Subject Focus
Identify exactly what product, person, or scene is featured.
Use singular or numbered plural forms (e.g., "a single model," "three pairs of shoes") for clarity.
Medium and Style
Describe the medium or visual treatment (e.g., high-resolution photo, watercolor illustration, digital painting).
Define the aesthetic clearly and incorporate the Visual Style Preference (${visualStyle}) as part of the description.
Environment
Specify the environment or setting (e.g., indoors, outdoors, city street, studio backdrop).
Provide contextual details relevant to the location or brand.
Lighting
Clearly describe lighting conditions (e.g., soft natural light, diffused studio lighting, warm sunset glow).
Color Palette
State the main colors or mood of the palette (e.g., vibrant, muted, monochromatic).
Avoid vague terms like "nice colors."
Mood and Tone Consistency
Ensure the mood matches the selected tone (e.g., persuasive, professional, friendly).
Composition and Shape
Specify the composition (e.g., close-up, full-body, bird’s-eye view) and the shape or aspect ratio (e.g., square 1:1, vertical 4:5 portrait, horizontal 16:9 banner).
Platform Relevance
Indicate the intended use (e.g., Instagram feed, website hero banner, online ad).
Constraints
Do not mention or repeat input variable names in the output.
Do not use negative descriptions (e.g., "without background clutter"). Instead, describe what should be included.
Do not include instructions, labels, bullet points, or headings in the output.
Avoid ambiguous, generic adjectives like "nice," "good," or "cool."
Use precise and specific language and synonyms (e.g., "sleek," "dynamic," "confident").
Write in the selected language (${language}) only, using fluent, persuasive phrasing.
The final output must be a single descriptive paragraph, ready to be used as an image-generation prompt.
Example
Input
Location: Germany
Language: English
Tone: Persuasive
Category: Fashion
Visual Style Preference: Soft, pastel, friendly atmosphere
Content Intent: I would like to create a post on Instagram to sell our man jeans.
Output
 Create a high-resolution Instagram image showing a confident male model wearing a single pair of slim-fit dark-wash jeans, standing on a modern European city sidewalk surrounded by softly blurred architecture in warm pastel hues. The visual style should feel friendly and approachable, with a soft, pastel atmosphere that highlights the product in a contemporary yet inviting way. Use natural side lighting with gentle shadows to emphasize the denim’s texture and quality. The color palette should feature muted beige, dusty blue, and soft gray tones to support a persuasive, welcoming mood that resonates with style-conscious German consumers. Format the composition as a vertical 4:5 portrait suitable for Instagram, with the model centered prominently in the frame and no distracting elements in the background.
`;
      
      console.log('Fallback image prompt generated, length:', imagePrompt.length);
    }

    // Update project with generated prompt
    project.generatedContent = imagePrompt;
    project.status = 'completed';
    await project.save();

    // Track user activity
    await updateUserStats(req.user._id, 'image-prompt');

    res.json({
      success: true,
      project: project,
      imagePrompt: imagePrompt,
      trendingKeywords,
      baseContent
    });

  } catch (error) {
    console.error('Image prompt generation error:', error);
    
    if (project) {
      project.status = 'failed';
      await project.save();
    }
    
    res.status(500);
    throw new Error('Failed to generate image prompt');
  }
});

// Get user's content projects
export const getUserProjects = asyncHandler(async (req, res) => {
  const projects = await ContentProject.find({ user: req.user._id })
    .select('title projectType status location category createdAt updatedAt')
    .sort({ updatedAt: -1 });

  res.json(projects);
});

// Get specific project
export const getProject = asyncHandler(async (req, res) => {
  const project = await ContentProject.findById(req.params.id);

  if (!project || project.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Project not found');
  }

  res.json(project);
});

// Delete project
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await ContentProject.findById(req.params.id);

  if (!project || project.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Project not found');
  }

  await ContentProject.deleteOne({ _id: project._id });
  res.json({ message: 'Project deleted successfully' });
});