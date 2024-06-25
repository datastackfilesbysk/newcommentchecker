import { Client } from "pg";
import * as vscode from "vscode";
interface User {
  id: number;
  first_name: string;
  last_name: string;
  github_username: string;
  status: string;
  status_change_date: string;
}

export async function getuserinfofromdb(
  client: Client
): Promise<User[] | void> {
  if (!client) {
    vscode.window.showErrorMessage("Unable to connect to the database.");
    return;
  }

  try {
    const result = await client.query<User>(`SELECT * FROM dotnet.users`);
    vscode.window.showInformationMessage("Users retrieved successfully.");
    return result.rows;
  } catch (error: any) {
    vscode.window.showErrorMessage(
      "Failed to retrieve users: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}
