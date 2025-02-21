const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Allows handling JSON requests

// ✅ Connect to MySQL Database
const db = mysql.createConnection({
    host: 'sql.freedb.tech', // e.g., sql123.infinityfree.com
    user: 'freedb_ghazwanbilal', // e.g., epiz_12345678
    password: 'nuR26EXb*e4Bez',
    database: 'freedb_db_schoolportal_gb' // e.g., epiz_12345678_school
});


db.connect(err => {
    if (err) {
        console.error('❌ MySQL Connection Error:', err);
        throw err;
    }
    console.log('✅ MySQL Connected...');
});

// ✅ API to Get the Latest Announcement
app.get('/announcement', (req, res) => {
    db.query("SELECT message FROM announcements ORDER BY date DESC LIMIT 1", (err, result) => {
        if (err) {
            console.error('❌ Error fetching announcement:', err);
            return res.status(500).json({ message: "Database error!" });
        }
        res.json(result[0] || { message: "No announcements yet." });
    });
});

// ✅ API to Add a New Announcement
app.post('/add-announcement', (req, res) => {
    const { message } = req.body;
    if (!message || message.trim() === "") {
        return res.status(400).json({ message: "Announcement cannot be empty!" });
    }
    
    db.query("INSERT INTO announcements (message) VALUES (?)", [message], (err, result) => {
        if (err) {
            console.error('❌ Error inserting announcement:', err);
            return res.status(500).json({ message: "Database error!" });
        }
        res.json({ message: "✅ Announcement added successfully!" });
    });
});

// ✅ Improved Error Handling for Database Connection
process.on('uncaughtException', err => {
    console.error('❌ Uncaught Exception:', err);
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
