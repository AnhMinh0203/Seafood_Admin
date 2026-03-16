import type { Entity } from '../models';

export interface AuditedEntity<TKey> extends CreationAuditedEntity<TKey> {
  lastModificationTime?: string;
  lastModifierId?: string;
}

export interface CreationAuditedEntity<TKey> extends Entity {
  creationTime?: string;
  creatorId?: string;
}
