🏠 QuickNest Backend

Backend API for QuickNest — a service booking platform where users can book home services like cleaning, plumbing, electrician work, appliance repair, and more.
Service providers can register, create service categories, and manage their offered services.

Built using Node.js, Express.js, and MongoDB.
```
🚀 Features
👤 User Features
User Registration & Login
JWT Authentication
Browse Available Services
Book Services
View Booking History
Secure Password Hashing

🛠️ Service Provider Features
Provider Registration & Login
Add & Manage Services
Create Different Service Categories
Update Service Details
Manage Bookings

📂 Admin/Management Features
Category Management
User & Provider Management
Booking Management
Revenue Calculation APIs

🧰 Tech Stack
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT
Password Hashing: bcrypt
Environment Variables: dotenv
Database ODM: Mongoose
API Testing: Postman

📁 Project Structure
QUICK_NEST_BACKEND/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── db/
├── utils/
├── uploads/
├── .env
├── server.js
├── package.json
└── README.md

⚙️ Installation

1️⃣ Clone Repository
git clone https://github.com/vaishali2801/QUICK_NEST_BACKEND.git

2️⃣ Move to Project Folder
cd QUICK_NEST_BACKEND

3️⃣ Install Dependencies
npm install

4️⃣ Setup Environment Variables

Create a .env file in root directory.

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

▶️ Run Project
Development Mode
npm run dev
Production Mode
npm start

🔐 Authentication

QuickNest uses JWT Authentication for secure access.

Protected Routes Require:
Authorization: Bearer your_token

📌 Main APIs
👤 User Routes
Method	Endpoint	Description
POST	/api/users/register	Register User
POST	/api/users/login	Login User
GET	/api/users/profile	Get User Profile

🛠️ Provider Routes
Method	Endpoint	Description
POST	/api/providers/register	Register Provider
POST	/api/providers/login	Login Provider
POST	/api/providers/service	Add Service
PUT	/api/providers/service/:id	Update Service

📂 Category Routes
Method	Endpoint	Description
POST	/api/category/create	Create Category
GET	/api/category	Get All Categories

📅 Booking Routes
Method	Endpoint	Description
POST	/api/bookings/create	Book Service
GET	/api/bookings	Get All Bookings
GET	/api/bookings/user/:id	User Booking History

🗄️ Database Models
User Model
Provider Model
Service Model
Category Model
Booking Model

🔒 Security Features
Password Hashing with bcrypt
JWT Token Authentication
Protected Routes Middleware
Environment Variable Protection

📸 Future Improvements
Online Payment Integration
Real-time Booking Updates
Service Ratings & Reviews
Provider Verification
Location-based Services
Notification System

👩‍💻 Author

Vaishali Chauhan
GitHub: vaishali2801
LinkedIn: Vaishali Chauhan
