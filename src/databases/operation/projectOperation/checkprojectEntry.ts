import * as vscode from "vscode";
import { Client } from "pg";
import { displayRepositoryInfo } from "./getProjectinfo";

export async function checkProjectEntry(client: Client) {
  try {
    if (!client) {
      vscode.window.showErrorMessage("Database client is not connected.");
      return;
    }

    // Call the displayRepositoryInfo function and await its result
    const projectres = await displayRepositoryInfo();
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
      } else {
        // vscode.window.showInformationMessage("Project not found.");
        return null;
      }
    } catch (err: any) {
      vscode.window.showErrorMessage(`Error querying database: ${err.message}`);
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(
      `Error fetching project information: ${error.message}`
    );
  }
}
