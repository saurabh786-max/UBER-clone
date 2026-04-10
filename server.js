import app from "./app.js";
import connectDB from "./src/db/db.js";


connectDB()
.then(
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(
            `sever is listing on the port :${process.env.PORT}`
        )
    })
)
.catch((err)=>{
    console.log("MONGODB connection failed !!! ",err);
})