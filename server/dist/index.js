"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const template_routes_1 = __importDefault(require("./routes/template.routes"));
const poster_routes_1 = __importDefault(require("./routes/poster.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Serve static assets from public (for generated posters and templates)
app.use('/public', express_1.default.static(path_1.default.join(process.cwd(), 'public')));
app.use('/templates', express_1.default.static(path_1.default.join(process.cwd(), 'public', 'templates')));
app.use('/generated-posters', express_1.default.static(path_1.default.join(process.cwd(), 'public', 'generated-posters')));
// Health Check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/templates', template_routes_1.default);
app.use('/api/posters', poster_routes_1.default);
app.use('/api/uploads', upload_routes_1.default);
// 404 Handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
});
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        errors: [err.message || 'Unknown error occurred'],
    });
});
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`PosterAI Express Server running on port ${PORT}`);
    });
}
exports.default = app;
