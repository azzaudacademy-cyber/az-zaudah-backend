import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

// =============================
// TEACHER: CREATE COURSE
// =============================
export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Teacher ID
    const teacherId = req.user.userId;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        teacherId,
      },
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// GET ALL COURSES (Public)
// =============================
export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        teacher: {
          select: { name: true, email: true },
        },
      },
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// GET SINGLE COURSE
// =============================
export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: true,
        enrollments: true,
      },
    });

    if (!course)
      return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
