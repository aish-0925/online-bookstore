require('dotenv').config(); //load variables from backend/.env
const app=require('./app');
const PORT=process.env.PORT || 4000;
app.listen(PORT,()=>
{
  console.log(`Backend started:http://localhost:${PORT}`);
}
);
