export function success(statusCode,result){
    return{
        status:"ok",
        statusCode,
        result
    }
}

export function error(statusCode,message){
    return{
        status:"error",
        statusCode,
        message
    }
}