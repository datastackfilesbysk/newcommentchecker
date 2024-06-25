import * as vscode from "vscode";

export async function GetLoggedInUserData(): Promise<string> {
  // Get the session for the GitHub authentication provider
  const session = await vscode.authentication.getSession(
    "github",
    ["user:email"],
    { createIfNone: true }
  );
  let message = "No user has logged in.";
  let username = "unknown";

  // Check if the session is valid
  if (session) {
    message = `${session.account.label} Connected to VSCode successfully!`;
    username = `${session.account.label}`;
  }

  // Show an information message indicating that the user has logged in successfully
  vscode.window.showInformationMessage(message);

  return username;
}
