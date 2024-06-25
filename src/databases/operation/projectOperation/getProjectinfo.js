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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayRepositoryInfo = exports.fetchRepositoryInfo = void 0;
const vscode = __importStar(require("vscode"));
const simple_git_1 = __importDefault(require("simple-git"));
const promises_1 = require("fs/promises");
const path_1 = require("path");
async function findGitRootInSubdirectories(currentPath) {
    const items = await (0, promises_1.readdir)(currentPath, { withFileTypes: true });
    for (const item of items) {
        const itemPath = (0, path_1.join)(currentPath, item.name);
        if (item.isDirectory()) {
            if (item.name === ".git") {
                return currentPath;
            }
            else {
                const gitRoot = await findGitRootInSubdirectories(itemPath);
                if (gitRoot) {
                    return gitRoot;
                }
            }
        }
    }
    return null;
}
async function getDirectoryHierarchy(dirPath, basePath) {
    const dirInfo = {
        name: (0, path_1.relative)(basePath, dirPath) || ".", // Use relative path
        path: dirPath,
        subdirectories: [],
    };
    const items = await (0, promises_1.readdir)(dirPath, { withFileTypes: true });
    for (const item of items) {
        const itemPath = (0, path_1.join)(dirPath, item.name);
        if (item.isDirectory()) {
            const subDirInfo = await getDirectoryHierarchy(itemPath, basePath);
            dirInfo.subdirectories.push(subDirInfo);
        }
    }
    return dirInfo;
}
async function fetchRepositoryInfo(repoPath) {
    const gitRoot = await findGitRootInSubdirectories(repoPath);
    if (!gitRoot) {
        throw new Error("No Git repository found in the current project hierarchy.");
    }
    const git = (0, simple_git_1.default)(gitRoot);
    let remoteUrl = null;
    try {
        remoteUrl = await git.listRemote(["--get-url"]);
    }
    catch (error) {
        remoteUrl = null;
    }
    const mainFolderName = (0, path_1.resolve)(gitRoot).split("/").pop();
    const currentBranch = await git.revparse(["--abbrev-ref", "HEAD"]);
    const status = await git.status();
    const commits = await git.log();
    const commitDiffs = await git.diffSummary();
    const branchDetails = await Promise.all(status.tracking ? [await git.log([status.tracking])] : []);
    const directoryHierarchy = await getDirectoryHierarchy(gitRoot, gitRoot);
    return {
        url: remoteUrl ? remoteUrl.trim() : null,
        mainFolderName,
        currentBranch: currentBranch.trim(),
        status,
        commits: [...commits.all],
        commitDiffs: commitDiffs.files,
        branchDetails,
        directoryHierarchy,
    };
}
exports.fetchRepositoryInfo = fetchRepositoryInfo;
// function to display repository information
async function displayRepositoryInfo() {
    const repoPath = vscode.workspace.rootPath;
    if (repoPath) {
        try {
            const repoInfo = await fetchRepositoryInfo(repoPath);
            return repoInfo;
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error fetching repository info: ${error.message}`);
        }
    }
    else {
        vscode.window.showErrorMessage("No workspace opened.");
    }
    return null;
}
exports.displayRepositoryInfo = displayRepositoryInfo;
//# sourceMappingURL=getProjectinfo.js.map