module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword,
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = `Username required`;
    }
    if (email.trim() === '') {
        errors.email = `Email required`;
    } else {
        const regex = new RegExp('^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$');
        if (!email.match(regex)) {
            errors.email = `Email must be a valid email address`;
        }
    }
    if (password.trim() === '') {
        errors.password = `Password required`;
    }
    if (password !== confirmPassword) {
        errors.confirmPassword = `Password must match`;
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (
    username,
    password,
) => {
    const errors = {};
    if (!username) {
        errors.username = `Input username`;
    }
    if (!password) {
        errors.password = `Incorrect password`;
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}
