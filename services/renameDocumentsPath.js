var path =require("path");
var mkdirp =require("mkdirp");
var shell = require("shelljs");
var Promise= require("bluebird");
module.exports= function(oldPath, newPath){
    console.log("called rename()")
    oldPath=path.join(__dirname, "..", "documents", "bka" , oldPath);
    newPath=path.join(__dirname, "..", "documents", "bka" , newPath);
    
    console.log(oldPath);
    console.log(newPath);
    
    var oldArr= oldPath.split("/");
    var newArr= newPath.split("/");     
    var np="";
    var op="";
    console.log("old path:    "+oldArr);
    console.log("new path:    "+newArr);
    
      var createDir=(path)=>{
        return new Promise((resolve)=>{
            mkdirp(path, (err)=>{
                if (err) throw err
                resolve(path);
            });
        });
    }
    
    var copy =(from, to)=>{
        return new Promise((resolve)=>{
            shell.cp("-R",path.join(from+"/")+"*", to);
            resolve();
        });
    }
    var rm= (path)=>{
        return new Promise((resolve)=>{
             shell.rm("-R", path);
            resolve();
        });
    }
    
    var sortiere= ()=>{
        return new Promise((resolve, reject)=>{
          var results=[]
        
            for( var i=0; i<oldArr.length; i++){
                op += oldArr[i]+"/";
                np += newArr[i]+"/";
                if(oldArr[i]!= newArr[i]){
                    var result={}
                    result.from=op;
                    result.to=np;
                    results.push(result);
                }    
            }
            resolve(results)
        });
    }
    
    sortiere().then((results)=>{
        console.log(results);
       createDir(results[results.length-1].to)
        .then(()=>{ copy(results[results.length-1].from, results[results.length-1].to)
            .then(()=>{rm(results[0].from).then(()=>{
                results.pop();
                });
            });
        }); 
    });
    
    
}