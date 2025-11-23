import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { getMyChildren, addChild } from "../controllers/parentController.js";

/**
 * @swagger
 * tags:
 *   name: Parents
 *   description: Parent management, child accounts, and child enrollment
 */

/**
 * @swagger
 * /api/parents/children:
 *   get:
 *     summary: Get all children linked to the authenticated parent
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all children for this parent
 */

/**
 * @swagger
 * /api/parents/add-child:
 *   post:
 *     summary: Add a child to the authenticated parent
 *     tags: [Parents]
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
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: Child added successfully
 */

const router = express.Router();

router.get("/children", protect, requireRole("PARENT"), getMyChildren);
router.post("/add-child", protect, requireRole("PARENT"), addChild);

export default router;