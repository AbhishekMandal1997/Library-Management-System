"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token provided, authorization denied' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
        if (typeof decoded === 'object' && 'userId' in decoded && 'role' in decoded) {
            req.user = decoded;
            next();
        }
        else {
            res.status(403).json({ message: 'Invalid token structure' });
        }
    }
    catch (err) {
        res.status(403).json({ message: 'Token is not valid' });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map