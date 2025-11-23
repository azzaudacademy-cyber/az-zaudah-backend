import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { enrollSelf, enrollChild, getMyEnrollments } from "../controllers/enrollmentController.js";

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollment operations
 */

/**
 * @swagger
 * /api/enrollments/self:
 *   post:
 *     summary: Student enrolls themselves in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enrolled successfully
 */

/**
 * @swagger
 * /api/enrollments/child:
 *   post:
 *     summary: Parent enrolls one of their children in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               childProfileId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Child enrolled successfully
 */

/**
 * @swagger
 * /api/enrollments/mine:
 *   get:
 *     summary: Student retrieves their own enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled courses
 */

const router = express.Router();

// Student self-enroll
router.post("/self", protect, requireRole("STUDENT"), enrollSelf);

// Parent enroll child
router.post("/child", protect, requireRole("PARENT"), enrollChild);

// Student view enrollments
router.get("/mine", protect, requireRole("STUDENT"), getMyEnrollments);

export default router;