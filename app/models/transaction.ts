import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js';

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare transaction_id: string;

  @column()
  declare sender_id: number;

  @column()
  declare receiver_id: number;

  @column({
    prepare: (value: number) => Math.round(value * 100), // Convert rupees to paise before saving
    consume: (value: number) => value / 100, // Convert paise to rupees when fetching
  })
  declare amount: number;

  @column()
  declare status: 'Pending' | 'Success' | 'Failed';



  @belongsTo(() => User, { foreignKey: 'sender_id' })
  declare sender: BelongsTo<typeof User>;

  @belongsTo(() => User, { foreignKey: 'receiver_id' })
  declare receiver: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;
}
