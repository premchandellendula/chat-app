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
const db_1 = require("../../db");
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.get('/users', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchKeyWord = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};
    // console.log(searchKeyWord)
    try {
        const users = yield db_1.User.find(searchKeyWord).find({ _id: { $ne: req.userId } });
        if (users.length === 0) {
            res.status(404).json({ message: "No users found" });
            return;
        }
        res.status(200).json({
            message: "User fetched successfully",
            users
        });
    }
    catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({
            message: "An unexpected error occurred while fetching users"
        });
    }
}));
exports.default = router;
