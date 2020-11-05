const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(function (req,res,next) {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
})
app.use(express.static(__dirname+'/public'));
app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/views/index.html');
});
app.get('/json',(req,res)=>{
  const message = process.env.MESSAGE_STYLE ='uppercase'? 'HELLO JSON':'hello json';
  res.json({
    "message": message
  })
});
app.get('/now',function (req,res,next) {
  req.time = new Date().toString();
  next();
},function (req,res) {
  res.json({
    time:req.time
  });  
})
app.get('/:word/echo',(req,res)=>{
  const {word} = req.params;
  res.json({echo:word});
});
app.route('/name')
   .get((req,res)=>{
     const {first,last} = req.query;
     res.json({
       first,
       last
     }) 
   })
   .post((req,res)=>{
     res.send(req.body);
   });

app.listen(3000,()=>{
  console.log(`app listening on port 3000!`)
})
