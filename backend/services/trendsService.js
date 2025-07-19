import { json } from 'express';
import googleTrends from 'google-trends-api';
import { getJson } from "serpapi";
import { getGeminiModel } from '../utils/geminiClient.js';
// Category mapping for Google Trends
const categoryMapping = {
  'luxury': ['luxury goods', 'premium products', 'high-end'],
  'apparel': ['clothing', 'fashion', 'apparel', 'style'],
  'Technology': ['Technology', 'gadgets', 'technology', 'smart devices'],
  'fashion': ['fashion', 'style', 'trendy', 'clothing'],
  'toys': ['toys', 'games', 'children', 'kids'],
  'home-garden': ['home decor', 'garden', 'furniture', 'interior'],
  'sports': ['sports', 'fitness', 'outdoor', 'athletic'],
  'beauty': ['beauty', 'cosmetics', 'skincare', 'makeup'],
  'automotive': ['cars', 'automotive', 'vehicles', 'auto'],
  'books': ['books', 'reading', 'literature', 'education']
};
function parseEmbeddedJson(raw) {
   // 1. Remove backticks, leading/trailing quotes
  let clean = raw
    .replace(/```json|```/g, '')   // drop ```json fences
    .replace(/^['"]+|['"]+$/g, '') // drop wrapping quotes
  
  // 2. Pull out the [ … ] block
  const m = clean.match(/\[.*\]/s);
  if (!m) throw new Error('No JSON array found');
  let json = m[0];
  
  // 3. Quote bare keys: {foo: → {"foo":
  json = json.replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":');
  
  // 4. (Optional) Remove trailing commas before } or ]
  json = json.replace(/,(\s*[}\]])/g, '$1');
  
  // 5. Parse
  return JSON.parse(json);
}

