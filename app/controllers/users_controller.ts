import User from '#models/user';
import { addFundsValidator } from '#validators/index';
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async addFunds({ request, response  ,auth}: HttpContext) {
    const { amount } = request.only(['upi_id', 'amount'])

    await request.validateUsing(addFundsValidator);
    const sessionUser = auth.user;

    if(!sessionUser)  return response.unauthorized({message : "please login"});

    // Find the user by UPI ID
    const user = await User.query().where('upi_id', sessionUser.upi_id).first();

    if (!user) {
      return response.notFound({ error: 'User not found' });
    }

    try {
      // Increase the user's balance
      user.balance += amount;
      await user.save();

      return response.ok({ message: 'Funds added successfully', balance: user.balance });
    } catch (error) {
      return response.internalServerError({ error: 'Failed to add funds', details: error.message });
    }
  }

  public async checkBalance({ response, auth }: HttpContext) {

    // Find the user by UPI ID
    const user = auth.user;
    if (!user) {
      return response.unauthorized({ message: 'unauthorized!' });
    }
    const isValidUser = await User.findBy("email" ,user.email)
    if(!isValidUser){
      return response.unauthorized({ message : "some thing went wrong!" });
    }
    return response.ok({ message: 'balance fetced successfull', balance: `${user.balance} ruppees` });
  }

  public async myUpiContacts({ response, auth }: HttpContext) {

      const user = auth.user;
      if (!user) return response.unauthorized({ message: 'Not authorized, please login' });
      try {
        // Fetch all users except the logged-in user
        const contacts = await User.query()
          .whereNot('id', user.id)
          .select('name', 'upi_id')
          .orderBy('name', 'asc'); // Sort alphabetically
  
        return response.ok({ contacts });
      } catch (error) {
        return response.internalServerError({ error: 'Failed to fetch UPI contacts', details: error.message });
      }
    }

    public async myProfile({ response, auth }: HttpContext) {
      const user = auth.user;
      if (!user) return response.unauthorized({ message: 'Not authorized, please login' });
  
      try {
        // Fetch user profile details
        const profile = await User.query()
          .where('id', user.id)
          .select('name', 'email', 'upi_id', 'balance', 'created_at')
          .first();
  
        return response.ok({ profile });
      } catch (error) {
        return response.internalServerError({ error: 'Failed to fetch profile', details: error.message });
      }
    }
}