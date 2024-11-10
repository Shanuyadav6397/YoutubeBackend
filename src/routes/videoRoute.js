import express from 'express';
import { loggedIn } from '../validation/authValidator.js';
import { upload } from '../middlewares/multer.js';
import {
    deleteUserVideo,
    publishAVideo,
    updateVideoDescription,
    updateVideoThumbnail,
    updateVideoTitle
} from '../controllers/videoController.js';

const videoRouter = express.Router();

videoRouter.route('/uploadVideo').post(loggedIn, upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]), publishAVideo);
videoRouter.route('/updateThumbnail/:videoId').patch(loggedIn, upload.single("thumbnail"), updateVideoThumbnail);
videoRouter.route('/updateTitle/:videoId').patch(loggedIn, updateVideoTitle);
videoRouter.route('/updateDescription/:videoId').patch(loggedIn, updateVideoDescription);
videoRouter.route('/deleteVideo/:videoId').delete(loggedIn, deleteUserVideo);

export { videoRouter };