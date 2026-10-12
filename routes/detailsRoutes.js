const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authmiddleware");

const router = express.Router();

// GET /api/details
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        id,
        employee_id,
        name,
        email,
        phone,
        department,
        designation,
        city,
        created_at
      FROM employees
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Get employees error:", error);
    res.status(500).json({
      message: "Unable to load employee details.",
    });
  }
});

// POST /api/details
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      employee_id,
      name,
      email,
      phone,
      department,
      designation,
      city,
    } = req.body;

    if (
      !employee_id ||
      !name ||
      !email ||
      !phone ||
      !department ||
      !designation ||
      !city
    ) {
      return res.status(400).json({
        message: "All employee fields are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingEmployee] = await pool.execute(
      "SELECT id FROM employees WHERE employee_id = ?",
      [employee_id.trim()]
    );

    if (existingEmployee.length > 0) {
      return res.status(409).json({
        message: "Employee ID already exists.",
      });
    }

    const [result] = await pool.execute(
      `
        INSERT INTO employees
        (employee_id, name, email, phone, department, designation, city)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        employee_id.trim(),
        name.trim(),
        normalizedEmail,
        phone.trim(),
        department.trim(),
        designation.trim(),
        city.trim(),
      ]
    );

    const [newEmployee] = await pool.execute(
      `
        SELECT
          id,
          employee_id,
          name,
          email,
          phone,
          department,
          designation,
          city,
          created_at
        FROM employees
        WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      message: "Employee saved successfully.",
      employee: newEmployee[0],
    });
  } catch (error) {
    console.error("Create employee error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Employee ID already exists.",
      });
    }

    res.status(500).json({
      message: "Unable to save employee.",
    });
  }
});

module.exports = router;
