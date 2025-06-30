# Cloudbyz eSignature Platform

A comprehensive electronic signature platform built during my 2-month industrial internship at **Cloudbyz (Salesforce), Bangalore**. This modern web application provides secure, legally binding digital signature capabilities with enterprise-grade features.

## 🚀 Live Demo

Clone and run locally to experience the full functionality:

```bash
git clone https://github.com/ayushmaninbox/eSign_cloudbyz.git
cd eSign_cloudbyz
npm install
npm run dev
npm run server  # In a separate terminal
```

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Demo Credentials](#demo-credentials)
- [Screenshots](#screenshots)
- [Internship Experience](#internship-experience)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 Authentication & Security
- **Multi-factor Authentication**: Email/password and Google OAuth integration
- **Password Recovery**: Secure password reset with email verification
- **Session Management**: Secure user sessions with automatic logout
- **Terms & Conditions**: Legal compliance with user agreement tracking

### 📄 Document Management
- **PDF Upload & Processing**: Drag-and-drop PDF document upload (up to 25MB)
- **Document Preview**: High-quality PDF viewer with zoom and navigation
- **Multi-page Support**: Handle documents with multiple pages seamlessly
- **Document Status Tracking**: Real-time status updates (Draft, Sent, Completed, Cancelled)

### ✍️ Signature Capabilities
- **Multiple Signature Types**:
  - Hand-drawn signatures with customizable colors
  - Typed signatures with various fonts
  - Image upload for signature files
  - Digital initials with styling options
- **Signature Library**: Save and reuse frequently used signatures
- **Pre-filled Text Fields**: Custom text with formatting options
- **Field Positioning**: Drag-and-drop signature field placement

### 👥 Multi-party Signing
- **Recipient Management**: Add multiple signers with email notifications
- **Signing Order Control**: Sequential or parallel signing workflows
- **Role-based Access**: Different permissions for authors vs. signers
- **Progress Tracking**: Real-time visibility into signing progress

### 🔔 Notifications & Tracking
- **Real-time Notifications**: Instant updates on document status changes
- **Email Alerts**: Automated email notifications for pending signatures
- **Audit Trail**: Complete history of document actions and timestamps
- **Dashboard Analytics**: Comprehensive overview of document statistics

### 📱 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean, modern UI with smooth animations
- **Accessibility**: WCAG compliant design with keyboard navigation
- **Dark/Light Mode**: Adaptive interface themes

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons
- **FontAwesome** - Additional icon library
- **Date-fns** - Modern date utility library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing middleware
- **File System API** - Local file storage and management

### Development Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript development
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic CSS vendor prefixing

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushmaninbox/eSign_cloudbyz.git
   cd eSign_cloudbyz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Start the backend server** (in a separate terminal)
   ```bash
   npm run server
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 📖 Usage

### Getting Started

1. **Sign Up/Sign In**
   - Create a new account or use demo credentials
   - Verify email and accept terms & conditions

2. **Upload Documents**
   - Drag and drop PDF files or browse to upload
   - Preview documents before sending for signature

3. **Add Recipients**
   - Select signers from the user directory
   - Configure signing order if needed
   - Add custom comments for signers

4. **Place Signature Fields**
   - Use the signature setup tool to place fields
   - Add signatures, initials, text fields, and pre-filled content
   - Assign fields to specific signers

5. **Send for Signature**
   - Review document setup
   - Send email notifications to signers
   - Track progress in real-time

6. **Sign Documents**
   - Receive email notifications
   - Access documents through secure links
   - Complete signatures with authentication

### Demo Credentials

For testing purposes, use these demo accounts:

**Account 1:**
- Email: `john.doe@cloudbyz.com`
- Password: `password`

**Account 2:**
- Email: `lisa.chen@cloudbyz.com`
- Password: `password`

## 📁 Project Structure

```
eSign_cloudbyz/
├── public/                     # Static assets
│   ├── images/                # Application images and icons
│   └── vite.svg              # Vite logo
├── src/                       # Source code
│   ├── components/           # React components
│   │   ├── Auth/            # Authentication components
│   │   ├── Dashboard/       # Dashboard and management
│   │   ├── LandingPage/     # Landing page components
│   │   ├── Navbar/          # Navigation components
│   │   ├── RecipientSelection/ # Recipient management
│   │   ├── Signature/       # Signature-related components
│   │   └── ui/              # Reusable UI components
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── data/                     # JSON data files
│   ├── app-data.json        # Application configuration
│   ├── docu-data.json       # Document data
│   ├── events.json          # Audit trail events
│   ├── images.json          # Image references
│   └── notifications.json   # Notification data
├── PDF_Images/              # Sample PDF page images
├── server.js                # Express.js backend server
├── package.json             # Project dependencies
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts           # Vite configuration
└── README.md                # Project documentation
```

## 🔌 API Documentation

### Authentication Endpoints
- `GET /api/stats` - Get user statistics
- `POST /api/notifications/mark-seen` - Mark notification as read

### Document Management
- `GET /api/documents` - Get user documents
- `GET /api/documents/all` - Get all accessible documents
- `POST /api/documents/:id/cancel` - Cancel document
- `DELETE /api/documents/:id` - Delete document

### Data Management
- `GET /api/data` - Get application data (users, reasons)
- `POST /api/reasons` - Add custom signature reason
- `DELETE /api/reasons/:reason` - Delete custom reason

### Media & Events
- `GET /api/images` - Get document page images
- `GET /api/events` - Get audit trail events

## 🎯 Key Features Implemented

### During My Internship

1. **Complete Authentication System**
   - Implemented secure login/signup with validation
   - Added password recovery functionality
   - Integrated Google OAuth for social login

2. **Document Upload & Processing**
   - Built drag-and-drop file upload interface
   - Implemented PDF preview with canvas rendering
   - Added file validation and size limits

3. **Signature Workflow Engine**
   - Created multi-step signature process
   - Implemented field placement system
   - Built signature creation tools (draw, type, upload)

4. **Real-time Notifications**
   - Developed notification system with real-time updates
   - Implemented email-style notification interface
   - Added notification persistence and management

5. **Responsive Design System**
   - Built mobile-first responsive layouts
   - Implemented consistent design language
   - Added smooth animations and micro-interactions

## 🏢 Internship Experience

This project was developed during my **2-month industrial internship at Cloudbyz (Salesforce), Bangalore** from [Duration]. The internship provided invaluable experience in:

### Technical Skills Gained
- **Enterprise-level React Development**: Working with complex state management and component architecture
- **API Design & Integration**: Building RESTful APIs and handling real-time data
- **UI/UX Implementation**: Translating design mockups into responsive, accessible interfaces
- **Security Best Practices**: Implementing authentication, authorization, and data protection
- **Performance Optimization**: Code splitting, lazy loading, and bundle optimization

### Professional Development
- **Agile Methodology**: Participating in sprint planning, daily standups, and retrospectives
- **Code Review Process**: Learning from senior developers and maintaining code quality
- **Documentation**: Writing comprehensive technical documentation and user guides
- **Testing & QA**: Implementing testing strategies and debugging complex issues
- **Client Interaction**: Understanding business requirements and translating them into technical solutions

### Mentorship & Learning
- Worked under the guidance of experienced Salesforce developers
- Learned industry best practices for enterprise software development
- Gained insights into Salesforce ecosystem and cloud-based solutions
- Participated in knowledge sharing sessions and technical discussions

## 🤝 Contributing

While this is primarily a showcase of my internship work, I welcome feedback and suggestions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 📄 License

This project was developed during my internship at Cloudbyz (Salesforce) and is shared for educational and portfolio purposes.

## 📞 Contact

**Ayush Kumar**
- LinkedIn: [Your LinkedIn Profile]
- Email: [Your Email]
- GitHub: [@ayushmaninbox](https://github.com/ayushmaninbox)

---

**Developed with ❤️ during my internship at Cloudbyz (Salesforce), Bangalore**

*This project demonstrates enterprise-level web application development skills gained through hands-on experience in a professional software development environment.*