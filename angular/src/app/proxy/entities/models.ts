import type { AuditedEntity } from '../volo/abp/domain/entities/auditing/models';

export interface Category extends AuditedEntity<number> {
  name?: string;
}
