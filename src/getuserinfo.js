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
exports.GetLoggedInUserData = void 0;
const vscode = __importStar(require("vscode"));
async function GetLoggedInUserData() {
    // Get the session for the GitHub authentication provider
    const session = await vscode.authentication.getSession("github", ["user:email"], { createIfNone: true });
    let message = "No user has logged in.";
    let username = "unknown";
    // Check if the session is valid
    if (session) {
        message = `${session.account.label} Connected to VSCode successfully!`;
        username = `${session.account.label}`;
    }
    // Show an information message indicating that the user has logged in successfully
    vscode.window.showInformationMessage(message);
    return username;
}
exports.GetLoggedInUserData = GetLoggedInUserData;
//# sourceMappingURL=getuserinfo.js.map