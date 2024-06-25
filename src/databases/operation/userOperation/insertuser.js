"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
async function insertUser(user: User, client: Client) {
  if (!client) {
    vscode.window.showErrorMessage("Unable to connect to the database.");
    return;
  }

  // Check if the table exists
  try {
    const tableCheckResult = await client.query(`
      SELECT * FROM information_schema.tables
      WHERE table_schema = 'dotnet' AND table_name = 'users';
    `);

    if (tableCheckResult.rowCount === 0) {
      vscode.window.showErrorMessage("The 'users' table does not exist.");
      return;
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(
      "Failed to check table existence: " +
        (error instanceof Error ? error.message : String(error))
    );
    return;
  }

  const query = `
    INSERT INTO dotnet.users (first_name, last_name, github_username, status, status_change_date,id)
    VALUES ($1, $2, $3, $4, $5,$6)
  `;
  const values = [
    user.first_name,
    user.last_name,
    user.github_username,
    user.status,
    user.status_change_date,
    user.id,
  ];

  try {
    await client.query(query, values);
    vscode.window.showInformationMessage("User inserted successfully.");
  } catch (error: any) {
    vscode.window.showErrorMessage(
      "Failed to insert user: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

export async function insertSampleUser(client: Client) {
  const sampleUser: User = {
    id: 1,
    first_name: "kavita",
    last_name: "gayake",
    github_username: "gayakekavi",
    status: "completed",
    status_change_date: new Date().toISOString(), // Insert the current date and time
  };

  await insertUser(sampleUser, client);
}


*/
//# sourceMappingURL=insertuser.js.map