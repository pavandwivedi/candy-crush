export function success(statusCode,result,res){
    return{
        status:"ok",
        statusCode,
        result,
        res
    }
}

export function error(statusCode,message,res){
    return{
        status :"error",
        statusCode,
        message,
        res
    }
}