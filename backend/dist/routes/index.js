"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("./auth/auth"));
const usersearch_1 = __importDefault(require("./search/usersearch"));
const chat_1 = __importDefault(require("./chat/chat"));
const message_1 = __importDefault(require("./message/message"));
router.use('/auth', auth_1.default);
router.use('/search', usersearch_1.default);
router.use('/chat', chat_1.default);
router.use('/message', message_1.default);
exports.default = router;
