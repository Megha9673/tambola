const express = require('express')
const app = express()
const tambola = require('tambola-generator');
const Game = require('./model/game')
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const ejs = require('ejs')

app.set("view engine","ejs")

// Connect to the db
const db = "mongodb://meghamegha:<password>@ds125502.mlab.com:25502/docappointment"
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.get('/api/game/create',(req,res)=>{
    console.log('ppp')
    let data = {name:'new_game'}
    Game.create(data,(err,created)=>{
        console.log(err)
        if(err) res.json('error')
        else res.json('created game:'+created.id)
    })
})

app.get('/api/game/:game_id/ticket/:user_name/generate',(req,res)=>{
    Game.findOne({_id:req.params.game_id},(err,game)=>{
        Game.update({_id:game._id},{$push:{ticket:{ticket:tambola.getTickets(1)[0],user:req.params.user_name}}},(err,updated)=>{
            if(err) res.json('error')
            else res.json('New ticket created:'+game.ticket[game.ticket.length-1]._id)
        })
        
    })
})

app.get('/api/ticket/:ticket_id',(req,res)=>{
    Game.findOne({},(err,game)=>{
        if(err) res.json('No game found')
        else{
            let arr =game.ticket.filter((e)=>{return e._id+""==req.params.ticket_id})[0].ticket
            console.log(arr)
            //let arr= game.ticket[0].ticket
            res.render("table",{numbers:arr})
        }
    })
})

app.get('/api/game/:game_id/number/random',(req,res)=>{
    Game.findOne({_id:req.params.game_id},(err,game)=>{
        if(err) res.json('No game found')
        else{
            let num = Math.floor((Math.random() * 100) + 1)
            game.picked.push(num)
            Game.update({_id:game._id},{picked:game.picked},(err,updated)=>{
                if(err) res.json('error')
                else res.json("Number picked is:"+num)
            })
        }
    })
})

app.get('/api/game/:game_id/stats',(req,res)=>{
    Game.findOne({_id:req.params.game_id},(err,game)=>{
        console.log(game)
        if(game){
            let data = {
                numbers_drawn : game.picked,
                number_of_users : game.ticket.length,
                number_of_tickets : game.ticket.length
            }
            res.json(data)
        }
        else res.json('No game found')
    })
})

app.get('/api/game/:game_id/numbers',(req,res)=>{
    Game.findOne({_id:req.params.game_id},(err,game)=>{
        if(game) res.json(game.picked)
        else res.json('No game found')
    })
})

var server = require('http').Server(app);
server.listen(5000)
















































