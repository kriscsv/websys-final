const express    = require('express');
const cors       = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const reportRoutes = require("./routes/reportRoutes");
const userRoutes   = require("./routes/userRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

const reportRoutes = require("./routes/reportRoutes");
const userRoutes   = require("./routes/userRoutes");


app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => res.send('Server is running!'));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users",   userRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});