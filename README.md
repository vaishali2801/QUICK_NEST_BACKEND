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
```
SCREENSHOT
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 29 08 AM" src="https://github.com/user-attachments/assets/1d963947-ded6-41d5-a699-82f0e96d69cc" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 26 51 AM" src="https://github.com/user-attachments/assets/fefa5ee9-004f-4700-b3ab-96a95003ab2e" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 25 11 AM" src="https://github.com/user-attachments/assets/39873888-ab9b-4704-9b6a-090123ef9bc6" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 20 56 AM" src="https://github.com/user-attachments/assets/c8c4987f-4d8e-4286-9dcc-6fbc51555e0a" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 08 29 AM" src="https://github.com/user-attachments/assets/bc938bd3-d47a-4f52-9c4b-3912e3c71d05" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 10 56 AM" src="https://github.com/user-attachments/assets/6032a5c4-b5c8-4c3d-ad62-c8fd681b588c" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 11 27 AM" src="https://github.com/user-attachments/assets/d08b6443-1379-492e-a721-b51b581b021b" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 12 44 AM" src="https://github.com/user-attachments/assets/43d96c32-9351-4e88-bbe2-b1ad2cd6fbe4" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 13 35 AM" src="https://github.com/user-attachments/assets/7d604851-38f0-44e9-8d99-86decd1f8c9a" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 14 15 AM" src="https://github.com/user-attachments/assets/b82719fd-8a7e-417a-9473-ac78a0e5b81a" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 07 49 AM" src="https://github.com/user-attachments/assets/2186496b-b5eb-4721-92fe-c19bbd2b7196" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 06 45 AM" src="https://github.com/user-attachments/assets/c06e766f-ac64-4c8e-8593-6518022d6958" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 05 58 AM" src="https://github.com/user-attachments/assets/ceb56d49-136e-4d32-9bea-9b3b0b6837a0" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 05 23 AM" src="https://github.com/user-attachments/assets/0f94bb49-0124-49d6-84f3-383c2534278c" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 02 31 AM" src="https://github.com/user-attachments/assets/01e28e7d-1f2c-4dbb-8886-44822cacb076" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 10 01 12 AM" src="https://github.com/user-attachments/assets/f60fd17a-bda5-48e8-947f-cb150130f0ac" />
<img width="1280" height="832" alt="Screenshot 2026-05-12 at 4 25 54 PM" src="https://github.com/user-attachments/assets/8ce937ae-66f1-448b-856d-63c03383c0f9" />
<img width="1280" height="832" alt="Screenshot 2026-05-12 at 4 26 34 PM" src="https://github.com/user-attachments/assets/0df51e18-e782-4a71-8a12-68f6577a27ae" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 9 40 20 AM" src="https://github.com/user-attachments/assets/f364a043-f7a1-432f-baae-94fdaecf8943" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 9 56 26 AM" src="https://github.com/user-attachments/assets/66f7f436-68d1-400a-8283-dbc3acf7366a" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 9 58 31 AM" src="https://github.com/user-attachments/assets/df76026b-a4ce-49e4-b5b1-a1becc5ff33f" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 9 59 33 AM" src="https://github.com/user-attachments/assets/25031beb-d127-4535-a444-2d3cf3f52149" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 9 42 52 AM" src="https://github.com/user-attachments/assets/b6e0dbad-f335-4e43-b360-4a979669d47f" />
<img width="1280" height="832" alt="Screenshot 2026-05-12 at 4 27 55 PM" src="https://github.com/user-attachments/assets/5b2215e2-feda-474c-a56d-fd0f187736df" />
<img width="1280" height="832" alt="Screenshot 2026-05-12 at 4 27 27 PM" src="https://github.com/user-attachments/assets/883d1c98-d481-44e3-9b76-99cb029aa9cc" />
<img width="1280" height="832" alt="Screenshot 2026-05-12 at 4 26 56 PM" src="https://github.com/user-attachments/assets/c41e0377-651d-4f89-aa26-2615d06bb94c" />
<img width="1280" height="832" alt="Screenshot 2026-05-12 at 4 22 57 PM" src="https://github.com/user-attachments/assets/df13c663-4ba6-4566-a1dd-a031cb0b7947" />
<img width="1280" height="832" alt="Screenshot 2026-05-13 at 9 47 06 AM" src="https://github.com/user-attachments/assets/822a4904-59f1-437e-8da5-9af058607eac" />


👩‍💻 Author

Vaishali Chauhan
GitHub: vaishali2801
LinkedIn: Vaishali Chauhan
