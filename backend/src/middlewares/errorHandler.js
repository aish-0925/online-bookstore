//final catch-all Express error middleware
//It logs error to the console and returns a JSON message to the client
function errorHandler(err,req,res,next) 
{
  console.error('Server error:',err&&err.stack?err.stack:err);
  const status=err.status||500;
  const message=err.message||'Internal server error';
  res.status(status).json({ error: message });
}
module.exports = errorHandler;
