// Adjust the path as necessary
import * as vscode from "vscode";
import { Client } from "pg";
import { GetLoggedInUserData } from "../../../../src/getuserinfo";

export async function checkUser(client: Client) {
  let user_id: number | null = null;

  try {
    if (!client) {
      vscode.window.showErrorMessage("Database client is not connected.");
      return null; // Return null instead of undefined
    }

    const username = await GetLoggedInUserData(); // Wait for the username
    const query = `SELECT * FROM dotnet.users WHERE github_username = $1`; // Use parameterized query

    const res = await client.query(query, [username]); // Pass username as parameter
    if (res.rows.length > 0) {
      const user = res.rows[0];
      // vscode.window.showInformationMessage(
      //   `User Found: ${user.github_username}`
      // );
      user_id = parseInt(user.id, 10); // Parse integer with base 10
    } else {
      //vscode.window.showInformationMessage("User not found.");
    }
  } catch (err: any) {
    vscode.window.showErrorMessage(`Error querying database: ${err.message}`);
  }
  return user_id;
}
