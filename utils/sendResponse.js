
const sendResponse = (res ,success ,  data , statusCode=200,) => {
    if(success){
        return res.status(statusCode).json({
            success: true,
            data
        })
    }else{
        return res.status(statusCode).json({
            success: false,
            message: data
        })
    }
};

module.exports = sendResponse;