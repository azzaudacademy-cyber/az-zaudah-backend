import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["https://your-frontend-domain.com"], // Replace with your actual frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Ignore favicon
app.get("/favicon.ico", (req, res) => res.status(204));

// SWAGGER SETUP
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Az-Zaudah Academy API",
      version: "1.0.0",
      description: "API documentation for Az-Zaudah Academy backend",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"], // adjust if your folders differ
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// SWAGGER DOCS
if (process.env.NODE_ENV !== "production") {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);

// HEALTH CHECK
app.get("/", (req, res) => res.json({ message: "Backend is running 🚀" }));

// TEST ROUTE
app.get("/api/test", (req, res) => {
  res.json({ message: "Test route working!" });
});

// ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

// START
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
