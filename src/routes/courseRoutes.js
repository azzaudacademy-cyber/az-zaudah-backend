import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { createCourse, getAllCourses, getCourse } from "../controllers/courseController.js";

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course creation and catalog
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course (Teacher only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Returns all courses
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */

const router = express.Router();

router.post("/", protect, requireRole("TEACHER"), createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourse);

export default router;
