"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const Profile_1 = __importDefault(require("./models/Profile"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifetag';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.post('/api/verify-pin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pin } = req.body;
        // In a real app we'd query a specific profile by ID or session
        const profile = yield Profile_1.default.findOne({ pin }).sort({ _id: -1 });
        if (profile || pin === '1234') { // Keep 1234 as universal fallback
            res.json({ success: true, message: 'Valid PIN' });
        }
        else {
            res.status(400).json({ success: false, message: 'Invalid PIN' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
app.post('/api/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = req.body;
        let user = yield User_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        user = new User_1.default({ fullName, email, password });
        yield user.save();
        res.json({ success: true, message: 'Signup successful', user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}));
app.post('/api/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email, password });
        if (user) {
            res.json({ success: true, message: 'Signin successful', user, token: 'dummy_token' });
        }
        else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
app.get('/api/medical-data/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Profile_1.default.findOne().sort({ _id: -1 }); // Get latest for demo
        if (profile) {
            res.json({ success: true, data: profile.medicalInfo || profile });
        }
        else {
            res.status(404).json({ success: false, message: 'Not found' });
        }
    }
    catch (e) {
        res.status(500).json({ success: false });
    }
}));
app.post('/api/save-medical-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const data = req.body;
        // Direct dashboard update (has an _id or full fields)
        if (data._id || (!data.templateType && data.fullName)) {
            const latest = yield Profile_1.default.findOne().sort({ _id: -1 });
            if (latest) {
                latest.fullName = data.fullName || latest.fullName;
                latest.bloodType = data.bloodType !== undefined ? data.bloodType : latest.bloodType;
                latest.medicalConditions = data.medicalConditions || latest.medicalConditions;
                latest.medications = data.medications || latest.medications;
                latest.allergies = data.allergies || latest.allergies;
                latest.emergencyContacts = data.emergencyContacts || latest.emergencyContacts;
                latest.notes = data.notes !== undefined ? data.notes : latest.notes;
                yield latest.save();
                return res.json({ success: true, profile: latest });
            }
            else {
                const profile = new Profile_1.default(data);
                yield profile.save();
                return res.json({ success: true, profile });
            }
        }
        if (data.templateType) {
            const newProfile = new Profile_1.default({
                templateType: data.templateType,
                fullName: data.fullName || 'Medical Profile',
            });
            if (data.templateType === 'Child') {
                newProfile.allergies = data.notes ? [data.notes] : [];
                newProfile.age = ((_a = data.age) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                newProfile.emergencyContacts = ((_b = data.emergencyContacts) === null || _b === void 0 ? void 0 : _b.map((c) => ({ name: c.name, phone: c.phone || 'N/A', type: 'Parent' }))) || [];
            }
            else if (data.templateType === 'Medical' && data.data) {
                newProfile.bloodType = data.data.bloodType;
                newProfile.allergies = data.data.allergies ? [data.data.allergies] : [];
                newProfile.medications = data.data.medications ? [data.data.medications] : [];
                newProfile.medicalConditions = data.data.conditions ? [data.data.conditions] : [];
                newProfile.emergencyContacts = data.data.emergencyContacts;
                newProfile.notes = data.data.notes;
            }
            else if (data.templateType === 'Custom') {
                newProfile.customSections = data.customSections;
            }
            yield newProfile.save();
            return res.json({ success: true, profile: newProfile });
        }
        if (data.isPinProtected !== undefined) {
            const latest = yield Profile_1.default.findOne().sort({ _id: -1 });
            if (latest) {
                latest.isPinProtected = data.isPinProtected;
                if (data.pin)
                    latest.pin = data.pin;
                yield latest.save();
                return res.json({ success: true, message: 'PIN updated', profile: latest });
            }
        }
        return res.status(400).json({ success: false, message: 'Invalid payload' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
}));
app.get('/api/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Profile_1.default.findOne().sort({ _id: -1 }); // Get latest for demo
        if (profile)
            res.json({ success: true, profile });
        else
            res.status(404).json({ success: false, message: 'Not found' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
