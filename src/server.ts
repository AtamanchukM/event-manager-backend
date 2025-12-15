import  express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database";
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import participantRoutes from "./routes/participant.routes";

import './models';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ 
    message: "Event Manager API", 
    status: "running",
    endpoints: {
      auth: "/api/auth",
      events: "/api/events",
      participants: "/api/participants"
    }
  });
});

// API Documentation
app.get("/api", (req, res) => {
  res.json({
    name: "Event Manager API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": {
          description: "Реєстрація нового користувача",
          body: { username: "string", email: "string", password: "string" },
          response: { token: "JWT токен", user: "об'єкт користувача" }
        },
        "POST /api/auth/login": {
          description: "Вхід користувача",
          body: { email: "string", password: "string" },
          response: { token: "JWT токен", user: "об'єкт користувача" }
        }
      },
      events: {
        "GET /api/events": {
          description: "Отримати всі події",
          auth: false
        },
        "GET /api/events/:id": {
          description: "Отримати подію за ID",
          auth: false
        },
        "POST /api/events": {
          description: "Створити нову подію",
          auth: true,
          body: { name: "string", description: "string", date: "ISO date", location: "string", maxParticipants: "number" }
        },
        "PUT /api/events/:id": {
          description: "Оновити подію",
          auth: true
        },
        "DELETE /api/events/:id": {
          description: "Видалити подію",
          auth: true
        }
      },
      participants: {
        "POST /api/events/:id/register": {
          description: "Зареєструватися на подію",
          auth: true
        },
        "GET /api/user/events": {
          description: "Отримати мої події",
          auth: true
        }
      }
    },
    note: "Для auth:true потрібен заголовок: Authorization: Bearer YOUR_TOKEN"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", participantRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync({ alter: true });
    console.log("Database synchronized.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
