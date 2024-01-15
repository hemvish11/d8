// module.exports.getDate=getDate; //do not use parenthesis otherwise it will immediately call the function

exports.getDate=function (){
    const today=new Date();
    const options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    //"en-US" for english
    return today.toLocaleDateString("hi-IN",options);
}

exports.getDay=function (){
    const today=new Date();
    const options={
        weekday:"long"        
    };
    //"en-US" for english
    return today.toLocaleDateString("hi-IN",options);
}

