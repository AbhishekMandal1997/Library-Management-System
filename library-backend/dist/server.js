"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || 'your_default_fallback_mongo_uri';
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('📚 Connected to MongoDB');
    app_1.default.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
    .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});
//# sourceMappingURL=server.js.map