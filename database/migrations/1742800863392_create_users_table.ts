import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('upi_id', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.bigInteger('balance').notNullable().defaultTo(0); // Store balance in paise
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}