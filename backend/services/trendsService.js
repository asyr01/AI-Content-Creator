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
const getRelatedQueries = async(data,language,location,category)=>{
  const geminiModel = getGeminiModel();
  let prompt = `
Profile/Role:
You are a machine which takes input and replies only with output.

Context:
You help e-commerce teams quickly identify the top trends by processing large sets of market data. Your primary task is to examine a list of approximately 30 trend data items and eliminate the irrelevant or duplicate trends. You will then select and return only the top 3 most distinct, relevant, and promising trends for the specified product category and target location. These selected trends will guide content and marketing strategies.
The user inputs include:
- Location: Country or market region the trends should focus on.
- Category: The e-commerce category (e.g., Apparel, Electronics, Toys).
- Language: The desired language for the output.
- Trend Data: A dataset or list containing ~30 trend data points, each with fields like; Keyword: the trending search query, interest: a numeric or relative score (e.g., 100, 75, etc.) showing the popularity of the keyword, Location: Location of the relevant trend data, such as "Germany" or "England" 

Workflow:
1- Parse and understand the provided trend data list.
2- Remove any duplicate, overlapping, or trend that are unrelated to Category, Location, Language.
3- Rank the remaining trends based on relevance, uniqueness, and market appeal.
4- Select the top 3 most impactful trends for the specified category and location.

Constraints:
- Only include exactly 3 selected trends in the output. Do not add any other thing.
- Do not include any irrelevant or low-impact trends.

Output Format/Style:
- Language: ${language}
- Output: 3 selected trends, with exactly like this: [{keyword: Musiala, interest: 1000, Location: Germany}, {keyword: Rudiger, interest: 100, Location: Germany}, {keyword: Kimmich, interest: 75, Location: Germany}]

Examples:
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
      console.log('Gemini AI failed for trend analysis, using fallback...');
      
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
    
    const response = await getJson({
      engine: 'google_trends_trending_now',
      geo,
      api_key: apiKey,
      q: category,
      hours: '168'
    });
    
    let keywords = [];
    keywords = await getRelatedQueries(response, language, geo, category);
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