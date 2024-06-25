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
exports.insertOrUpdateClassInfo = exports.insertOrUpdateFileInfo = exports.insertinFile = void 0;
const vscode = __importStar(require("vscode"));
const checkprojectEntry_1 = require("../projectOperation/checkprojectEntry");
const checkuser_1 = require("../userOperation/checkuser");
const status_1 = require("../../../constants/status");
const commentchecker_1 = require("../../../commentuser/commentchecker");
async function insertOrUpdateFileInfo(fileInfo, client) {
    if (!client) {
        vscode.window.showErrorMessage("Unable to connect to the database.");
        return;
    }
    const checkQuery = `
    SELECT COUNT(*) FROM dotnet.file_info
    WHERE user_id = $1 AND project_id = $2 AND file_name = $3 AND class_name = $4 AND method_name = $5
  `;
    const checkValues = [
        fileInfo.user_id,
        fileInfo.project_id,
        fileInfo.file_name,
        fileInfo.class_name,
        fileInfo.method_name,
    ];
    try {
        const res = await client.query(checkQuery, checkValues);
        const count = parseInt(res.rows[0].count, 10);
        if (count > 0) {
            // Update existing record
            const updateQuery = `
        UPDATE dotnet.file_info
        SET is_comment_present = $6, comment = $7, status_change_date = $8
        WHERE user_id = $1 AND project_id = $2 AND file_name = $3 AND class_name = $4 AND method_name = $5
      `;
            const updateValues = [
                fileInfo.user_id,
                fileInfo.project_id,
                fileInfo.file_name,
                fileInfo.class_name,
                fileInfo.method_name,
                fileInfo.is_comment_present,
                fileInfo.comment,
                fileInfo.status_change_date,
            ];
            await client.query(updateQuery, updateValues);
            //  vscode.window.showInformationMessage("File info updated successfully.");
        }
        else {
            // Insert new record
            const insertQuery = `
        INSERT INTO dotnet.file_info (
          user_id, project_id, file_name, class_name, method_name, is_comment_present, comment, status, status_change_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
            const insertValues = [
                fileInfo.user_id,
                fileInfo.project_id,
                fileInfo.file_name,
                fileInfo.class_name,
                fileInfo.method_name,
                fileInfo.is_comment_present,
                fileInfo.comment,
                fileInfo.status,
                fileInfo.status_change_date,
            ];
            await client.query(insertQuery, insertValues);
            // vscode.window.showInformationMessage("File info inserted successfully.");
        }
    }
    catch (error) {
        vscode.window.showErrorMessage("Failed to insert or update file info: " +
            (error instanceof Error ? error.message : String(error)));
    }
}
exports.insertOrUpdateFileInfo = insertOrUpdateFileInfo;
async function insertOrUpdateClassInfo(fileInfo, client) {
    if (!client) {
        vscode.window.showErrorMessage("Unable to connect to the database.");
        return;
    }
    const checkQuery = `
    SELECT COUNT(*) FROM dotnet.file_info
    WHERE user_id = $1 AND project_id = $2 AND file_name = $3 AND class_name = $4 AND method_name = '-'
  `;
    const checkValues = [
        fileInfo.user_id,
        fileInfo.project_id,
        fileInfo.file_name,
        fileInfo.class_name,
    ];
    try {
        const res = await client.query(checkQuery, checkValues);
        const count = parseInt(res.rows[0].count, 10);
        if (count > 0) {
            // Update existing record
            const updateQuery = `
        UPDATE dotnet.file_info
        SET is_comment_present = $5, comment = $6, status_change_date = $7
        WHERE user_id = $1 AND project_id = $2 AND file_name = $3 AND class_name = $4 AND method_name = '-'
      `;
            const updateValues = [
                fileInfo.user_id,
                fileInfo.project_id,
                fileInfo.file_name,
                fileInfo.class_name,
                fileInfo.is_comment_present,
                fileInfo.comment,
                fileInfo.status_change_date,
            ];
            await client.query(updateQuery, updateValues);
            // vscode.window.showInformationMessage("Class info updated successfully.");
        }
        else {
            // Insert new record
            const insertQuery = `
        INSERT INTO dotnet.file_info (
          user_id, project_id, file_name, class_name, method_name, is_comment_present, comment, status, status_change_date
        ) VALUES ($1, $2, $3, $4, '-', $5, $6, $7, $8)
      `;
            const insertValues = [
                fileInfo.user_id,
                fileInfo.project_id,
                fileInfo.file_name,
                fileInfo.class_name,
                fileInfo.is_comment_present,
                fileInfo.comment,
                fileInfo.status,
                fileInfo.status_change_date,
            ];
            await client.query(insertQuery, insertValues);
            // vscode.window.showInformationMessage("Class info inserted successfully.");
        }
    }
    catch (error) {
        vscode.window.showErrorMessage("Failed to insert or update class info: " +
            (error instanceof Error ? error.message : String(error)));
    }
}
exports.insertOrUpdateClassInfo = insertOrUpdateClassInfo;
async function insertinFile(client, context, content, filename) {
    if (!client) {
        vscode.window.showInformationMessage("Database is not connected.");
        return;
    }
    let user = await (0, checkuser_1.checkUser)(client);
    let project = await (0, checkprojectEntry_1.checkProjectEntry)(client);
    if (user && project) {
        try {
            const result = await (0, commentchecker_1.checkComments)(content, filename);
            for (const func of result.functions) {
                // Concatenate comments into a single string
                const concatenatedComments = func.comment.join("\n");
                const sampleFileInfo = {
                    user_id: user,
                    project_id: project,
                    file_name: filename,
                    class_name: func.className || "null", // Default to "null" if className is undefined
                    method_name: func.name,
                    is_comment_present: func.hasComment,
                    comment: concatenatedComments || "null", // Default to null if comment is undefined
                    status: status_1.Status.active,
                    status_change_date: new Date().toISOString(),
                };
                await insertOrUpdateFileInfo(sampleFileInfo, client);
            }
            for (const cls of result.classes) {
                // Concatenate comments into a single string
                const concatenatedComments = cls.comment.join("\n");
                const classFileInfo = {
                    user_id: user,
                    project_id: project,
                    file_name: filename,
                    class_name: cls.class_name,
                    method_name: "-", // Method name set to "-"
                    is_comment_present: cls.hasComment,
                    comment: concatenatedComments || "null", // Default to null if comment is undefined
                    status: status_1.Status.active,
                    status_change_date: new Date().toISOString(),
                };
                await insertOrUpdateClassInfo(classFileInfo, client);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage("Error in fetching the comments related info: " +
                (error instanceof Error ? error.message : String(error)));
        }
    }
    else {
        vscode.window.showInformationMessage("User or project not found.");
    }
}
exports.insertinFile = insertinFile;
//# sourceMappingURL=fileop.js.map