import express from 'express';
import { loggedIn } from '../validation/authValidator.js';
import { upload } from '../middlewares/multer.js';
import { publishAVideo } from '../controllers/videoController.js';

const videoRouter = express.Router();

videoRouter.route('/uploadVideo').post(loggedIn, upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]), publishAVideo);

export { videoRouter };