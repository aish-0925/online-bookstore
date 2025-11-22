const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const path=require('path');
const bookRoutes=require('./routes/book.routes');
const errorHandler=require('./middlewares/errorHandler');
const app=express();
//small middlewares
app.use(cors());
app.use(bodyParser.json());
//serve book cover images from frontend/public/book-covers if needed
//adjust path if you serve images from backend/public or elsewhere
app.use('/book-covers',express.static(path.join(__dirname, '..', '..', 'frontend', 'public', 'book-covers')));
//mount API routes under/api
app.use('/api', bookRoutes);
//health check
app.get('/health',(req, res)=>res.json({status:'ok'}));
//error handler
app.use(errorHandler);
module.exports = app;
