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
exports.checkUser = void 0;
// Adjust the path as necessary
const vscode = __importStar(require("vscode"));
const getuserinfo_1 = require("../../../../src/getuserinfo");
async function checkUser(client) {
    let user_id = null;
    try {
        if (!client) {
            vscode.window.showErrorMessage("Database client is not connected.");
            return null; // Return null instead of undefined
        }
        const username = await (0, getuserinfo_1.GetLoggedInUserData)(); // Wait for the username
        const query = `SELECT * FROM dotnet.users WHERE github_username = $1`; // Use parameterized query
        const res = await client.query(query, [username]); // Pass username as parameter
        if (res.rows.length > 0) {
            const user = res.rows[0];
            // vscode.window.showInformationMessage(
            //   `User Found: ${user.github_username}`
            // );
            user_id = parseInt(user.id, 10); // Parse integer with base 10
        }
        else {
            //vscode.window.showInformationMessage("User not found.");
        }
    }
    catch (err) {
        vscode.window.showErrorMessage(`Error querying database: ${err.message}`);
    }
    return user_id;
}
exports.checkUser = checkUser;
//# sourceMappingURL=checkuser.js.map