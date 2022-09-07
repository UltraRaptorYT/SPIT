/*
Name: Soh Hong Yu
Class: DAAA/FT/1B/01
Admin No.: P2100775
*/

var db = require("./databaseConfig");
const path = require("path");
const MAXSIZE = 1000000;
const fileType = ["PNG", "JFIF"];
const fileExtensionDict = {
  PNG: "png",
  JFIF: "jpg",
};
//path.join(__dirname,

var imageChecker = {
  checkFile: (file, name) => {
    // check file type and size
    var fileType = imageChecker.checkType(file);
    if (fileType && imageChecker.checkSize(file)) {
      var fileDirectory = path.join("./", "img/", file.name);
      var fileDirectoryArr = fileDirectory.split(".");
      if (fileDirectoryArr[fileDirectoryArr.length - 1] != fileType) {
        fileDirectoryArr.pop();
        fileDirectoryArr.push(fileType); // Change file type back to original as user might have change the extension
      }
      fileDirectoryArr[fileDirectoryArr.length - 2] = fileDirectoryArr[
        fileDirectoryArr.length - 2
      ].concat("_" + name.replace(" ", "_")); //replace spaces in names
      fileDirectory = fileDirectoryArr.join(".");
      file.mv(fileDirectory); // move file to image
      return "./" + fileDirectory.replace("\\", "/"); // return file path
    }
    return ""; // return empty string if invalid image or no image
  },
  checkType: (file) => {
    var decoded = file.data.toString("utf-8", 0, 16); // decoding file
    var inFile = false;
    for (i in fileType) {
      if (decoded.search(fileType[i]) != -1) {
        inFile = true;
        var fileExtension = fileExtensionDict[fileType[i]];
      }
    }
    // Ensure all file types that are valid are checked
    if (inFile) {
      return fileExtension;
    } else {
      return inFile;
    }
  },
  checkSize: (file) => {
    var fileSize = file.size; // get file size
    if (fileSize < MAXSIZE) {
      return true;
    }
    return false;
  },
};

module.exports = imageChecker;
