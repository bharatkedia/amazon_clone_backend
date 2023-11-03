const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./router/auth_router");

const app = express();
const PORT = 3000;
const DBUrl = `mongodb+srv://bharatkedia123:Bharat0501@amazonclone.kcft0fy.mongodb.net/?retryWrites=true&w=majority`;

app.use(express.json())
app.use(authRouter);


mongoose.connect(DBUrl).then(() => {
  console.log(`Database connected Successfully`);
}).catch((e) => {
  console.log(e);
})

app.listen(PORT, () => {
  console.log(`Application is running on ${PORT}`);
})