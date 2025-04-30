"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true
    },
    ISBN: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true,
        trim: true
    },
    publishedDate: {
        type: Date,
        required: [true, 'Published date is required']
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        trim: true
    },
    copiesAvailable: {
        type: Number,
        required: [true, 'Number of copies available is required'],
        min: [0, 'Copies available must be non-negative']
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true
});
bookSchema.index({ ISBN: 1 }, { unique: true });
bookSchema.pre('save', function (next) {
    if (this.isModified('copiesAvailable') && this.copiesAvailable < 0) {
        next(new Error('Copies available cannot be negative'));
    }
    next();
});
if (mongoose_1.default.models.Book) {
    delete mongoose_1.default.models.Book;
}
exports.Book = mongoose_1.default.model('Book', bookSchema);
//# sourceMappingURL=Book.js.map