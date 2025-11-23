import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  createTeacher,
  getAllCoursesAdmin,
  getAllEnrollments,
} from "../controllers/adminController.js";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative operations (users, teachers, courses, enrollments)
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Admin gets all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users returned
 */

/**
 * @swagger
 * /api/admin/create-teacher:
 *   post:
 *     summary: Admin creates a new teacher
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       201:
 *         description: Teacher created
 */

/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     summary: Admin gets all courses
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 */

/**
 * @swagger
 * /api/admin/enrollments:
 *   get:
 *     summary: Admin gets all enrollments
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrollments
 */

const router = express.Router();

// Only admins can access these
router.use(protect, requireRole("ADMIN"));

router.get("/users", getAllUsers);
router.post("/create-teacher", createTeacher);
router.get("/courses", getAllCoursesAdmin);
router.get("/enrollments", getAllEnrollments);

export default router;