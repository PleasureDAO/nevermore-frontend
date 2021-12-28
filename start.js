var process = require("child_process")
process.exec('npm start',function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});