const SUCCESS = (res, data) => {
    return res.status(200).json({
        status: true,
        data: data,
    });
};

const GETSUCCESS = (res, data) => {
    return res.status(200).json({
        status: true,
        length: data.length,
        data: data,
    });
};

const AUTHSUCCESS = (res, data, token) => {
    return res.status(200).json({
        status: true,
        token: token,
        data: data,
    });
};

const NOTFOUND = (res, msg) => {
    return res.status(404).json({
        status: false,
        message: msg,
    });
};

const INVALIDRESPONSE = (res, msg) => {
    return res.status(400).json({
        status: false,
        message: msg,
    });
};

const CUSTOMRESPONSE = (res, msg) => {
    return res.status(200).json({
        status: true,
        message: msg,
    });
};

const ALREADYEXISTREPONSE = (res, msg) => {
    return res.status(409).json({
        status: false,
        message: msg,
    });
};

const FORBIDDENRESPONSE = (res) => {
    return res.status(409).json({
        status: false,
        message: 'User is forbidden!',
    });
};

module.exports = {
    SUCCESS,
    GETSUCCESS,
    AUTHSUCCESS,
    NOTFOUND,
    CUSTOMRESPONSE,
    INVALIDRESPONSE,
    ALREADYEXISTREPONSE,
    FORBIDDENRESPONSE,
};