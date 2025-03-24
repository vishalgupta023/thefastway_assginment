import type { HttpContext } from '@adonisjs/core/http'
import { v4 as uuidv4 } from 'uuid';
import vine from '@vinejs/vine';
import User from '#models/user';
import Transaction from '#models/transaction';


export default class TransferFundsController {
  public async transfer({ request, response ,auth }: HttpContext) {
    // Validation
    const transferValidator = vine.compile(
      vine.object({
        receiver_upi_id: vine.string().trim(),
        amount: vine.number().min(1),
      })
    );

    const  {receiver_upi_id ,amount}=await request.validateUsing(transferValidator);

    // Find sender and receiver
    const user = auth.user;
    if(!user) return response.unauthorized({message : "not authorized , please login"})
    const sender = await User.findBy('upi_id', user.upi_id);
    const receiver = await User.findBy('upi_id', receiver_upi_id);

    if (!sender || !receiver) {
      return response.badRequest({ error: 'Invalid sender or receiver UPI ID' });
    }

    if (sender.id === receiver.id) {
      return response.badRequest({ error: "You can't send money to yourself" });
    }

    // Check sender's balance
    if (sender.balance < amount) {
      return response.badRequest({ error: 'Insufficient balance' });
    }

    try {
      // Perform atomic transaction
      await User.transaction(async (trx) => {
        sender.useTransaction(trx);
        receiver.useTransaction(trx);

        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        // Log transaction
        await Transaction.create({
          transaction_id: uuidv4(),
          sender_id: sender.id,
          receiver_id: receiver.id,
          amount,
          status: 'Success',
        });
      });

      return response.ok({ message: 'Funds transferred successfully', sender_balance: sender.balance });
    } catch (error) {
      return response.internalServerError({ error: 'Transaction failed', details: error.message });
    }
  }


  public async getHistory({ request, response, auth }: HttpContext) {
    const user = auth.user;
    if (!user) return response.unauthorized({ message: "Not authorized, please login" });

    // Get search filters
    const upi_id = request.input('upi_id');
    const amount = request.input('amount');

    try {
      // Find user by UPI ID if provided
      let userIds: number[] = [];
      if (upi_id) {
        const searchedUser = await User.findBy('upi_id', upi_id);
        if (!searchedUser) return response.badRequest({ error: 'No user found with this UPI ID' });
        userIds = [searchedUser.id];
      } else {
        userIds = [user.id];
      }

      // Fetch transactions
      const transactions = await Transaction
        .query()
        .where((query) => {
          query.whereIn('sender_id', userIds).orWhereIn('receiver_id', userIds);
        })
        .if(amount, (query) => {
          query.andWhere('amount', amount * 100);
        })
        .orderBy('created_at', 'desc');

      return response.ok({ transactions });
    } catch (error) {
      return response.internalServerError({ error: 'Failed to fetch transactions', details: error.message });
    }
  }

  public async status({ params, response }: HttpContext) {
    const { transaction_id } = params;

    // Find transaction
    const transaction = await Transaction.findBy('transaction_id', transaction_id);

    if (!transaction) {
      return response.notFound({ error: 'Transaction not found' });
    }

    return response.ok({
      message: 'Transaction status retrieved successfully',
      transaction_id: transaction.transaction_id,
      status: transaction.status,
    });
  }
}