// Location mapping for SerpAPI geo codes
const locationMapping = {
  'Germany': 'DE',
  'United States': 'US',
  'United Kingdom': 'GB',
  'France': 'FR',
  'Italy': 'IT',
  'Spain': 'ES',
  'Japan': 'JP',
  'Canada': 'CA',
  'Australia': 'AU',
  'Brazil': 'BR',
  'India': 'IN',
  'China': 'CN'
};
const getRelatedQueries = async(data, language, location, category) => {
  const geminiModel = getGeminiModel();
  let prompt = `
Select the 3 most relevant ${category} keywords for e-commerce content creation.

Category: ${category}
Location: ${location} 
Language: ${language}

Trending Data: ${JSON.stringify(data)}

Requirements:
- Choose keywords that are COMMERCIAL/SHOPPING related to ${category}
- Prioritize brand names, product names, shopping terms  
- Avoid entertainment content (TV shows, movies) unless they are product brands
- Select keywords most useful for marketing ${category} products

Return format: [{"keyword": "brand name", "interest": 90, "Location": "${location}"}]
Return only the JSON array with 3 results.

Input:
- Location: Germany
- Language: English
- Category: Football
- Trend Data: [{ "keyword": "Transformer toy", "interest": 1350, "Location": "Germany" }, { "keyword": "Hot wheels", "interest": 450, "Location": "Germany" }, { "keyword": "Jamal Musiala", "interest": 1250, "Location": "Germany" }, { "keyword": "PlayStation", "interest": 50, "Location": "Germany" }, { "keyword": "Michael Phelps", "interest": 1100, "Location": "Germany" }, { "keyword": "Rubik’s Cube", "interest": 300, "Location": "Germany" }, { "keyword": "Coco Gauff", "interest": 700, "Location": "Germany" }, { "keyword": "Titanic (film)", "interest": 150, "Location": "Germany" }, { "keyword": "Conor McGregor", "interest": 950, "Location": "Germany" }, { "keyword": "Usain Bolt", "interest": 400, "Location": "Germany" }, { "keyword": "Barbie", "interest": 100, "Location": "Germany" }, { "keyword": "Roger Federer", "interest": 600, "Location": "Germany" }, { "keyword": "Thomas Müller", "interest": 1400, "Location": "Germany" }, { "keyword": "Tiger Woods", "interest": 750, "Location": "Germany" }, { "keyword": "Shohei Ohtani", "interest": 200, "Location": "Germany" }, { "keyword": "Novak Djokovic", "interest": 1050, "Location": "Germany" }, { "keyword": "LeBron James", "interest": 1450, "Location": "Germany" }, { "keyword": "Jonas Salk", "interest": 250, "Location": "Germany" }, { "keyword": "Harry Potter (book series)", "interest": 500, "Location": "Germany" }, { "keyword": "Khabib Nurmagomedov", "interest": 850, "Location": "Germany" }, { "keyword": "Lego", "interest": 350, "Location": "Germany" }, { "keyword": "Serena Williams", "interest": 1200, "Location": "Germany" }, { "keyword": "Lewis Hamilton", "interest": 1500, "Location": "Germany" }, { "keyword": "Virat Kohli", "interest": 650, "Location": "Germany" }, { "keyword": "iPhone", "interest": 550, "Location": "Germany" }, { "keyword": "Stephen Curry", "interest": 1300, "Location": "Germany" }, { "keyword": "Kevin Durant", "interest": 900, "Location": "Germany" }, { "keyword": "Manuel Neuer", "interest": 1000, "Location": "Germany" }, { "keyword": "Godzilla", "interest": 800, "Location": "Germany" }, { "keyword": "Anthony Joshua", "interest": 1150, "Location": "Germany" }]

Output Example:
[{keyword: Jamal Musiala, interest: 1000, Location: Germany}, {keyword: Manuel Neuer, interest: 950, Location: Germany}, {keyword: Thomas Müller, interest: 900, Location: Germany}]

Directive:
Pick 3 relevant data from this: ${data}
Other inputs are: 
- Location: ${location}
- Language: ${language}
- Category: ${category}
`;
let generatedContent;
try {
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      generatedContent = response.text();
      
      // Parse the AI response
      generatedContent = parseEmbeddedJson(generatedContent);
      return generatedContent;
    } catch (apiError) {
      console.error('Gemini AI Error Details:');
      console.error('- Status:', apiError.status || 'unknown');
      console.error('- Message:', apiError.message || 'unknown');
      console.error('- Code:', apiError.code || 'unknown');
      if (apiError.status === 429) {
        console.error('RATE LIMIT EXCEEDED - Too many requests to Gemini API');
      }
      
      // Return error indication for user to see
      return [{
        keyword: "Could not fetch trending keywords",
        interest: 0,
        Location: location,
        error: true
      }];
    }

}
export const getTrendingKeywords = async (category, location, language) => {
  try {
    const apiKey = process.env.SERPAPI_KEY;
    const geo = locationMapping[location] || 'us';
    
    // Get category-specific search terms
    const searchTerms = categoryMapping[category.toLowerCase()] || [category];
    const mainTerm = searchTerms[0];
    
    console.log('Category passed:', category);
    console.log('Category mapping found:', searchTerms);
    console.log('Main term for SerpAPI:', mainTerm);
    console.log('Location (geo):', geo);
    
    const response = await getJson({
      engine: 'google_trends',
      q: mainTerm,
      geo,
      api_key: apiKey,
      date: 'now 7-d',
      data_type: 'RELATED_QUERIES'
    });
    
    console.log('SerpAPI Response received:', JSON.stringify(response, null, 2));
    
    let keywords = [];
    keywords = await getRelatedQueries(response, language, geo, category);
    console.log('Processed keywords from Gemini:', keywords);
    return keywords;
  } catch (error) {
    console.error('Error in getTrendingKeywords:', error);
    // Return error indication for user to see
    return [{
      keyword: "Could not fetch trending keywords - API unavailable",
      interest: 0,
      Location: location,
      error: true
    }];
  }
}
;

// export const getRelatedTopics = async (category, location) => {
//   try {
//     const geoCode = (locationMapping[location] || 'us').toUpperCase();
//     const mainKeyword = categoryMapping[category.toLowerCase()]?.[0] || category;
    
//     const results = await googleTrends.relatedTopics({
//       keyword: mainKeyword,
//       startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
//       endTime: new Date(),
//       geo: geoCode
//     });
    
//     const data = JSON.parse(results);
//     const relatedTopics = data.default?.rankedList?.[0]?.rankedKeyword || [];
    
//     return relatedTopics.slice(0, 10).map(topic => ({
//       topic: topic.topic?.title || topic.query,
//       value: topic.value || Math.floor(Math.random() * 100)
//     }));
    
//   } catch (error) {
//     console.error('Error in getRelatedTopics:', error);
    
//     // Fallback related topics
//     const fallbackTopics = [
//       `trending ${category}`,
//       `popular ${category}`,
//       `best ${category}`,
//       `new ${category}`,
//       `${category} trends`
//     ];
    
//     return fallbackTopics.map(topic => ({
//       topic: topic,
//       value: Math.floor(Math.random() * 80) + 20
//     }));
//   }
// };