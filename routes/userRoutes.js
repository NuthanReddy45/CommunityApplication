const express = require("express")

const {  
        signinController, 
        signupController, 
        changePasswordController, 
        sendVerificationMail, 
        verifiedEmailController, 
        emailVerificationController,
        resetPasswordController
    } = require("../controllers/userController")

const sendResetLink = require("../middlewares/auth")
const router = express.Router()

router.post("/login", signinController)
router.post("/register", signupController);
router.get("/verifyemail/:email/:uniqueString", emailVerificationController);
router.post("/verifyemail", sendVerificationMail)
router.post("/changepassword", changePasswordController)
router.get("/verified", verifiedEmailController)
router.post("/forgotPasseord", sendResetLink)
router.get("/resetPassword", resetPasswordController)


module.exports = router;