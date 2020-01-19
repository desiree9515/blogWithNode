const password = "admin"

if(process.env.NODE_ENV == "production") {
    module.exports = {mongoURI: "mongodb+srv://adminDesiree:"+password+"@myblognode-yvdew.mongodb.net/test?retryWrites=true&w=majority"}
} else {
    module.exports = {mongoURI: "mongodb://localhost/myBlogNode"}
}

console.log(password);