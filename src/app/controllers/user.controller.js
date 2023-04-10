const {
    SUCCESS,
    INVALIDRESPONSE,
    CUSTOMRESPONSE,
    NOTFOUND,
} = require('../../constants/response.constants');
const pool = require('../../config/db.config')
const { generateAccessToken } = require('../../middlewares/auth.middleware');
const { sendAccountVerificationEmail, sendForgetPasswordEmail } = require('../../utils/email.utils');
const otpGenerator = require('otp-generator');
const { verify } = require('jsonwebtoken');

const createUser = async (req, res, next) => {
    try {
        const { name, email } = req.body
        
        //data 
        const data = await A();

      

    } catch (error) {
        console.log(error);
        next(error)
        res.send({error:error})
    }
}

const updateUser = async (req, res, next) => {
    const id = parseInt(req.params.id)
    const { name, email } = req.body

    try {

        //update user
        await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3',
            [name, email, id])
        CUSTOMRESPONSE(res, `User ${id} updated successfully!`);
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const getUsers = async (req, res, next) => {
    try {
        const resp = await pool.query("SELECT * FROM users ORDER BY id ASC", ["variables go here as array"])
        SUCCESS(res, resp);
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const getUser = async (req, res, next) => {
    try {
        const id = parseInt(request.params.id)
        const resp = await pool.query('SELECT * FROM users WHERE id = $1', [id])
        SUCCESS(res, resp);
    } catch (error) {
        console.log(error);
        next(error)
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const id = parseInt(request.params.id)
        const resp = await pool.query('DELETE FROM users WHERE id = $1', [id])
        SUCCESS(res, resp);
    } catch (error) {
        console.log(error);
        next(error)
    }
};


// the below methods are in mongodb and are just for reference ....

// const login = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ email });
//         if (!user) return NOTFOUND(res, `Email is not registered`);

//         user.comparePassword(password, async function (err, isMatch) {
//             if (err) {
//                 console.log(err);
//                 return next(err);
//             }
//             if (!isMatch) return INVALIDRESPONSE(res, 'Invalid password!');
//             const accessToken = generateAccessToken(
//                 { email: user.email, role: user.role, id: user._id },
//             );
//             const response = { ...user._doc, accessToken };
//             return SUCCESS(res, response);
//         });
//     } catch (error) {
//         console.log(error);
//         next(error)
//     }
// };

// const confirmAccount = async (req, res, next) => {
//     try {
//         const { email, otp } = req.body;
//         const user = await OTP.findOne({ email, otp });
//         if (!user) return INVALIDRESPONSE(res, 'Invalid OTP!');

//         // check if sixty seconds have passed
//         const now = new Date();
//         const diff = now - user.createdAt;
//         const diffMinutes = diff / 1000;
//         if (diffMinutes > 60)
//             return INVALIDRESPONSE(res, 'OTP has expired!');

//         const userData = await User.findOne({ email });
//         if (!userData) return INVALIDRESPONSE(res, 'Invalid OTP!');

//         userData.isEmailVerified = true;
//         await userData.save();
//         await OTP.deleteOne({ email, otp });
//         SUCCESS(res, 'Account Verified Successfully!');
//     } catch (error) {
//         next(error);
//     }
// };

// const resendOTP = async (req, res, next) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });

//         if (!user) return INVALIDRESPONSE(res, 'Invalid Email!');
//         const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, numeric: true, lowerCaseAlphabets: false });

//         await sendAccountVerificationEmail(email, otp);
//         await OTP.create({ email, otp, user: user._id });
//         SUCCESS(res, 'OTP sent successfully!');
//     } catch (error) {
//         next(error);
//     }
// }

// const forgotPassword = async (req, res, next) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return INVALIDRESPONSE(res, 'Email is not registered');

//         const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, numeric: true, lowerCaseAlphabets: false });
//         await sendForgetPasswordEmail(email, otp);
//         await OTP.create({ email, otp, user: user._id });

//         SUCCESS(res, `Forget password OTP sent to ${email}`);
//     } catch (error) {
//         next(error);
//     }
// };

// const resetPassword = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email }).lean();
//         if (!user) return NOTFOUND(res, `Email is not registered`)

//         await User.updateOne({ email }, { password: password });
//         return CUSTOMRESPONSE(res, 'Password Updated Successfully');
//     } catch (error) {
//         next(error);
//     }
// };

// const confirmForgotPasswordLink = async (req, res, next) => {
//     try {
//         const { email, randomHash } = req.params;
//         const user = await User.findOne({ email, randomHash });
//         if (!user) return INVALIDRESPONSE(res, 'Invalid email or random hash!');
//         await User.updateOne({ email }, { randomHash: '' });
//         SUCCESS(res, 'Forgot password link confirmed successfully!');
//     } catch (error) {
//         next(error);
//     }
// };

module.exports = {
    createUser,
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    // confirmAccount,
    // login,
    // forgotPassword,
    // confirmForgotPasswordLink,
    // resetPassword,
    // resendOTP,
}