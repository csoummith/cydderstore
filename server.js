const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient
 var db;
 var s;
 MongoClient.connect('mongodb://localhost:27017/inventory',(err,database)=>{
   if(err)return console.log(err)
   db=database.db('inventory')
   app.listen(5000,()=>{
     console.log('listining at port 5000')
   })
 })
 app.set('view engine','ejs')
 app.use(bodyParser.urlencoded({extended:true}))
 app.use(bodyParser.json())
 app.use(express.static('public'))

 app.get('/',(req,res) =>{
     db.collection('cydder').find().toArray((err,result)=>{
         if(err) return console.log(err)
     res.render('Home.ejs', {data:result})
     })
 })


 app.get('/create', (req,res)=>{
     res.render('add.ejs')
 })

 app.get('/updatestock', (req,res)=>{
     res.render('updatenew.ejs')
 })

 app.get('/deleteproduct', (req,res)=>{
     res.render('deleteold.ejs')
 })

 app.post('/AddData',(req,res)=>{
     db.collection('cydder').save(req.body,(err,result)=>{
         if(err) return console.log(err)

   res.redirect('/')
     })
 })

 app.post('/update',(req,res)=>{
    db.collection('cydder').find().toArray((err,result)=>{
        if(err)
          return console.log(err)
        for(var i=0;i<result.length;i++)
        {
            if(result[i].PID==req.body.PID)
            {
                s=result[i].PSTOCK
                break
            }
        }
       db.collection('cydder').findOneAndUpdate({PID: req.body.PID},{
         $set:{PSTOCK:parseInt(s)+parseInt(req.body.PSTOCK)}}, {sort:{_id:-1}},
         (err,result)=>{
             if(err)
                 return res.send(err)
             console.log(req.body.id+'stock is updated')
             res.redirect('/')
         })
    })
 })

 app.post('/delete',(req,res)=>{
     db.collection('cydder').findOneAndDelete({PID :req.body.PID}, (err,result)=>{
         if(err)
           return console.log(err)
         res.redirect('/')
     })
 })
