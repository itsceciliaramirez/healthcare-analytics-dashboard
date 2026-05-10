const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ROOT TEST ROUTE */
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* MAIN ANALYTICS */
app.get("/analytics", async (req, res) => {
  try {
    const totalAppointments = await pool.query(
      "SELECT COUNT(*) FROM appointments"
    );

    const noShows = await pool.query(
      "SELECT COUNT(*) FROM appointments WHERE appointment_status = 'No Show'"
    );

    const completed = await pool.query(
      "SELECT COUNT(*) FROM appointments WHERE appointment_status = 'Completed'"
    );

    const followUps = await pool.query(
      "SELECT COUNT(*) FROM appointments WHERE follow_up_required = true"
    );

    const avgWaitTime = await pool.query(
      "SELECT AVG(wait_time_minutes) FROM appointments WHERE wait_time_minutes IS NOT NULL"
    );

    const total = Number(totalAppointments.rows[0].count);
    const noShowCount = Number(noShows.rows[0].count);
    const completedCount = Number(completed.rows[0].count);

    res.json({
      total_appointments: total,
      no_show_count: noShowCount,
      no_show_rate: ((noShowCount / total) * 100).toFixed(1),
      completed_count: completedCount,
      completed_rate: ((completedCount / total) * 100).toFixed(1),
      follow_up_count: Number(followUps.rows[0].count),
      average_wait_time: avgWaitTime.rows[0].avg,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* FILTERED ANALYTICS */
app.get("/analytics/:department", async (req, res) => {
  try {
    const { department } = req.params;

    const result = await pool.query(
      `
      SELECT 
        COUNT(*) AS total_appointments,
        COUNT(*) FILTER (WHERE appointment_status = 'No Show') AS no_show_count,
        ROUND(
          AVG(wait_time_minutes)::numeric,
          1
        ) AS average_wait_time
      FROM appointments
      `,
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* APPOINTMENT STATUS */
app.get("/appointment-status", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT appointment_status, COUNT(*) AS count
      FROM appointments
      GROUP BY appointment_status
      ORDER BY count DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* PATIENT FUNNEL */
app.get("/patient-funnel", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT stage_name, patient_count
      FROM patient_funnel
      ORDER BY stage_order
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* DEPARTMENT ANALYTICS */
app.get("/department-analytics", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT department_name, appointment_count
      FROM department_analytics
      ORDER BY appointment_count DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* APPOINTMENT TRENDS */
app.get("/appointment-trends", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE(appointment_date) AS appointment_day,
        COUNT(*) AS appointment_count
      FROM appointments
      GROUP BY appointment_day
      ORDER BY appointment_day
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});