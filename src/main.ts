import type { User } from "./domain/models/user.js";
import { InMemoryRepository } from "./infrastructure/memory/MemoryRepository.js";
import { CachedRepository } from "./infrastructure/middleware/CachedRepository.js";
import { ResilientRepository } from "./infrastructure/middleware/ResilientRepository.js";

async function main() {
  console.log("=== APP START ===");

  // 1. 具体的な実装を用意 (In-Memory)
  // ※ 将来prismaとか使いたい場合は、
  // Prisma用のリポジトリを作成して、
  // ここを new PrismaRepository<User>() に変えるだけで移行完了
  const memoryRepo = new InMemoryRepository<User>();

  // 2. 使いたい機能を付与(Decoratorパターン)
  const resilientRepo = new ResilientRepository<User>(memoryRepo);
  const userRepo = new CachedRepository<User>(resilientRepo);

  // 利用側
  const userId = "u_100";

  // SAVE
  await userRepo.save({
    id: userId,
    name: "Test User",
    email: "test@example.com",
    deletedAt: null,
  });

  // READ (DB Access)
  console.log("\n--- First Read ---");
  const u = await userRepo.findById(userId);
  console.log("Get User(u_100):", u); // null

  // READ (Cache Hit)
  console.log("\n--- Second Read ---");
  await userRepo.findById(userId);

  // DELETE
  console.log("\n--- Delete ---");
  await userRepo.softDelete(userId);

  // READ (Deleted)
  console.log("\n--- Read After Delete ---");
  const result = await userRepo.findById(userId);
  console.log("Result:", result); // null
}

main();
