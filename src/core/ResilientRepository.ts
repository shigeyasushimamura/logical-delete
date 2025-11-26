import type { IRepository, BaseEntity } from "./IRepository.js";
import { setTimeout } from "timers/promises";

/**
 * 汎用リトライ
 */
export class ResilientRepository<T extends BaseEntity>
  implements IRepository<T>
{
  constructor(private inner: IRepository<T>, private retryNum = 3) {}

  async save(entity: T) {
    return this.withRetry(() => this.inner.save(entity));
  }
  async findById(id: string) {
    return this.withRetry(() => this.inner.findById(id));
  }
  async softDelete(id: string) {
    return this.withRetry(() => this.inner.softDelete(id));
  }

  private async withRetry<R>(fn: () => Promise<R>): Promise<R> {
    let attempt = 0;
    while (true) {
      try {
        return await fn();
      } catch (e) {
        if (++attempt > this.retryNum) throw e;
        const delay = 50 * Math.pow(2, attempt);
        console.warn(`[CORE:Retry] Waiting ${delay}ms...`);
        await new Promise((r) => setTimeout(delay, r));
      }
    }
  }
}
