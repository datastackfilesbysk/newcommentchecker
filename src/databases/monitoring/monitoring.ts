import * as vscode from "vscode";
import { Client } from "pg";

export async function checkDatabaseConnection(client: Client) {
  try {
    if (!client) {
      throw new Error("PostgreSQL client is not available.");
    }
    await client.query("SELECT 1");
    //vscode.window.showInformationMessage("Connected to PostgreSQL database.");
  } catch (error: any) {
    vscode.window.showErrorMessage(
      "PostgreSQL database connection error: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}
