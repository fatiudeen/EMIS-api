import ErrorResponse from '../helpers/ErrorResponse.js'

export default (err, req, res, next)=>{
    let error = {...err}

    error.message = err.message


    if(err.code === 11000) {
        const message = 'Duplicate Field Value'
        error = new ErrorResponse(message, 400)
    }

    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val=>val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        sucess: false,
        error: error.message || 'Server Error'
    })
}

