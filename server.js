const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample course data
const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Master HTML, CSS, and JavaScript fundamentals.",
    duration: "8 weeks",
    level: "Beginner",
    instructor: "Sarah Chen",
    image: "🌐",
    students: 12500,
    rating: 4.8,
    price: "₹2,499",
    lessons: [
      { title: "Introduction to HTML and Web Basics", duration: "45 min" },
      { title: "CSS Styling and Layout Techniques", duration: "60 min" },
      { title: "JavaScript Fundamentals and DOM Manipulation", duration: "75 min" },
      { title: "Building Your First Responsive Website", duration: "90 min" },
      { title: "Forms, Validation, and User Input", duration: "55 min" },
      { title: "CSS Grid and Flexbox Mastery", duration: "70 min" },
      { title: "JavaScript ES6+ Features", duration: "65 min" },
      { title: "Project: Build a Portfolio Website", duration: "120 min" }
    ]
  },
  {
    id: 2,
    title: "Digital Marketing Essentials",
    description: "Master SEO, social media, and content marketing strategies.",
    duration: "6 weeks",
    level: "Intermediate",
    instructor: "Michael Torres",
    image: "📱",
    students: 8900,
    rating: 4.7,
    price: "₹3,499",
    lessons: [
      { title: "Understanding Your Target Audience", duration: "50 min" },
      { title: "SEO Fundamentals and Keyword Research", duration: "65 min" },
      { title: "Social Media Marketing Strategies", duration: "70 min" },
      { title: "Content Creation and Content Marketing", duration: "75 min" },
      { title: "Email Marketing Campaigns", duration: "60 min" },
      { title: "Analytics, Measurement, and ROI", duration: "55 min" },
      { title: "Paid Advertising: Google Ads & Facebook Ads", duration: "80 min" },
      { title: "Project: Create a Complete Marketing Campaign", duration: "100 min" }
    ]
  },
  {
    id: 3,
    title: "Data Science for Beginners",
    description: "Learn data analysis and visualization with Python.",
    duration: "10 weeks",
    level: "Beginner",
    instructor: "Dr. Emily Watson",
    image: "📊",
    students: 15200,
    rating: 4.9,
    price: "₹4,999",
    lessons: [
      { title: "Introduction to Data Science and Analytics", duration: "40 min" },
      { title: "Python Basics for Data Analysis", duration: "80 min" },
      { title: "Working with Pandas and DataFrames", duration: "75 min" },
      { title: "Data Cleaning and Preprocessing", duration: "70 min" },
      { title: "Exploratory Data Analysis (EDA)", duration: "65 min" },
      { title: "Data Visualization with Matplotlib and Seaborn", duration: "60 min" },
      { title: "Statistical Analysis and Hypothesis Testing", duration: "85 min" },
      { title: "Introduction to Machine Learning", duration: "90 min" },
      { title: "Project: Analyze a Real-World Dataset", duration: "120 min" }
    ]
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    description: "Master design thinking, prototyping, and user experience.",
    duration: "7 weeks",
    level: "Intermediate",
    instructor: "James Park",
    image: "🎨",
    students: 11200,
    rating: 4.8,
    price: "₹3,999",
    lessons: [
      { title: "Design Thinking Process and Methodology", duration: "55 min" },
      { title: "User Research Methods and Personas", duration: "65 min" },
      { title: "Information Architecture and User Flows", duration: "70 min" },
      { title: "Wireframing and Low-Fidelity Prototyping", duration: "75 min" },
      { title: "Visual Design Principles and Typography", duration: "60 min" },
      { title: "High-Fidelity Prototyping with Figma", duration: "80 min" },
      { title: "Design Systems and Component Libraries", duration: "60 min" },
      { title: "Usability Testing and Iteration", duration: "65 min" },
      { title: "Project: Design a Complete Mobile App", duration: "110 min" }
    ]
  },
  {
    id: 5,
    title: "Mobile App Development",
    description: "Build native and cross-platform mobile applications using modern frameworks. Learn React Native, state management, API integration, and app deployment to create production-ready mobile apps.",
    duration: "9 weeks",
    level: "Advanced",
    instructor: "Alex Rivera",
    image: "📱",
    students: 9800,
    rating: 4.7,
    price: "₹2499",
    lessons: [
      { title: "Mobile Development Overview and Architecture", duration: "45 min" },
      { title: "React Native Setup and Fundamentals", duration: "85 min" },
      { title: "Components, Styling, and Navigation", duration: "75 min" },
      { title: "State Management with Redux", duration: "70 min" },
      { title: "API Integration and Data Fetching", duration: "65 min" },
      { title: "Authentication and User Management", duration: "60 min" },
      { title: "Push Notifications and Offline Support", duration: "55 min" },
      { title: "Testing and Debugging Mobile Apps", duration: "70 min" },
      { title: "Publishing to App Stores (iOS & Android)", duration: "60 min" },
      { title: "Project: Build a Complete Mobile App", duration: "130 min" }
    ]
  },
  {
    id: 6,
    title: "Cloud Computing Basics",
    description: "Understand cloud infrastructure and deploy scalable applications to the cloud. Master AWS services, containerization with Docker, Kubernetes, and CI/CD pipelines for modern DevOps practices.",
    duration: "8 weeks",
    level: "Intermediate",
    instructor: "Priya Sharma",
    image: "☁️",
    students: 13400,
    rating: 4.9,
    price: "₹2299",
    lessons: [
      { title: "Cloud Computing Concepts and Models", duration: "50 min" },
      { title: "AWS Fundamentals: EC2, S3, and IAM", duration: "80 min" },
      { title: "Networking and Security in the Cloud", duration: "70 min" },
      { title: "Containerization with Docker", duration: "75 min" },
      { title: "Orchestration with Kubernetes", duration: "85 min" },
      { title: "CI/CD Pipelines with Jenkins and GitHub Actions", duration: "65 min" },
      { title: "Serverless Computing with AWS Lambda", duration: "60 min" },
      { title: "Monitoring, Logging, and Cost Optimization", duration: "55 min" },
      { title: "Project: Deploy a Scalable Web Application", duration: "115 min" }
    ]
  },
  {
    id: 7,
    title: "Full Stack JavaScript Development",
    description: "Master both frontend and backend development with JavaScript. Build complete web applications using Node.js, Express, React, and MongoDB.",
    duration: "12 weeks",
    level: "Intermediate",
    instructor: "David Kim",
    image: "⚡",
    students: 16800,
    rating: 4.8,
    price: "₹2999",
    lessons: [
      { title: "Modern JavaScript (ES6+)", duration: "90 min" },
      { title: "Node.js and Express Backend", duration: "100 min" },
      { title: "RESTful API Design and Development", duration: "85 min" },
      { title: "MongoDB and Database Design", duration: "75 min" },
      { title: "React Fundamentals and Hooks", duration: "95 min" },
      { title: "State Management and Context API", duration: "80 min" },
      { title: "Authentication and Authorization", duration: "70 min" },
      { title: "Deployment and DevOps", duration: "65 min" },
      { title: "Project: Build a Full Stack Application", duration: "150 min" }
    ]
  },
  {
    id: 8,
    title: "Cybersecurity Fundamentals",
    description: "Learn essential cybersecurity skills to protect systems and data. Cover threat detection, network security, encryption, and ethical hacking basics.",
    duration: "10 weeks",
    level: "Intermediate",
    instructor: "Robert Martinez",
    image: "🔒",
    students: 10200,
    rating: 4.7,
    price: "₹2799",
    lessons: [
      { title: "Introduction to Cybersecurity", duration: "55 min" },
      { title: "Network Security and Protocols", duration: "75 min" },
      { title: "Cryptography and Encryption", duration: "70 min" },
      { title: "Threat Detection and Analysis", duration: "65 min" },
      { title: "Vulnerability Assessment", duration: "80 min" },
      { title: "Security Best Practices", duration: "60 min" },
      { title: "Incident Response and Recovery", duration: "70 min" },
      { title: "Project: Security Audit and Report", duration: "120 min" }
    ]
  }
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/course/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'course.html'));
});

