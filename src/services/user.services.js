const verificationLink = (email, randomHash) => {
    return `${process.env.BASE_URL}confirm-account/${email}/${randomHash}`;
}

const forgotPasswordLink = (email, randomHash) => {
    return `${process.env.BASE_URL}forgot-password/${email}/${randomHash}`;
}

module.exports = {
    verificationLink,
    forgotPasswordLink,
}
