import type { BaseEntity } from "./BaseEntiry.js";

/**
 * 汎用リポジトリインターフェース
 * T は BaseEntity を継承していれば何でも良い
 */
export interface IRepository<T extends BaseEntity> {
  save(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  softDelete(id: string): Promise<boolean>;
}
