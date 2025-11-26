/**
 * 全てのエンティティが最低限持つべき型
 */
export interface BaseEntity {
  id: string;
  deletedAt: Date | null; // Tombstone
}

/**
 * 汎用リポジトリインターフェース
 * T は BaseEntity を継承していれば何でも良い
 */
export interface IRepository<T extends BaseEntity> {
  save(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  softDelete(id: string): Promise<boolean>;
}
