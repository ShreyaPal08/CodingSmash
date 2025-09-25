const validator=require("validator");


const validate=(data)=>{

    const mandatoryField=['firstName','emailId','password'];

    const IsAllowed=mandatoryField.every((k)=>Object.keys(data).includes(k));

    if(!IsAllowed)
        throw new Error("Some Field is Missing");

    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");

    if(!validator.isStrongPassword(data.password))
        throw new Error ("Week Password");
    if (!data.firstName || data.firstName.trim().length < 3)
        throw new Error("First name must be at least 3 characters long");


}

module.exports=validate;