import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('transaction_id').notNullable().unique();  
      table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('receiver_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.decimal('amount', 15, 2).notNullable();
      table.enum('status', ['Pending', 'Success', 'Failed']).notNullable().defaultTo('Pending');
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}