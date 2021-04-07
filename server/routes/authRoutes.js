// Requires
// ------------------------------------
const { Router } = require('express');

// controllers
const {
    LoginController,
    LogOutController,
    SignUpController,
    GetUserController,
    ProfileController,
    RequestPasswordResetController,
    UpdatePasswordController,
    VerifyPasswordReset
} = require('../controllers/authController');

// middleware
const authMiddleware = require('../middleware/authMiddleware');

// Init router
// ------------------------------------
const router = Router();

// Routes definitions
// ------------------------------------

// 1) Sign Up: POST
router.post('/signup', SignUpController);

// 2) Log In : POST
router.post('/login', LoginController);

// 3) Logout : POST
router.post('/logout', LogOutController);

// 4) Get Username: GET
router.get('/user/:id', authMiddleware, GetUserController);

// 5) Profile Route: GET
router.get('/profile', authMiddleware, ProfileController);

// 6) Reset Password Request : POST
router.post('/requestResetPassword', RequestPasswordResetController);

// 7) Token Verify and redirect : GET
router.get('/resetPassword/:resetToken', VerifyPasswordReset);

// 8) Reset Password : POST
router.put('/resetPassword', UpdatePasswordController);

// Export Router
// ------------------------------------

module.exports = router;
