import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// =============================
// ADMIN: Get all users
// =============================
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        studentProfile: true,
        parentChildren: true,
      },
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// ADMIN: Create a teacher
// =============================
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const teacher = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "TEACHER",
      },
    });

    res.status(201).json({ message: "Teacher created", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// ADMIN: Get all courses
// =============================
export const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        teacher: true,
        enrollments: true,
      },
    });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// ADMIN: Get all enrollments
// =============================
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        course: true,
        user: true,
      },
    });

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};