const express = require('express')
const ProductModel = require('../models/Products')
const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ChatBotController = async (req, res) => {
    try {
        const { productId } = req.params;
        const { input } = req.body;

        const userQuestion = input

        if (!userQuestion || userQuestion.trim() === "") {
            return res.status(400).json({
                message: "User question is required",
                success: false
            });
        }

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        const sizes = product.productSizes.map((s) => s.size).join(", ");

        //  systemPrompt for AI behaviour 
        const systemPrompt = `You are a professional customer support assistant for an e-commerce clothing store.

Rules:
- Answer ONLY using the product information provided
- DO NOT guess or assume missing information
- If information is not available, say: 
  "I'm sorry, that information is not available for this product."
- Keep answers short (2–3 sentences)
- Use a polite and friendly tone`;

        const userPrompt = `
            Here are the product details:
            - Name - ${product.productTitle}
            - Price - ${product.productPrice}
            - Category - ${product.productMaterial}
            - AvailableSizes - ${sizes}
            - Description - ${product.productDescription}

                Additional Info:
                - Easy return & exchange within 7 days
                - Cash on delivery available
           Customer Question: ${userQuestion}

           Please answer clearly and helpfully based on the product information above.
            `

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant", // fast + free
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt, },
            ],
            temperature: 0.2, // lower = more factual
            max_tokens: 150,
        });

        const reply = completion.choices[0].message.content;

        res.json({ success: true, reply });


    }
    catch (error) {
        console.error('ChatBotController error', error)
        res.status(500).json({ message: 'ChatBot error', success: false })
    }
}


module.exports = { ChatBotController }