import { Client } from "pg";
import * as vscode from "vscode";
import { checkProjectEntry } from "../projectOperation/checkprojectEntry";
import { checkUser } from "../userOperation/checkuser";
import { Status } from "../../../constants/status";
import {
  checkComments,
  CommentCheckResult,
  FileAnalysisResult,
} from "../../../commentuser/commentchecker";

interface FileInfo {
  user_id: number;
  project_id: number;
  file_name: string;
  class_name: string;
  method_name: string;
  is_comment_present: boolean;
  comment: string | null;
  status: string;
  status_change_date: string;
}

async function insertOrUpdateFileInfo(fileInfo: FileInfo, client: Client) {
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
    } else {
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
  } catch (error: any) {
    vscode.window.showErrorMessage(
      "Failed to insert or update file info: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

async function insertOrUpdateClassInfo(fileInfo: FileInfo, client: Client) {
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
    } else {
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
  } catch (error: any) {
    vscode.window.showErrorMessage(
      "Failed to insert or update class info: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

async function insertinFile(
  client: Client,
  context: vscode.ExtensionContext,
  content: string,
  filename: string
) {
  if (!client) {
    vscode.window.showInformationMessage("Database is not connected.");
    return;
  }

  let user = await checkUser(client);
  let project = await checkProjectEntry(client);

  if (user && project) {
    try {
      const result: FileAnalysisResult = await checkComments(content, filename);

      for (const func of result.functions) {
        // Concatenate comments into a single string
        const concatenatedComments = func.comment.join("\n");

        const sampleFileInfo: FileInfo = {
          user_id: user,
          project_id: project,
          file_name: filename,
          class_name: func.className || "null", // Default to "null" if className is undefined
          method_name: func.name,
          is_comment_present: func.hasComment,
          comment: concatenatedComments || "null", // Default to null if comment is undefined
          status: Status.active,
          status_change_date: new Date().toISOString(),
        };
        await insertOrUpdateFileInfo(sampleFileInfo, client);
      }

      for (const cls of result.classes) {
        // Concatenate comments into a single string
        const concatenatedComments = cls.comment.join("\n");

        const classFileInfo: FileInfo = {
          user_id: user,
          project_id: project,
          file_name: filename,
          class_name: cls.class_name,
          method_name: "-", // Method name set to "-"
          is_comment_present: cls.hasComment,
          comment: concatenatedComments || "null", // Default to null if comment is undefined
          status: Status.active,
          status_change_date: new Date().toISOString(),
        };
        await insertOrUpdateClassInfo(classFileInfo, client);
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        "Error in fetching the comments related info: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  } else {
    vscode.window.showInformationMessage("User or project not found.");
  }
}

export {
  insertinFile,
  insertOrUpdateFileInfo,
  insertOrUpdateClassInfo,
  FileInfo,
};
