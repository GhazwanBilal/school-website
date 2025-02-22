const express = require('express');
const mysql = require('mysql2'); // ✅ Switched to mysql2 for better performance
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

// ✅ MySQL Database Connection
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12763861',
    password: 'TzWTB1YTtp',
    database: 'sql12763861',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('❌ MySQL Connection Error:', err);
        throw err;
    }
    console.log('✅ MySQL Connected...');
});

// ✅ API: Get Exam Scores by Student ID
app.get('/scores/:studentID', (req, res) => {
    const studentID = req.params.studentID;
    const sql = "SELECT subject, score FROM scores WHERE student_id = ?";
    
    db.query(sql, [studentID], (err, result) => {
        if (err) {
            console.error('❌ Error fetching scores:', err);
            return res.status(500).json({ message: "Database error!" });
        }
        res.json(result);
    });
});

// Start the Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
