"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controllers/bookController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
router.get('/', bookController_1.getAllBooks);
router.get('/:id', bookController_1.getBookById);
router.post('/', auth_1.authenticateToken, validate_1.validateBookData, bookController_1.createBook);
router.put('/:id', auth_1.authenticateToken, validate_1.validateBookData, bookController_1.updateBook);
router.delete('/:id', auth_1.authenticateToken, bookController_1.deleteBook);
router.post('/:id/borrow', auth_1.authenticateToken, bookController_1.borrowBook);
router.post('/:id/return', auth_1.authenticateToken, bookController_1.returnBook);
exports.default = router;
//# sourceMappingURL=bookRoutes.js.map