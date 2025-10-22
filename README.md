# 💼 Subscription Manager

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)

**A modern, secure subscription tracking platform with beautiful UI and advanced features**

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Security](#-security)

</div>

---

## 📸 Screenshots

<div align="center">

### Landing Page with LiquidEther Background
![Landing Page](https://via.placeholder.com/800x400/5227FF/FFFFFF?text=Landing+Page+with+Animated+Background)

### Dashboard with Subscription Management
![Dashboard](https://via.placeholder.com/800x400/FF9FFC/FFFFFF?text=Dashboard+View)

### OTP Verification System
![OTP Verification](https://via.placeholder.com/800x400/B19EEF/FFFFFF?text=OTP+Verification)

</div>

---

## ✨ Features

### 🎨 **Beautiful UI/UX**
- **LiquidEther WebGL Background** - Interactive fluid simulation with mouse tracking
- **Glass Morphism Design** - Modern translucent cards with backdrop blur
- **ElectricBorder Components** - Animated SVG borders with turbulence effects
- **PillNav Navigation** - Smooth animated navigation with GSAP
- **Dark Mode Support** - Seamless light/dark theme switching
- **Responsive Design** - Optimized for mobile, tablet, and desktop

### 🔐 **Security & Authentication**
- **JWT Cookie Authentication** - Secure HTTP-only cookies (7-day expiration)
- **OTP Email Verification** - 2-factor verification for sensitive operations
- **Password Reset with OTP** - Secure password recovery flow
- **Email Update with OTP** - Verified email change process
- **User Data Isolation** - Complete privacy per user account
- **bcrypt Password Hashing** - Industry-standard password encryption

### 📊 **Subscription Management**
- **CRUD Operations** - Create, Read, Update, Delete subscriptions
- **Category Organization** - Organize by Entertainment, Productivity, etc.
- **Billing Cycle Tracking** - Weekly, Monthly, Yearly cycles
- **Next Billing Date** - Automatic calculation and reminders
- **Search & Filter** - Quick search by name or category
- **Price Tracking** - Monitor total subscription costs
- **Active/Inactive Status** - Toggle subscription status

### 👤 **Account Management**
- **User Registration** - Simple signup with username, email, password
- **Settings Page** - Comprehensive account management
- **Password Reset** - OTP-verified password changes
- **Email Update** - OTP-verified email changes with logout
- **Account Deletion** - Complete data removal with confirmation

### 📧 **Email System**
- **Nodemailer Integration** - Professional email delivery
- **Gmail SMTP Support** - Easy Gmail configuration
- **HTML Email Templates** - Branded, responsive email design
- **OTP Code Delivery** - 6-digit codes with 10-minute expiration
- **Ethereal Testing** - Development email testing support

---

## 🛠️ Tech Stack

### Frontend
- **React 19.0.0** - Latest React with modern hooks
- **Vite 5.4.20** - Lightning-fast development server
- **Redux Toolkit** - State management with RTK Query
- **React Router v7.9.4** - Client-side routing
- **Tailwind CSS 3.4.4** - Utility-first CSS framework
- **GSAP** - Professional animation library
- **Three.js** - WebGL 3D graphics for LiquidEther
- **@headlessui/react** - Accessible UI components
- **react-toastify** - Beautiful notifications
- **react-hook-form** - Performant form handling

### Backend
- **Node.js & Express.js** - RESTful API server
- **MongoDB & Mongoose** - NoSQL database with ODM
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie handling middleware
- **nodemailer** - Email sending functionality
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart development server
- **PostCSS** - CSS processing

---

## 📦 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/KathiravanGopi/Subscription-Manager.git
cd Subscription-Manager
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure `.env` file:**
```env
# Database
MONGO_URI=mongodb://localhost:27017/subscription_management
PORT=8080

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM="Subscription Manager <your-email@gmail.com>"
```

**Generate Gmail App Password:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create password for "Subscription Manager"
5. Copy 16-character password to `EMAIL_PASS`

```bash
# Start backend server
npm start
# Backend runs on http://localhost:8080
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Open Application
Visit `http://localhost:5173` in your browser

---

## 🚀 Usage

### User Registration
1. Click "Sign Up" on the landing page
2. Enter username, email, and password
3. Accept terms and conditions
4. Auto-login after successful registration

### Adding Subscriptions
1. Navigate to "Add Subscription"
2. Fill in subscription details:
   - Name (e.g., "Netflix")
   - Category (e.g., "Entertainment")
   - Price
   - Billing cycle (Weekly/Monthly/Yearly)
   - Start date
   - Notes (optional)
3. Click "Add Subscription"

### Managing Subscriptions
- **View All**: Dashboard shows all active subscriptions
- **Search**: Use search bar to filter by name
- **Edit**: Click edit icon to modify details
- **Delete**: Click delete icon to remove
- **Toggle Status**: Activate/deactivate subscriptions

### Settings & Security

#### Password Reset (OTP Flow)
1. Go to Settings → Reset Password
2. Enter current password → Click "Send OTP"
3. Check email for 6-digit code
4. Enter OTP and new password → Click "Reset Password"

#### Email Update (OTP Flow)
1. Go to Settings → Reset Email
2. Enter new email → Click "Send OTP"
3. Check **current email** for 6-digit code
4. Enter OTP → Click "Verify & Update Email"
5. Auto-logout → Login with new email

#### Account Deletion
1. Go to Settings → Delete Account
2. Type "DELETE" to confirm
3. All subscriptions and user data permanently removed

---

## 🔒 Security

### Implemented Security Features

✅ **Authentication**
- JWT tokens stored in HTTP-only cookies
- 7-day token expiration
- Secure cookie flags in production
- SameSite cookie policy

✅ **Password Security**
- bcrypt hashing (10 salt rounds)
- Minimum 6 characters
- Cannot reuse current password

✅ **OTP Verification**
- 6-digit random codes
- 10-minute expiration (MongoDB TTL)
- Email delivery via nodemailer
- One active OTP per user per type

✅ **Data Isolation**
- User-specific subscription filtering
- userId validation on all CRUD operations
- Cannot access other users' data

✅ **API Protection**
- Authentication middleware on protected routes
- Input validation
- Error handling
- CORS configuration

### Best Practices
- Never commit `.env` files
- Use strong JWT secrets in production
- Enable HTTPS in production
- Regular dependency updates
- Rate limiting recommended for production

---

## 📁 Project Structure

```
Subscription-Manager/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Auth & OTP logic
│   │   └── subscriptionController.js # CRUD operations
│   ├── middlewares/
│   │   └── auth.js                 # JWT verification
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Subscription.js         # Subscription schema
│   │   └── OTP.js                  # OTP schema with TTL
│   ├── routes/
│   │   ├── auth.js                 # Auth routes
│   │   └── subscriptions.js        # Subscription routes
│   ├── utils/
│   │   └── emailService.js         # Nodemailer config
│   ├── app.js                      # Express server
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Dashboard.jsx       # Subscription list
│   │   │   ├── FormContainer.jsx   # Add subscription
│   │   │   ├── Settings.jsx        # Account settings
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Signup.jsx         # Registration
│   │   │   ├── Homepage.jsx       # Landing page
│   │   │   ├── Navbar.jsx         # Navigation with LiquidEther
│   │   │   ├── OtpInput.jsx       # OTP input component
│   │   │   ├── LiquidEther.jsx    # WebGL background
│   │   │   └── ElectricBorder.jsx # Animated borders
│   │   ├── redux/
│   │   │   ├── store.js           # Redux store
│   │   │   ├── authSlice.js       # Auth state
│   │   │   └── subsSlice.js       # Subscription state
│   │   ├── config/
│   │   │   └── apiConfig.js       # API endpoints
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── routes.jsx             # Route definitions
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── README.md
├── SECURITY_FIX.md                 # Security documentation
├── IMPLEMENTATION_SUMMARY.md       # Feature summary
└── OTP_FLOW.md                     # OTP documentation
```

---

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/register                    - User registration
POST   /api/auth/login                       - User login
POST   /api/auth/logout                      - User logout
GET    /api/auth/check                       - Check authentication
DELETE /api/auth/delete-account              - Delete user account
```

### OTP Operations
```
POST   /api/auth/send-password-reset-otp     - Send OTP for password reset
POST   /api/auth/verify-password-reset-otp   - Verify OTP & reset password
POST   /api/auth/send-email-update-otp       - Send OTP for email update
POST   /api/auth/verify-email-update-otp     - Verify OTP & update email
```

### Subscriptions (Protected)
```
GET    /api/subscriptions                    - Get user's subscriptions
POST   /api/subscriptions                    - Create subscription
PUT    /api/subscriptions/:id                - Update subscription
DELETE /api/subscriptions/:id                - Delete subscription
```

---

## 🎯 Features in Development

- [ ] Subscription renewal reminders via email
- [ ] Export subscriptions to CSV/PDF
- [ ] Subscription analytics dashboard
- [ ] Multi-currency support
- [ ] Shared family subscriptions
- [ ] Mobile app (React Native)
- [ ] Browser extension for quick add

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Kathiravan Gopi**

- GitHub: [@KathiravanGopi](https://github.com/KathiravanGopi)
- Email: kathiravangopi12@gmail.com

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Three.js](https://threejs.org/) - WebGL graphics
- [GSAP](https://greensock.com/gsap/) - Animation
- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Backend framework

---

## 📞 Support

If you found this project helpful, please give it a ⭐️!

For issues or questions, please open an [issue](https://github.com/KathiravanGopi/Subscription-Manager/issues).

---

<div align="center">

**Made with ❤️ by Kathiravan Gopi**

</div>
