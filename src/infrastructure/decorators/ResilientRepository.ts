import type { BaseEntity } from "../../domain/shared/BaseEntiry.js";
import type { IRepository } from "../../domain/shared/IRepository.js";
import { setTimeout } from "timers/promises";

/**
 * 汎用リトライ
 */
export class ResilientRepository<T extends BaseEntity>
  implements IRepository<T>
{
  constructor(
    private inner: IRepository<T>,
    private maxRetries = 3,
    private baseDelay = 100
  ) {}

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
        if (++attempt > this.maxRetries) throw e;

        // 指数バックオフ：100ms, 200ms, 400ms, 800ms...
        const delay = this.baseDelay * Math.pow(2, attempt - 1);
        console.warn(
          `[Retry] Attempt ${attempt} failed. Waiting ${delay}ms before retry...`
        );

        await new Promise((r) => setTimeout(delay, r));
      }
    }
  }
}
