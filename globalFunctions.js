const fs = require("fs")
const AWS = require('aws-sdk')
const path = require('path');


const avaiblesFileTypes = ['jpeg','jpg','gif','mp4','png']

validatePhone = function(phone){
    //validatePhone for validating the phoneNumber
    let re = /^(\+\d{3})?\d{10}$/;
    return re.test(phone.replace(/\s+/g, ''));
}

validateEmail = function(email){
    //validateEmail for validating the email
     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(email);
}



generateRandomString = function (length = 20) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

generateVerificationCode = function(min = 1000, max = 9999) {
  return 1234;
  return Math.floor(Math.random() * (max - min) + min);
}

TE = function (err, code,log) {
  // TE stands for Throw Error, showing error in development mode only
  let _err;
  switch (true) {
    case typeof err.code === "number" && err.code === 11000:
      _err = "Record already exist.";
      break;
    default:
      _err = err;
      break;
  }
  if (process.env.NODE_ENV === "development") {
    console.error(log)
  }
  throw new Error(_err,code);
};

ReE = function (res, err, code, log) {
  // Error Web Response
  //showing log in development mode only
  if (process.env.NODE_ENV === "development") {
    console.error(`Error logged from API :${log}`);
  }
  let send_data = { success: false };
  if (typeof code !== "undefined") res.statusCode = code;

  if (err instanceof Error && typeof err.message != "undefined") {
    err = err.message;
  } else {
    send_data = { ...send_data, ...err }; //merge the objects
    return res.json(send_data);
  }

  return res.json({ success: false, message: err },code);
};

ReS = function (res, data, code) {
  // Success Web Response
  let send_data = { success: true };
  if (typeof data === "object") {
    send_data = Object.assign(data, send_data); //merge the objects
  }

  if (typeof code !== "undefined") res.statusCode = code;

  return res.json(send_data);
};




ImageUpload = async (file) => {
    let [base,ext] = getExtensions(file.originalFilename)
    if(!avaiblesFileTypes.includes(ext)){
      throw new Error({error:"File Type ."+ext+" is not supported"})
    }

    // Read in the file, convert it to base64, store to S3
    s3 = new AWS.S3({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.ACCESS_SECRET_KEY,
    });
    return await s3.upload({
        Bucket: process.env.BUCKET_NAME,
        Key: generateRandomString()+path.extname( file.path ),
        Body: fs.createReadStream(file.path),
        ACL: 'public-read',
    }).promise();
};

ImageMultipleUpdate = async(files) => {
  let responseData = []
  await Promise.all(files.map(async (file) => {
    let fileStore = await ImageUpload(file)
    responseData.push([fileStore.Location,getExtensions(file.originalFilename)[1]])
  }));
  return responseData
}

getExtensions = (name) => {
  name = name.trim()
  const match = name.match(/^(\.+)/)
  let prefix = ''
  if (match) {
    prefix = match[0]
    name = name.replace(prefix, '')
  }
  const index = name.indexOf('.')
  const ext = name.substring(index + 1)
  const base = name.substring(0, index) || ext
  return [prefix + base, base === ext ? '' : ext]
}