import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

// =============================
// TEACHER: My Courses
// =============================
export const getMyCourses = async (req, res) => {
  try {
    const teacherId = req.user.userId;

    const courses = await prisma.course.findMany({
      where: { teacherId },
      include: {
        enrollments: {
          include: { user: true },
        },
      },
    });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// TEACHER: Delete a Course
// =============================
export const deleteMyCourse = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course)
      return res.status(404).json({ message: "Course not found" });

    if (course.teacherId !== teacherId)
      return res
        .status(403)
        .json({ message: "Not allowed to delete this course" });

    await prisma.course.delete({ where: { id: courseId } });

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};