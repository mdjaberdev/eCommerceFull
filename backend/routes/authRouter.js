const express = require("express");
const { registrationController, verificationEmailController, loginController, forgotPasswordController, resetPasswordController } = require("../controllers/authControllers");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication Management
 */

/**
 * @swagger
 * /api/v1/auth/registration:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - confirmPassword
 *               - terms
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               terms:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error or User already exists
 */
router.post("/registration", registrationController);

/**
 * @swagger
 * /api/v1/auth/verify/{token}:
 *   post:
 *     summary: Verify user email using token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification JWT token
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Token missing or invalid
 */
router.post("/verify/:token", verificationEmailController);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       403:
 *         description: Account not verified
 *       404:
 *         description: User not found
 */
router.post("/login", loginController);

/**
 * @swagger
 * /api/v1/auth/forgotPassword:
 *   post:
 *     summary: Request password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: User not found or missing email
 */
router.post("/forgotPassword", forgotPasswordController);

/**
 * @swagger
 * /api/v1/auth/resetPassword/{token}:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Token mismatch or passwords do not match
 */
router.post("/resetPassword/:token", resetPasswordController);





module.exports = router;
