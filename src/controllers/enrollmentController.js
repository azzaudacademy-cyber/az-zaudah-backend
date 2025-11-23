import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

// =============================
// STUDENT ENROLL SELF
// =============================
export const enrollSelf = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.body;

    // Prevent double enrollment
    const exists = await prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (exists)
      return res.status(400).json({ message: "Already enrolled" });

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// PARENT ENROLL CHILD
// =============================
export const enrollChild = async (req, res) => {
  try {
    const parentId = req.user.userId;
    const { childProfileId, courseId } = req.body;

    // Validate ownership
    const link = await prisma.parentChild.findFirst({
      where: { parentId, childProfileId },
    });

    if (!link)
      return res
        .status(403)
        .json({ message: "You are not this child's parent" });

    // Convert profile → userId
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { id: childProfileId },
    });

    if (!studentProfile)
      return res.status(404).json({ message: "Child not found" });

    const childUserId = studentProfile.userId;

    // Prevent double enrollment
    const exists = await prisma.enrollment.findFirst({
      where: { userId: childUserId, courseId },
    });

    if (exists)
      return res.status(400).json({ message: "Child already enrolled" });

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: childUserId,
        courseId,
      },
    });

    res.status(201).json({
      message: "Child enrolled successfully",
      enrollment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// GET STUDENT'S ENROLLMENTS
// =============================
export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const records = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
    });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};