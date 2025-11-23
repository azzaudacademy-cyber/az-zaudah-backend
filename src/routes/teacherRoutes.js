import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  getMyCourses,
  deleteMyCourse,
} from "../controllers/teacherController.js";

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Teacher course management
 */

/**
 * @swagger
 * /api/teacher/my-courses:
 *   get:
 *     summary: Get all courses created by the authenticated teacher
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of teacher courses
 */

/**
 * @swagger
 * /api/teacher/course/{courseId}:
 *   delete:
 *     summary: Delete a course (Teacher only)
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Course not found
 */

const router = express.Router();

router.get("/my-courses", protect, requireRole("TEACHER"), getMyCourses);
router.delete("/course/:courseId", protect, requireRole("TEACHER"), deleteMyCourse);

export default router;