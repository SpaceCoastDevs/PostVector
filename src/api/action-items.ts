import express, { Request, Response } from 'express';
import { ActionItemServices } from './app-core/services/action-item-services';
import { FirebaseRepository, FirebaseRepositoryConfig } from './app-infrastructure/firebase-repository';
import { ActionItem } from './app-core/entities/action-item';
import { StoreEntityCommand } from './app-core/requests/store-entity-command';
import { db } from './firebase';

const router = express.Router();

// Initialize the service with repository
const config: FirebaseRepositoryConfig = {
    firestore: db,
    collectionName: 'action-items'
};
const repository = new FirebaseRepository<ActionItem>(config);
const actionItemService = new ActionItemServices(repository);

/**
 * @swagger
 * components:
 *   schemas:
 *     ActionItem:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - owner
 *         - priority
 *         - createdBy
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the action item
 *         name:
 *           type: string
 *           description: Name of the action item
 *         description:
 *           type: string
 *           description: Detailed description of the action item
 *         owner:
 *           type: string
 *           description: Person assigned to the action item
 *         priority:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Priority level (1=Very Low, 2=Low, 3=Medium, 4=High, 5=Very High)
 *         createdBy:
 *           type: string
 *           description: User who created the action item
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedBy:
 *           type: string
 *           description: User who last updated the action item
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     StoreEntityCommand:
 *       type: object
 *       required:
 *         - entity
 *         - userId
 *       properties:
 *         entity:
 *           $ref: '#/components/schemas/ActionItem'
 *         userId:
 *           type: string
 *           description: User performing the operation
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/action-items:
 *   post:
 *     summary: Store (create or update) an action item
 *     tags: [Action Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreEntityCommand'
 *     responses:
 *       201:
 *         description: Action item stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ActionItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const command = new StoreEntityCommand<ActionItem>(req.body.entity, req.body.userId);
        const { result, actionItem } = await actionItemService.storeActionItem(command);

        if (result.success && actionItem) {
            res.status(201).json({
                success: true,
                message: result.message,
                data: actionItem.toObject()
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message,
                errors: result.errors
            });
        }
        return;
    } catch (error) {
        console.error('Error storing action item:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [error instanceof Error ? error.message : 'Unknown error']
        });
        return;
    }
});

/**
 * @swagger
 * /api/action-items/get:
 *   post:
 *     summary: Get an action item by ID
 *     tags: [Action Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Action item ID
 *     responses:
 *       200:
 *         description: Action item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ActionItem'
 *       404:
 *         description: Action item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post('/get', async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        const result = await actionItemService.getRecordById(id);

        if (result.success && result.record) {
            res.json({
                success: true,
                message: result.message,
                data: result.record
            });
        } else {
            res.status(404).json({
                success: false,
                message: result.message,
                errors: result.errors
            });
        }
        return;
    } catch (error) {
        console.error('Error getting action item:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [error instanceof Error ? error.message : 'Unknown error']
        });
        return;
    }
});

/**
 * @swagger
 * /api/action-items/delete:
 *   post:
 *     summary: Delete an action item
 *     tags: [Action Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Action item ID
 *     responses:
 *       200:
 *         description: Action item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *       404:
 *         description: Action item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 */
router.post('/delete', async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        // Check if the action item exists first
        const exists = await actionItemService.recordExists(id);
        if (!exists) {
            res.status(404).json({
                success: false,
                message: 'Action item not found',
                errors: []
            });
            return;
        }

        // Delete the action item
        const deleted = await actionItemService.deleteRecord(id);

        if (deleted) {
            res.json({
                success: true,
                message: 'Action item deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to delete action item',
                errors: []
            });
        }
        return;
    } catch (error) {
        console.error('Error deleting action item:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errors: [error instanceof Error ? error.message : 'Unknown error']
        });
        return;
    }
});

export default router;
