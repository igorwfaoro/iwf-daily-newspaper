"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./core/config");
const express_1 = __importDefault(require("express"));
const package_json_1 = __importDefault(require("../package.json"));
const newspaper_service_1 = require("./services/newspaper.service");
const app = (0, express_1.default)();
const port = config_1.CONFIG.port;
const newspaperService = (0, newspaper_service_1.createNewspaperService)();
app.post('/send-today-newspaper', async (req, res) => {
    newspaperService.run();
    res.status(200).send();
});
app.get('/', (_, res) => {
    res.json({
        api: 'iwf-daily-newspaper',
        version: package_json_1.default.version,
    });
});
app.listen(port, () => {
    console.log(`🚀 API running on port ${port}`);
});
//# sourceMappingURL=app.js.map