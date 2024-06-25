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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToPostgres = void 0;
const vscode = __importStar(require("vscode"));
const pg_1 = require("pg");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let isConnected = false;
const configPath = path.resolve("../../../config.json");
vscode.window.showInformationMessage("config path :", configPath);
async function createClient() {
    let connectionString = process.env.PG_CONNECTION_STRING;
    if (!connectionString) {
        try {
            vscode.window.showInformationMessage("Attemp to read config path");
            const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
            connectionString = config.PG_CONNECTION_STRING;
            vscode.window.showInformationMessage("reading operation of pg_connection_string is successful");
        }
        catch (error) {
            vscode.window.showErrorMessage("Error reading PG_CONNECTION_STRING from config file.");
        }
    }
    if (!connectionString) {
        vscode.window.showErrorMessage("PostgreSQL connection string is not set in environment variables or config file.");
        return null;
    }
    const newClient = new pg_1.Client({ connectionString });
    return newClient;
}
async function connectToPostgres() {
    let client = null;
    try {
        client = await createClient();
        if (client) {
            await client.connect();
            isConnected = true;
            vscode.window.showInformationMessage("Initial connection to PostgreSQL database successful.");
        }
    }
    catch (error) {
        isConnected = false;
        vscode.window.showErrorMessage("Failed to connect to PostgreSQL database: " +
            (error instanceof Error ? error.message : String(error)));
    }
    return client;
}
exports.connectToPostgres = connectToPostgres;
//# sourceMappingURL=connect.js.map