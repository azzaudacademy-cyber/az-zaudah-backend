import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

// =============================
// GET ALL CHILDREN OF A PARENT
// =============================
export const getMyChildren = async (req, res) => {
  try {
    const parentId = req.user.userId;

    const children = await prisma.parentChild.findMany({
      where: { parentId },
      include: {
        child: {
          include: {
            user: true,
          },
        },
      },
    });

    res.json(children);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// ADD CHILD (After Registration)
// =============================
export const addChild = async (req, res) => {
  try {
    const parentId = req.user.userId;
    const { name, age, gender } = req.body;

    const childUser = await prisma.user.create({
      data: {
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}@child.local`,
        password: "dummy_password",
        role: "STUDENT",
        studentProfile: {
          create: {
            age: age || null,
            gender: gender || null,
            isChild: true,
          },
        },
      },
      include: { studentProfile: true },
    });

    await prisma.parentChild.create({
      data: {
        parentId,
        childProfileId: childUser.studentProfile.id,
      },
    });

    res.status(201).json({
      message: "Child added successfully",
      child: childUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};