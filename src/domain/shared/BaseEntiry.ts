/**
 * 全てのエンティティが最低限持つべき型
 */
export interface BaseEntity {
  id: string;
  deletedAt: Date | null; // Tombstone
}
