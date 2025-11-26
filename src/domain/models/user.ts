import type { BaseEntity } from "../shared/BaseEntiry.js";
/**
 * User型定義
 */
export interface User extends BaseEntity {
  name: string;
  email: string;
  // 他のビジネスロジックで必要なフィールド
}
