import type { BaseEntity } from "../core/IRepository.js";

/**
 * User型定義
 */
export interface User extends BaseEntity {
  name: string;
  email: string;
  // 他のビジネスロジックで必要なフィールド
}
