import * as vscode from "vscode";
import { Client } from "pg";
import * as path from "path";
import * as fs from "fs";
const host = "20.235.152.4";
const port = 5432;
const username = "dsuser";
const password = "dsuser@123";
const database = "code_formatting";
let isConnected: boolean = false;
const configPath = path.resolve("../../../config.json");
vscode.window.showInformationMessage("config path :", configPath);
async function createClient(): Promise<Client | null> {
  const connectionString = `postgresql://${username}:${encodeURIComponent(
    password
  )}@${host}:${port}/${database}`;
  // let connectionString = process.env.PG_CONNECTION_STRING;

  // if (!connectionString) {
  //   try {
  //     vscode.window.showInformationMessage("Attemp to read config path");
  //     const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  //     connectionString = config.PG_CONNECTION_STRING;
  //     vscode.window.showInformationMessage(
  //       "reading operation of pg_connection_string is successful"
  //     );
  //   } catch (error) {
  //     vscode.window.showErrorMessage(
  //       "Error reading PG_CONNECTION_STRING from config file."
  //     );
  //   }
  // }

  // if (!connectionString) {
  //   vscode.window.showErrorMessage(
  //     "PostgreSQL connection string is not set in environment variables or config file."
  //   );
  //   return null;
  // }

  const newClient = new Client({ connectionString: connectionString });
  return newClient;
}

export async function connectToPostgres() {
  let client: Client | null = null;
  try {
    client = await createClient();
    if (client) {
      await client.connect();
      isConnected = true;
      vscode.window.showInformationMessage(
        "Initial connection to PostgreSQL database successful."
      );
    }
  } catch (error: any) {
    isConnected = false;
    vscode.window.showErrorMessage(
      "Failed to connect to PostgreSQL database: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
  return client;
}
