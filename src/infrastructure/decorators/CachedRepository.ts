import type { BaseEntity } from "../../domain/shared/BaseEntiry.js";
import type { IRepository } from "../../domain/shared/IRepository.js";

/**
 * 汎用キャッシュデコレーター
 */
export class CachedRepository<T extends BaseEntity> implements IRepository<T> {
  private cache = new Map<string, { data: T | null; expiry: number }>();
  private readonly TTL = 5000;

  constructor(private inner: IRepository<T>) {}

  async save(entity: T): Promise<T> {
    const res = await this.inner.save(entity);
    this.cache.delete(entity.id);
    return res;
  }

  async findById(id: string): Promise<T | null> {
    const cached = this.cache.get(id);
    if (cached && cached.expiry > Date.now()) {
      console.log(`[CORE:Cache Hit] ${id}`);
      return cached.data;
    }
    const res = await this.inner.findById(id);
    this.cache.set(id, { data: res, expiry: Date.now() + this.TTL });
    return res;
  }

  async softDelete(id: string): Promise<boolean> {
    const res = await this.inner.softDelete(id);
    if (res) this.cache.delete(id);
    return res;
  }
}
