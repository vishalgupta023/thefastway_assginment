import AuthController from '#controllers/auth_controller'
import TransferFundsController from '#controllers/transactions_controller'
import UsersController from '#controllers/users_controller'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'


router.group(()=>{
    // ==================================== Auth Api's ==============================//
    router.post("/register" , [AuthController, 'register']).use(middleware.guest())
    router.post("/login" , [AuthController, 'login']).use(middleware.guest())
    router.get("/logout" , [AuthController, 'logout']).use(middleware.auth())
    // ==================================== Auth Api's ==============================//

    //=================================user Api's ======================================//
    router.post('/add-funds', [UsersController , "addFunds"]).use(middleware.auth())
    router.get('/check-balance', [UsersController , "checkBalance"]).use(middleware.auth())
    router.get('/contacts', [UsersController , "myUpiContacts"]).use(middleware.auth())
    router.get('/my-profile', [UsersController , "myProfile"]).use(middleware.auth())

    //=================================user Api's ======================================//


    // ==================================== transection Api's ==============================//
    router.post("/transfer-funds" , [TransferFundsController, 'transfer']).use(middleware.auth())
    router.get("/transactions" , [TransferFundsController, 'getHistory']).use(middleware.auth())
    router.get('/transaction-status/:transaction_id', [TransferFundsController ,"status"]).use(middleware.auth())
    // ==================================== transection Api's ==============================//

}).prefix("/api/v1")