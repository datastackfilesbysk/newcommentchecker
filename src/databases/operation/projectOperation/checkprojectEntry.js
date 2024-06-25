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
exports.checkProjectEntry = void 0;
const vscode = __importStar(require("vscode"));
const getProjectinfo_1 = require("./getProjectinfo");
async function checkProjectEntry(client) {
    try {
        if (!client) {
            vscode.window.showErrorMessage("Database client is not connected.");
            return;
        }
        // Call the displayRepositoryInfo function and await its result
        const projectres = await (0, getProjectinfo_1.displayRepositoryInfo)();
        if (!projectres) {
            vscode.window.showErrorMessage("No project information returned.");
            return;
        }
        // const projectname = projectres.mainFolderName;
        const projectname = "OtobusTicketProject";
        const query = `SELECT * FROM dotnet.projects WHERE name = $1`;
        try {
            const res = await client.query(query, [projectname]);
            if (res.rows.length > 0) {
                const project = res.rows[0];
                // vscode.window.showInformationMessage(
                //   `Project Found: ${project.name}, Status: ${project.status}, Status Change Date: ${project.status_change_date}`
                // );
                return Number.parseInt(project.id);
            }
            else {
                // vscode.window.showInformationMessage("Project not found.");
                return null;
            }
        }
        catch (err) {
            vscode.window.showErrorMessage(`Error querying database: ${err.message}`);
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error fetching project information: ${error.message}`);
    }
}
exports.checkProjectEntry = checkProjectEntry;
//# sourceMappingURL=checkprojectEntry.js.map