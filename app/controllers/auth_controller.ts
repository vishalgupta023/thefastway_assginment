import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/index'
import type { HttpContext } from '@adonisjs/core/http'



export default class AuthController {

    public async login({ request, response, auth }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])
        await request.validateUsing(loginValidator);
        try {
            const user = await User.verifyCredentials(email, password)
            await auth.use('web').login(user);
            return response.created({ message: `Welcome ${user.name}`, yourUpiId : user.upi_id });
        } catch (error) {
            return response.badRequest({ error: 'User login failed', details: error.message });
        }
    }
    public async logout({response, auth }: HttpContext) {
        try {
            await auth.use('web').logout()
            return response.created({ message: 'logout successfully!' });
        } catch (error) {
            return response.badRequest({ error: 'User logout failed'});
        }
    }



    public async register({ request, response, auth }: HttpContext) {
        const data = request.only(['name', 'email', 'upi_id', 'password']);
        try {
            await request.validateUsing(registerValidator);
            const user = await User.create(data);
            await auth.use('web').login(user);
            return response.created({ message: 'User registered successfully', user });
        } catch (error) {
            return response.badRequest({ error: 'User registration failed', details: error.message });
        }
    }
}
