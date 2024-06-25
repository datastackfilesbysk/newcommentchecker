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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const connect_1 = require("./databases/connection/connect");
const monitoring_1 = require("./databases/monitoring/monitoring");
const fileop_1 = require("./databases/operation/fileoperation/fileop");
const commentchecker_1 = require("./commentuser/commentchecker");
const languageConstants_1 = require("./constants/languageConstants");
const getuserinfo_1 = require("./getuserinfo");
async function activate(context) {
    // Register the command to get user info
    let currentUserInfo = vscode.commands.registerCommand("codeCommentReviewer.getUserInfo", async () => {
        await (0, getuserinfo_1.GetLoggedInUserData)();
    });
    context.subscriptions.push(currentUserInfo);
    // Register the comment checker command
    let reviewCommentsCommand = vscode.commands.registerCommand("codeCommentReviewer.reviewComments", async () => { });
    context.subscriptions.push(reviewCommentsCommand);
    // Register the command to save file info
    let saveinf = vscode.commands.registerCommand("codeCommentReviewer.savefileinfo", async () => { });
    context.subscriptions.push(saveinf);
    // Execute the registered commands
    vscode.commands.executeCommand("codeCommentReviewer.getUserInfo");
    vscode.commands.executeCommand("codeCommentReviewer.reviewComments");
    // Call the connectToPostgres function for database connectivity
    let client = await (0, connect_1.connectToPostgres)();
    if (!client) {
        vscode.window.showErrorMessage("Failed to connect to PostgreSQL database.");
        return;
    }
    // Function to handle comment checking and saving file info
    const handleDocument = async (document) => {
        if (document.languageId === languageConstants_1.Language_Constants.C_SHARP) {
            vscode.commands.executeCommand("codeCommentReviewer.reviewComments");
            const fileNameMatch = document.fileName.match(/[^\\]*$/);
            const fileName = fileNameMatch ? fileNameMatch[0] : "";
            const content = document.getText();
            try {
                const result = await (0, commentchecker_1.checkComments)(content, fileName);
                context.workspaceState.update("content", content);
                context.workspaceState.update("filename", fileName);
            }
            catch (error) {
                console.error("Error occurred while checking comments:", error);
            }
            // Execute the save file info command with the required context
            await (0, fileop_1.insertinFile)(client, context, content, fileName);
        }
    };
    // Process all currently opened text documents
    vscode.workspace.textDocuments.forEach(handleDocument);
    // Register the comment checker for newly opened documents
    let commentinfo = vscode.workspace.onDidOpenTextDocument(handleDocument);
    context.subscriptions.push(commentinfo);
    // Register the comment checker for document save
    let saveCommentInfo = vscode.workspace.onDidSaveTextDocument(handleDocument);
    context.subscriptions.push(saveCommentInfo);
    // Register the comment checker for document close
    let closeCommentInfo = vscode.workspace.onDidCloseTextDocument(handleDocument);
    context.subscriptions.push(closeCommentInfo);
    // Schedule checkDatabaseConnection to run every 30 seconds
    setInterval(async () => {
        await (0, monitoring_1.checkDatabaseConnection)(client);
    }, 30 * 1000);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map