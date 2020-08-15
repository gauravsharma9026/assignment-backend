const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
var filePath = path.join(__dirname, 'user-data.csv');
var outPath = path.join(__dirname, 'user-data.json');
const { resolve } = require('path');
const { rejects } = require('assert');


exports.csvUpload = async (req, res, next) => {
    try {
        let { filePath } = await uploadFile(req);
        let userArray = await getCSVData(filePath);
        console.log(userArray);
       await User.insertMany(userArray);
        res.status(200).send({ message: "success" })
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: error.message })
    }


}

exports.getUsers = (req, res, next) => {
  const pageSize = +req.query.pagesize; //+is used to read string as numbers in query pARAM
  const currPage = +req.query.page;
  let fetchedDocument = {};
  const userQuery = User.find();
  if(pageSize && currPage)
  {
    userQuery
    .skip(pageSize * (currPage - 1))
    .limit(pageSize);
  }
  userQuery
  .then(documents => {
    fetchedDocument = documents;
    return User.count();
  }).then(count => {
    res.status(200).json({
      message: "users fteched successfully",
      users: fetchedDocument,
      maxUsers: count,
    });
  }).catch(error =>{
    res.status(500).json({
      message: "Fteching users failed"
    });
  });    

}


function uploadFile(req) {
    return new Promise((resolve, reject) => {
        try {
            //file path where the file will be stored -> should be absolute path
            const filePath = `${process.cwd()}/public/uploads/file-${Date.now()}`;
            // create write stream , with w flag , on given path
            let filestream = fs.createWriteStream(filePath, { flags: 'w' });
            /* 
               pipe the readable request stream with binary file to the writable stream
               this will read the file in chuncks and simultanously write file to disk into chunks 
            */
            req.pipe(filestream);

            /*@desc-> event fired on close i.e when file uploaded on disk completely                 */
            filestream.on('close', () => {
                resolve({ filePath })
            });

            /*@desc -> error event  if any error occur in writing the file */
            filestream.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
}

function getCSVData(filePath) {
  try{
    return new Promise((resolve, reject) => {
      var jsonArray = [];
      //This will read the file.
      fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data) {
          if (err) {
              reject(error);
          }
          //The following line will split the csv file line by line and store each of it in the vraiable dataArray.
          var dataArray = data.split("\n");
          //This line helps us to obtain the keys for various values in the file.
          var fieldsArray = dataArray[0].split(",");

          //The following loop creates an object for every line and then pushes it into the array.
          for (var i = 1; i < dataArray.length; i++) {
              var temp = {};
              //contains values which are separated by a comma in a line.
              var valuesArray = dataArray[i].split(",");
              for (var k = 0; k < valuesArray.length; k++) {
                  temp[fieldsArray[k].trim()] = valuesArray[k].trim()
              }
              //pushes the object into the array.
              jsonArray.push(temp);
             // console.log(jsonArray);
          }
          //console.log(jsonArray);
          resolve(jsonArray);
      });
  })
  }catch(e){
    console.log(e);
  }

}