// Also support query parameter style
app.get('/course', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'course.html'));
});

app.get('/courses', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'courses.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});

app.get('/help', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'help.html'));
});

app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blog.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// API Routes
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

// Payment and Checkout Routes
app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

app.get('/certificate', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'certificate.html'));
});

// Payment processing endpoint
app.post('/api/process-payment', (req, res) => {
  const { courseId, amount, email, paymentMethod } = req.body;
  
  // Validate payment data
  if (!courseId || !amount || !email) {
    return res.status(400).json({ error: 'Missing required payment information' });
  }
  
  // Log payment request (in production, integrate with Stripe/PayPal)
  console.log(`Payment request - Course: ${courseId}, Amount: $${amount}, Email: ${email}`);
  
  // Simulate payment processing
  const paymentId = `CERT-${Date.now()}`;
  const certId = `ICTRD-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  
  // Return success response with certificate details
  res.json({
    success: true,
    paymentId: paymentId,
    certificateId: certId,
    message: 'Payment processed successfully. Your certification is ready.',
    redirectUrl: `/certificate?id=${certId}`
  });
});

// Certificate generation endpoint
app.get('/api/certificate/:id', (req, res) => {
  const { id } = req.params;
  
  // Return certificate data
  res.json({
    certificateId: id,
    issuedDate: new Date().toLocaleDateString(),
    status: 'verified',
    downloadUrl: `/download-certificate/${id}`
  });
});

// Certificate download endpoint
app.get('/download-certificate/:id', (req, res) => {
  // In production, generate PDF certificate using libraries like pdfkit
  res.send(`Certificate ${req.params.id} would be downloaded as PDF`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Fast-Track Certification Platform Ready`);
});
