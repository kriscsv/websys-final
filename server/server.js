const express    = require('express');
const cors       = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => res.send('Server is running!'));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});