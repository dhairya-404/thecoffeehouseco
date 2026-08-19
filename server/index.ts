import express from 'express';
import cors from 'cors';
import { reservationRouter } from './routes/reservations.js';
import { newsletterRouter } from './routes/newsletter.js';
import { menuRouter } from './routes/menu.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
app.use(express.json());

// API Routes
app.use('/api/reservations', reservationRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/menu', menuRouter);

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'The Coffee House Co. API Server',
    timestamp: new Date().toISOString(),
  });
});

// Root route for backend server
app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>The Coffee House Co. — API Server</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #F5F3EE;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 1.5rem;
          box-sizing: border-box;
        }
        .card {
          background: #FFFFFF;
          border: 1px solid rgba(17,17,17,0.12);
          max-width: 540px;
          width: 100%;
          padding: 2.5rem;
        }
        h1 {
          font-size: 1.5rem;
          margin-top: 0;
          letter-spacing: -0.02em;
        }
        .tag {
          font-family: monospace;
          font-size: 0.75rem;
          color: #B85C38;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        p {
          color: #555555;
          line-height: 1.6;
        }
        .btn {
          display: inline-block;
          background: #111111;
          color: #F5F3EE;
          text-decoration: none;
          padding: 0.75rem 1.25rem;
          font-family: monospace;
          font-size: 0.8rem;
          margin-top: 1rem;
        }
        .api-links {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(17,17,17,0.08);
          font-family: monospace;
          font-size: 0.8rem;
        }
        .api-links a {
          color: #B85C38;
          text-decoration: none;
          display: block;
          margin-top: 0.35rem;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="tag">BACKEND API SERVER // ONLINE</span>
        <h1>THE COFFEE HOUSE CO.</h1>
        <p>This is the backend API service (Port 3001). To browse the full interactive frontend website, visit the client application on port 5173.</p>
        <a href="http://localhost:5173/" class="btn">OPEN WEBSITE (PORT 5173) →</a>
        
        <div class="api-links">
          <strong>AVAILABLE API ENDPOINTS:</strong>
          <a href="/api/health">• /api/health (Server Status)</a>
          <a href="/api/reservations">• /api/reservations (Table Bookings)</a>
          <a href="/api/menu">• /api/menu (Menu & Categories)</a>
          <a href="/api/newsletter">• /api/newsletter (Subscribers)</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`☕ The Coffee House Co. Backend API running at http://localhost:${PORT}`);
});

export default app;
