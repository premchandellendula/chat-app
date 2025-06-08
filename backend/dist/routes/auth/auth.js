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
const router = express_1.default.Router();
const zod_1 = __importDefault(require("zod"));
const argon2 = __importStar(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../db");
const signupBody = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    confirmPassword: zod_1.default.string().min(6),
    imageUrl: zod_1.default.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = signupBody.safeParse(req.body);
    if (!response.success) {
        res.status(400).json({
            message: "Incorrect inputs"
        });
        return;
    }
    const { name, email, password, imageUrl } = req.body;
    try {
        const hashedPassword = yield argon2.hash(password);
        const user = yield db_1.User.create({
            name: name,
            email: email,
            password: hashedPassword,
            imageUrl: imageUrl
        });
        if (!user) {
            throw new Error("Failed to create user");
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "2d" });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
        });
        res.status(201).json({
            message: "User created successfully",
            data: {
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
const signinBody = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = signinBody.safeParse(req.body);
    if (!response.success) {
        res.status(400).json({
            message: "Incorrect inputs"
        });
    }
    const { email, password } = req.body;
    try {
        const user = yield db_1.User.findOne({
            email: email
        });
        if (!user) {
            throw new Error("Erro fetching user");
        }
        const isPasswordValid = yield argon2.verify(user.password, password);
        if (!isPasswordValid) {
            res.status(400).json({
                message: "Incorrect password"
            });
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "2d" });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
        });
        res.status(200).json({
            message: "User signed in successfully",
            // token: req.headers.cookie
            // token: req.cookies.token
            data: {
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
exports.default = router;
