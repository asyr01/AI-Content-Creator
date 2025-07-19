import { getGeminiModel } from '../utils/geminiClient.js';
import Conversation from '../models/conversationModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const generateResponse = asyncHandler(async (req, res) => {
  const { message, conversationId, model = 'gemini-1.5-flash' } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  try {
    const geminiModel = getGeminiModel(model);
    const result = await geminiModel.generateContent(message);
    const response = await result.response;
    const text = response.text();

    let conversation;
    
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.user.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Conversation not found');
      }
    } else {
      conversation = new Conversation({
        user: req.user._id,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: [],
        model
      });
    }

    conversation.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: text }
    );

    await conversation.save();

    res.json({
      response: text,
      conversationId: conversation._id,
      model: model,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500);
    throw new Error('Failed to generate response from Gemini AI');
  }
});

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ user: req.user._id })
    .select('title createdAt updatedAt model')
    .sort({ updatedAt: -1 });

  res.json(conversations);
});

export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation || conversation.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  res.json(conversation);
});

export const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation || conversation.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  await Conversation.deleteOne({ _id: conversation._id });
  res.json({ message: 'Conversation deleted successfully' });
});