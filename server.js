const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// ✅ Improved CORS Configuration
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json()); // ✅ Allows handling JSON requests

// ✅ Connect to MySQL Database with explicit port
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',  // Your MySQL host
    user: 'sql12763861',  // Your MySQL username
    password: 'TzWTB1YTtp',  // Your MySQL password
    database: 'sql12763861',  // Your database name
    port: 3306 // ✅ Ensure MySQL is using the correct port
});

db.connect(err => {
    if (err) {
        console.error('❌ MySQL Connection Error:', err);
        throw err;
    }
    console.log('✅ MySQL Connected...');
});

// ✅ Default Route (Fixes "Cannot GET /")
app.get('/', (req, res) => {
    res.send('✅ Backend is Live! Use API endpoints.');
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
        console.error("❌ Received empty announcement request.");
        return res.status(400).json({ message: "Announcement cannot be empty!" });
    }

    const sql = "INSERT INTO announcements (message) VALUES (?)";
    db.query(sql, [message], (err, result) => {
        if (err) {
            console.error("❌ MySQL Insert Error:", err);
            return res.status(500).json({ message: "Database error!", error: err });
        }
        res.json({ message: "✅ Announcement added successfully!" });
    });
});

// ✅ Improved Error Handling for Database Connection
process.on('uncaughtException', err => {
    console.error('❌ Uncaught Exception:', err);
});

// ✅ Start the Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

