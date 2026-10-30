const express = require("express");
const { allUserController, deleteUserController, singleUserController, activeUserController, deActiveUserController, updateUserController, categoryStatusChangeController } = require("../controllers/adminController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin Management and Operations
 */

/**
 * @swagger
 * /api/v1/admin/all-users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users fetched successfully
 *       500:
 *         description: Internal server error
 */

router.get("/all-users", allUserController);

/**
 * @swagger
 * /api/v1/admin/deleteuser/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.delete("/deleteuser/:id", deleteUserController);

/**
 * @swagger
 * /api/v1/admin/singleuser/{id}:
 *   get:
 *     summary: Get single user info by ID (excluding password)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User info fetched successfully
 *       500:
 *         description: Internal server error
 */

router.get("/singleuser/:id", singleUserController);

/**
 * @swagger
 * /api/v1/admin/activeuser:
 *   get:
 *     summary: Get all active users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active users fetched successfully
 *       500:
 *         description: Internal server error
 */

router.get("/activeuser", activeUserController);

/**
 * @swagger
 * /api/v1/admin/deactiveuser:
 *   get:
 *     summary: Get all deactivated users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deactive users fetched successfully
 *       500:
 *         description: Internal server error
 */

router.get("/deactiveuser", deActiveUserController);

/**
 * @swagger
 * /api/v1/admin/updateuser/{id}:
 *   post:
 *     summary: Update user details by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       500:
 *         description: Internal server error
 */

router.post("/updateuser/:id", updateUserController);

/**
 * @swagger
 * /api/v1/admin/categorystatuschange/{id}:
 *   post:
 *     summary: Change category status by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       200:
 *         description: Category status changed successfully
 *       500:
 *         description: Internal server error
 */

router.post("/categorystatuschange/:id", categoryStatusChangeController);


module.exports = router;
