var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var gameSchema = new Schema({

    name : {type:'string'},

    ticket: { type: [{
        user : {type:'string'},
        ticket: {type:[]}
    }] },

    picked: { type: [] },

    createdAt: { type: 'date',default:Date.now() },

    updatedAt: { type: 'date',default:Date.now() }
    
});

var Game = mongoose.model('game', gameSchema);

// make this available to our users in our Node applications
module.exports = Game;