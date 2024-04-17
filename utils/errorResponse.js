const errorResponse = (res, error) => {
    let statusCode = 500; // Internal Server Error by default
    let message = "Something went wrong.Please try again later.";

    if (error.code) {
        switch (error.code) {
            case '23505': // Unique violation code
                statusCode = 400; // Bad Request
                message = 'Already exists. Please provide a unique value.';
                break;
            case '22P02': // Invalid text representation
                statusCode = 400; // Bad Request
                message = 'Invalid input. Please provide valid data.';
                break;
            // Add more cases for other common error codes as needed
            default : 
                statusCode = 500; // Bad Request default
                message = "Something went wrong. Please try again later.";
        }
    }

    return res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorResponse;
