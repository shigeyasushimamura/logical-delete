import type { BaseEntity } from "../../domain/shared/BaseEntiry.js";
import type { IRepository } from "../../domain/shared/IRepository.js";

export class InMemoryRepository<T extends BaseEntity>
  implements IRepository<T>
{
  private db: Map<string, T> = new Map();

  async save(entity: T): Promise<T> {
    // DB書き込みシミュレーション
    console.log(`[INFRA:Memory] Saving ${entity.id}`);
    this.db.set(entity.id, entity);
    return entity;
  }

  async findById(id: string): Promise<T | null> {
    const item = this.db.get(id);
    // 論理削除チェック
    if (!item || item.deletedAt !== null) return null;
    return item;
  }

  async softDelete(id: string): Promise<boolean> {
    const item = this.db.get(id);
    if (!item || item.deletedAt !== null) return false;

    // オブジェクトをコピーして更新（イミュータブルっぽく）
    const updated = { ...item, deletedAt: new Date() };
    this.db.set(id, updated);
    console.log(`[INFRA:Memory] Soft Deleted ${id}`);
    return true;
  }
}
