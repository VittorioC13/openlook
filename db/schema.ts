import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const sharedLooks=sqliteTable('shared_looks',{token:text('token').primaryKey(),owner:text('owner').notNull(),payload:text('payload').notNull(),createdAt:integer('created_at').notNull()});
