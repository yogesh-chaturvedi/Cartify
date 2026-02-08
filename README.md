# 🛒 Cartify

**🛒 Cartify – Full-Stack E-Commerce Platform with AI-Powered Chatbot** is a production-ready full-stack MERN e-commerce platform featuring secure authentication, role-based access control, Stripe payments, an admin dashboard, and an AI-powered customer support chatbot built using the Groq API. The platform is designed with scalability, security, and real-world business workflows in mind.


## 🌐 Live Demo

👉 [Visit ShopNest Live](https://cartify-ten-eta.vercel.app/)

---

## ✨ Features

### 👤 User Features

- User authentication with JWT stored in HTTP-only cookies

- Browse products with search, filtering, sorting, and pagination

- Add products to cart and place orders

- Secure online payments using Stripe Checkout

- Track order status and view complete order history

- View and update profile information

- Upload and update profile image


### 🧑‍💼 Admin Features

- Secure Admin Dashboard with Role-Based Access Control (RBAC)

Add, edit, and delete products

- Manage users (remove users)

- View all orders and update order statuses

- Maintain complete order history

- Dynamic website settings management:

    - Website name

    - Business address & contact details

    - Enable/disable Cash on Delivery (COD)

    - Set minimum order value

- Search, filter, sort, and paginate products, users, and orders
---

## 🤖 AI Customer Support Chatbot
- Integrated AI-powered chatbot using the Groq API

- Responds only to product-related queries

- Uses dynamic application context to generate accurate responses

- Prevents irrelevant or non-product-related answers
 
---

## 💳 Payments
- Stripe Checkout integration for secure online payments

- Stripe webhooks for payment verification

- Payment success and failure handling

---
## 🚀 Tech Stack

**Frontend**  
- React.js
- Context API
- Tailwind CSS
- React Router DOM
- Lucide React

**Backend**  
- Node.js
- Express.js
- JWT Authentication
- Joi Validation
- Multer
  
**Database**
- MongoDB Atlas
- Mongoose

**Third-Party Services**
- Stripe API & Webhooks
- Groq API (AI Chatbot)
- Cloudinary (Image Storage)
- Web3Forms (Contact Form)

**Security**
- Helmet
- Express Rate Limiter
- CORS

**Deployment**
- Frontend: Vercel
- Backend: Render

**AI Integration**  
- Google Generative AI (Gemini API)
---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yogesh-chaturvedi/Cartify
cd cartify
```

### 2️⃣ Environment Variables
Create a .env file in the backend directory and add:
```bash
cd backend
npm install

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_api_key

npm run dev
```
### 3. Setup Frontend
Create a .env file in the frontend directory

```bash
cd frontend
npm install

VITE_API_URL=http://localhost:3000 

npm run dev
```
---
## 👤 Author
- Name: Yogesh Chaturvedi
- GitHub: [@yogesh-chaturvedi](https://github.com/yogesh-chaturvedi)