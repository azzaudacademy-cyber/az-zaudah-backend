import express from "express";
import { registerStudent, registerParent, login } from "../controllers/authController.js";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user access control
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (student/parent)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user and return JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login, returns token
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the logged-in user info
 */

const router = express.Router();

router.post("/register-student", registerStudent);
router.post("/register-parent", registerParent);
router.post("/login", login);

export default router;
