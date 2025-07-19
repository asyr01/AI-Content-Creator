// Middleware to prevent jailbreak attempts and malicious prompts
const jailbreakPatterns = [
  // API/Credential extraction attempts
  /api\s*key/i,
  /secret\s*key/i,
  /password/i,
  /token/i,
  /credential/i,
  /database/i,
  /config/i,
  /environment/i,
  /\.env/i,
  
  // Instruction override attempts
  /ignore\s*(all\s*)?(previous\s*)?(instructions?|prompts?|rules?)/i,
  /forget\s*(everything|all|previous)/i,
  /override\s*(instructions?|system|rules?)/i,
  /disregard\s*(previous|all|instructions?)/i,
  /new\s*(instructions?|rules?|system)/i,
  /system\s*(prompt|override|hack)/i,
  /jailbreak/i,
  /prompt\s*injection/i,
  
  // Role playing attempts to break context
  /you\s*are\s*now/i,
  /pretend\s*to\s*be/i,
  /act\s*as\s*if/i,
  /roleplay/i,
  /simulate/i,
  
  // Attempts to access system information
  /show\s*me\s*(the\s*)?(system|source|code)/i,
  /what\s*(is\s*)?(your\s*)?(system|prompt|instructions?)/i,
  /how\s*(were\s*)?(you\s*)?(trained|programmed|created)/i,
  /reveal\s*(your|the)\s*(prompt|system|instructions?)/i,
  
  // Off-topic content requests (only very obvious ones)
  /cookie\s*recipe/i,
  /how\s*to\s*cook/i,
  /weather\s*forecast/i,
  /tell\s*me\s*a\s*joke/i,
  
  // Malicious intent
  /hack/i,
  /exploit/i,
  /vulnerability/i,
  /bypass/i,
  /circumvent/i,
  
  // Attempts to make AI say inappropriate things
  /say\s*something\s*(bad|inappropriate|offensive)/i,
  /generate\s*(illegal|harmful|dangerous)/i,
];

const checkForJailbreak = (text) => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  // Check for jailbreak patterns
  for (const pattern of jailbreakPatterns) {
    if (pattern.test(text)) {
      console.log(`Jailbreak attempt detected: Pattern "${pattern}" matched`);
      return true;
    }
  }
  
  // Check if text is very long (potential prompt injection)
  if (text.length > 5000) {
    console.log('Jailbreak attempt detected: Text too long');
    return true;
  }
  
  return false;
};

const jailbreakPrevention = (req, res, next) => {
  try {
    // List of fields to check based on the route
    const fieldsToCheck = [];
    
    // Content drafting fields
    if (req.body.title) fieldsToCheck.push('title');
    if (req.body.contentIntent) fieldsToCheck.push('contentIntent');
    if (req.body.baseContent) fieldsToCheck.push('baseContent');
    if (req.body.originalContent) fieldsToCheck.push('originalContent');
    
    // Chat/message fields
    if (req.body.message) fieldsToCheck.push('message');
    
    // Check each relevant field
    for (const field of fieldsToCheck) {
      const content = req.body[field];
      if (content && checkForJailbreak(content)) {
        console.log(`Jailbreak attempt blocked on field: ${field}`);
        console.log(`Content: ${content.substring(0, 200)}...`);
        
        return res.status(400).json({
          error: 'Request blocked',
          message: 'Middleware blocked your attempt. Please provide appropriate content related to marketing, content creation, or image generation.'
        });
      }
    }
    
    // Log successful validation for monitoring
    if (fieldsToCheck.length > 0) {
      console.log(`Jailbreak prevention passed for fields: ${fieldsToCheck.join(', ')}`);
    }
    
    next();
  } catch (error) {
    console.error('Error in jailbreak prevention middleware:', error);
    // Don't block request if middleware fails, but log the error
    next();
  }
};

export default jailbreakPrevention;