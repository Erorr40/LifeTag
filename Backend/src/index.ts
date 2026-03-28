import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User';
import Profile from './models/Profile';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifetag';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/verify-pin', async (req, res) => {
  try {
    const { pin } = req.body;
    // In a real app we'd query a specific profile by ID or session
    const profile = await Profile.findOne({ pin }).sort({ _id: -1 });

    if (profile || pin === '1234') { // Keep 1234 as universal fallback
      res.json({ success: true, message: 'Valid PIN' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid PIN' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    user = new User({ fullName, email, password });
    await user.save();
    res.json({ success: true, message: 'Signup successful', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });   
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, message: 'Signin successful', user, token: 'dummy_token' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' }); 
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/medical-data/:userId', async (req, res) => {
  try {
     const profile = await Profile.findOne().sort({ _id: -1 }); // Get latest for demo
     if (profile) {
        res.json({ success: true, data: profile.medicalInfo || profile });
     } else {
        res.status(404).json({ success: false, message: 'Not found' });
     }
  } catch(e) {
     res.status(500).json({ success: false });
  }
});

app.post('/api/save-medical-data', async (req, res) => {
  try {
    const data = req.body;

    // Direct dashboard update (has an _id or full fields)
    if (data._id || (!data.templateType && data.fullName)) {
       const latest = await Profile.findOne().sort({ _id: -1 });
       if (latest) {
          latest.fullName = data.fullName || latest.fullName;
          latest.bloodType = data.bloodType !== undefined ? data.bloodType : latest.bloodType;
          latest.medicalConditions = data.medicalConditions || latest.medicalConditions;
          latest.medications = data.medications || latest.medications;
          latest.allergies = data.allergies || latest.allergies;
          latest.emergencyContacts = data.emergencyContacts || latest.emergencyContacts;
          latest.notes = data.notes !== undefined ? data.notes : latest.notes;
          await latest.save();
          return res.json({ success: true, profile: latest });
       } else {
          const profile = new Profile(data);
          await profile.save();
          return res.json({ success: true, profile });
       }
    }

    if (data.templateType) {
        const newProfile = new Profile({
           templateType: data.templateType,
           fullName: data.fullName || 'Medical Profile',
        });

        if (data.templateType === 'Child') {
           newProfile.allergies = data.notes ? [data.notes] : [];
           newProfile.age = data.age?.toString() || '';
           newProfile.emergencyContacts = data.emergencyContacts?.map((c: any) => ({ name: c.name, phone: c.phone || 'N/A', type: 'Parent' })) || [];
        } else if (data.templateType === 'Medical' && data.data) {
           newProfile.bloodType = data.data.bloodType;
           newProfile.allergies = data.data.allergies ? [data.data.allergies] : [];
           newProfile.medications = data.data.medications ? [data.data.medications] : [];
           newProfile.medicalConditions = data.data.conditions ? [data.data.conditions] : [];
           newProfile.emergencyContacts = data.data.emergencyContacts;
           newProfile.notes = data.data.notes;
        } else if (data.templateType === 'Custom') {
           newProfile.customSections = data.customSections;
        }

        await newProfile.save();
        return res.json({ success: true, profile: newProfile });
    }

    if (data.isPinProtected !== undefined) {
       const latest = await Profile.findOne().sort({ _id: -1 });
       if (latest) {
          latest.isPinProtected = data.isPinProtected;
          if (data.pin) latest.pin = data.pin;
          await latest.save();
          return res.json({ success: true, message: 'PIN updated', profile: latest });
       }
    }

    return res.status(400).json({ success: false, message: 'Invalid payload' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

app.get('/api/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne().sort({ _id: -1 }); // Get latest for demo
    if (profile) res.json({ success: true, profile });
    else res.status(404).json({ success: false, message: 'Not found' });        
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
