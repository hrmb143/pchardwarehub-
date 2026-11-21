require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pchardwarehub';

app.use(cors());
app.use(express.json());

// 1. MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully:', MONGO_URI))
  .catch((err) => console.error('MongoDB Connection Failed:', err.message));

// 2. Database Collections (Tables) Structure
const buildSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, default: 'Harish_Raghav', trim: true },
  tag: { type: String, default: 'Custom Build' },
  total_price: { type: Number, required: true },
  total_watts: { type: Number, required: true },
  parts: { type: Object, required: true },
  notes: { type: String, default: 'Saved via PC Hardware Hub Builder.' },
  created_at: { type: Date, default: Date.now }
});

const auditLogSchema = new mongoose.Schema({
  build_summary: { type: String, required: true },
  total_price: { type: Number, required: true },
  total_watts: { type: Number, required: true },
  status: { type: String, required: true },
  exported_at: { type: Date, default: Date.now }
});

const SavedBuild = mongoose.model('SavedBuild', buildSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// 3. API Routes (Frontend calls these URLs)
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'ONLINE' : 'OFFLINE',
    database: isConnected ? 'MongoDB Connected' : 'MongoDB Disconnected'
  });
});

app.get('/api/builds', async (req, res) => {
  try {
    const builds = await SavedBuild.find().sort({ created_at: -1 });
    res.json(builds.map((b) => ({
      id: b._id.toString(),
      title: b.title,
      author: b.author,
      tag: b.tag,
      total: b.total_price,
      watts: b.total_watts,
      parts: b.parts,
      notes: b.notes
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/builds', async (req, res) => {
  try {
    const { title, author, tag, total, watts, parts, notes } = req.body;
    const created = await SavedBuild.create({
      title,
      author: author || 'Harish_Raghav',
      tag: tag || 'Custom Build',
      total_price: total || 0,
      total_watts: watts || 0,
      parts,
      notes: notes || 'Saved via PC Hardware Hub Builder.'
    });
    res.status(201).json({ id: created._id.toString(), message: 'Saved to MongoDB!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/builds/:id', async (req, res) => {
  try {
    await SavedBuild.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/audit-logs', async (req, res) => {
  try {
    const { build_summary, total_price, total_watts, status } = req.body;
    const log = await AuditLog.create({ build_summary, total_price, total_watts, status });
    res.status(201).json({ auditId: log._id.toString().slice(-6).toUpperCase() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});