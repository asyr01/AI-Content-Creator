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
const getRelatedQueries = async(data, language, location, category, contentIntent) => {
  const geminiModel = getGeminiModel();
  let prompt = `
Select the 3 most relevant ${category} keywords for this content purpose: "${contentIntent}"

Category: ${category}
Location: ${location} 
Language: ${language}
Content Purpose: ${contentIntent}

Trending Data: ${JSON.stringify(data)}

Requirements:
- ONLY select keywords from the provided trending data above
- Choose the 3 keywords that best match: "${contentIntent}" 
- Use the EXACT keyword and interest values from the data
- Do not create new keywords, only pick from the existing list

Return format: [{"keyword": "exact keyword from data", "interest": actual_score, "Location": "${location}"}]
Return only the JSON array with 3 results using REAL data only.

Input:
- Location: Germany
- Language: English
- Category: Football
- Trend Data: [{ "keyword": "Transformer toy", "interest": 1350, "Location": "Germany" }, , { "keyword": "Jamal Musiala", "interest": 1250, "Location": "Germany" }, { "keyword": "PlayStation", "interest": 50, "Location": "Germany" }, { "keyword": "Michael Phelps", "interest": 1100, "Location": "Germany" }, { "keyword": "Rubik’s Cube", "interest": 300, "Location": "Germany" }, { "keyword": "Coco Gauff", "interest": 700, "Location": "Germany" }, { "keyword": "Titanic (film)", "interest": 150, "Location": "Germany" }, { "keyword": "Conor McGregor", "interest": 950, "Location": "Germany" }, { "keyword": "Usain Bolt", "interest": 400, "Location": "Germany" }, { "keyword": "Barbie", "interest": 100, "Location": "Germany" }, { "keyword": "Roger Federer", "interest": 600, "Location": "Germany" }, { "keyword": "Thomas Müller", "interest": 1400, "Location": "Germany" }, { "keyword": "Tiger Woods", "interest": 750, "Location": "Germany" }, { "keyword": "Shohei Ohtani", "interest": 200, "Location": "Germany" }, { "keyword": "Novak Djokovic", "interest": 1050, "Location": "Germany" }, { "keyword": "LeBron James", "interest": 1450, "Location": "Germany" }, { "keyword": "Jonas Salk", "interest": 250, "Location": "Germany" }, { "keyword": "Harry Potter (book series)", "interest": 500, "Location": "Germany" }, { "keyword": "Khabib Nurmagomedov", "interest": 850, "Location": "Germany" }, , { "keyword": "Serena Williams", "interest": 1200, "Location": "Germany" }, { "keyword": "Lewis Hamilton", "interest": 1500, "Location": "Germany" }, { "keyword": "Virat Kohli", "interest": 650, "Location": "Germany" }, ]

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
export const getTrendingKeywords = async (category, location, language, contentIntent) => {
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
    
    // Extract just the keywords from SerpAPI response
    let extractedKeywords = [];
    if (response.related_queries) {
      // Combine rising and top queries
      const risingQueries = response.related_queries.rising || [];
      const topQueries = response.related_queries.top || [];
      
      extractedKeywords = [...risingQueries, ...topQueries].map(item => ({
        keyword: item.query,
        interest: item.extracted_value || parseInt(item.value) || 0,
        Location: geo
      }));
      
      // Sort by highest trend value
      extractedKeywords = extractedKeywords.sort((a, b) => b.interest - a.interest);
    }
    
    console.log('Extracted keywords from SerpAPI:', extractedKeywords);
    
    let keywords = [];
    keywords = await getRelatedQueries(extractedKeywords, language, geo, category, contentIntent);
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

