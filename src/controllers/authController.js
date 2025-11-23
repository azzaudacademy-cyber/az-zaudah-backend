import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Helper to sign JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// =============================
// REGISTER ADULT STUDENT
// =============================
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "STUDENT",
        studentProfile: {
          create: {
            age: age ? Number(age) : null,
            gender: gender || null,
            isChild: false
          }
        }
      }
    });

    res.status(201).json({
      message: "Student registered",
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// REGISTER PARENT
// =============================
export const registerParent = async (req, res) => {
  try {
    const { name, email, password, children } = req.body;
    // children = array of child objects

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    // Create parent account
    const parent = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "PARENT"
      }
    });

    // Create children
    if (children && children.length > 0) {
      for (const child of children) {
        const newUser = await prisma.user.create({
          data: {
            name: child.name,
            email: `${child.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}@child.local`,
            password: hashed,
            role: "STUDENT",
            studentProfile: {
              create: {
                age: child.age || null,
                gender: child.gender || null,
                isChild: true
              }
            }
          },
          include: { studentProfile: true }
        });

        await prisma.parentChild.create({
          data: {
            parentId: parent.id,
            childProfileId: newUser.studentProfile.id
          }
        });
      }
    }

    res.status(201).json({
      message: "Parent registered successfully",
      token: generateToken(parent)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// LOGIN
// ==============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(user),
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
