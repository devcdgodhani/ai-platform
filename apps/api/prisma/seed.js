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
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // Create admin user
    const adminHash = await bcrypt.hash('admin123!', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ai-platform.dev' },
        update: {},
        create: {
            email: 'admin@ai-platform.dev',
            name: 'Admin User',
            passwordHash: adminHash,
            role: 'ADMIN',
        },
    });
    // Create demo user
    const userHash = await bcrypt.hash('demo123!', 12);
    const demo = await prisma.user.upsert({
        where: { email: 'demo@ai-platform.dev' },
        update: {},
        create: {
            email: 'demo@ai-platform.dev',
            name: 'Demo User',
            passwordHash: userHash,
            role: 'USER',
        },
    });
    // Create a sample conversation
    await prisma.conversation.upsert({
        where: { id: 'seed-conv-01' },
        update: {},
        create: {
            id: 'seed-conv-01',
            userId: demo.id,
            title: 'Welcome to AI Platform',
            messages: {
                create: [
                    { role: 'USER', content: 'Hello! What can you do?' },
                    {
                        role: 'ASSISTANT',
                        content: 'Hello! I can help you with chat, answer questions using RAG, process documents, and run AI agents. What would you like to explore?',
                        model: 'mock-model-v1',
                        tokens: 30,
                    },
                ],
            },
        },
    });
    console.log(`✅ Seeded: admin (${admin.email}), demo (${demo.email})`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map