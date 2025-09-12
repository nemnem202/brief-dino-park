import { PrismaClient } from "../generated/prisma";

export class Database {
  private static _instance: PrismaClient | undefined;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!this._instance) {
      this._instance = new PrismaClient();
    }

    return this._instance;
  }
}
