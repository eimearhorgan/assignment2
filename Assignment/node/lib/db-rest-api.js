
// API implementation

var common = require('./common')

var uuid    = common.uuid
var mongodb = common.mongodb

var todocoll = null

var util = {}

util.validate = function( input ) {
  return input.text
}

util.fixid = function( doc ) {
  if( doc._id ) {
    doc.id = doc._id.toString()
    delete doc._id
  }
  else if( doc.id ) {
    doc._id = new mongodb.ObjectID(doc.id)
    delete doc.id
  }
  return doc
}


exports.ping = function( req, res ) {
  var output = {ok:true,time:new Date()}
  res.sendjson$( output )
}


exports.echo = function( req, res ) {
  var output = req.query

  if( 'POST' == req.method ) {
    output = req.body
  }

  res.sendjson$( output )
}


exports.rest = {

  create: function( req, res ) {
    var input = req.body
    
    if( !util.validate(input) ) {
      return res.send$(400, 'invalid')
    }

    var todo = {
      text: input.text,
	  weight: input.weight,
	  height: input.height,
	  position: input.position,
	  DOB: input.DOB,
    }
    

    todocoll.insert(todo, res.err$(function( docs ){
      var output = util.fixid( docs[0] )
      res.sendjson$( output )
    }))
  },


  read: function( req, res ) {
    var input = req.params
    console.log(req.params)
	
    var query = util.fixid( {id:input.id} )
    todocoll.findOne( query, res.err$( function( doc ) {
      if( doc ) {
        var output = util.fixid( doc )
        res.sendjson$( output )
      }
      else {
        res.send$(404,'not found')
      }
    }))
  },
  
  list: function( req, res ) {
    var input = req.query
    var output = []

    var query   = {}
    var options = {sort:[['created','desc']]}

    todocoll.find( query, options, res.err$( function( cursor ) {
      cursor.toArray( res.err$( function( docs ) {
        output = docs
        output.forEach(function(item){
          util.fixid(item)
        })
        res.sendjson$( output )
      }))
    }))
  },
  
   update: function( req, res ) {
    var id    = req.params.id
    var input = req.body
    
    if( !util.validate(input) ) {
      return res.send$(400, 'invalid')
    }
	console.log(input)
    var query = util.fixid( {id:id} )
    todocoll.update( query, {
				$set:{
						text:input.text, 
						weight:input.weight, 
						height: input.height,
						position: input.position,
						DOB: input.DOB
					}}, res.err$( function( count ) {
      if( 0 < count ) {
        var output = util.fixid( doc )
        res.sendjson$( output )
      }
      else {
        console.log('404')
        res.send$(404,'not found')
      }
    }))
  },

   
  del: function( req, res ) {
    var input = req.params

    var query = util.fixid( {id:input.id} )
    todocoll.remove( query, res.err$( function() {
      var output = {}
      res.sendjson$( output )
    }))
  }

}

exports.connect = function(options,callback) {

  var client = new mongodb.Db( options.name, new mongodb.Server(options.server, options.port, {auto_reconnect:true}))
  client.open( function( err, client ) {
    if( err ) return callback(err);

    client.authenticate(options.username,options.password,function(err){
      if( err ) return callback(err);
		})
    client.collection( 'todo', function( err, collection ) {
      if( err ) return callback(err);

      todocoll = collection
      callback()
    })
  })
}

/* Twitter Facebook  putting in comments as cause error
var twitter    = common.twitter
var facebook   = common.facebook
var config = common.config

var send_social_msg = {
  twitter: function(user, msg, callback) {
    var conf = {
      consumer_key: config.twitter.key,
      consumer_secret: config.twitter.secret,
      access_token_key: user.key,
      access_token_secret: user.secret
    }
    var twit = new twitter(conf)
        
    var start = new Date()
    twit.updateStatus(msg, function (data) {
      var end = new Date()
      var dur = end.getTime()-start.getTime()
      console.log( 'twitter tweet:'+dur+', '+JSON.stringify(data) )
      callback( data.created_at )
    })
  },

  facebook: function(user, msg, callback) {
    var start = new Date()

    var facebook_client = new facebook.FacebookClient(
      config.facebook.key,
      config.facebook.secret
    )

    facebook_client.getSessionByAccessToken( user.key )(function(facebook_session) {
      facebook_session.graphCall("/me/feed", {message:msg}, 'POST')(function(result) {
        var end = new Date()
        var dur = end.getTime()-start.getTime()
        console.log( 'facebook post:'+dur+', '+JSON.stringify(result))
        callback(!result.error)
      })
    })
  }
}


exports.get_user = function( req, res, next ) {
  var clean_user = {}

  if( req.user ) {
    clean_user.id       = req.user.id
    clean_user.username = req.user.username
    clean_user.service  = req.user.service
  }

  common.util.sendjson(res,clean_user)
}


exports.social_msg = function( req, res, next, when ) {
  var user = req.user
  if( !user ) return common.util.sendcode(400);
  
  if( user.service ) {
    var d = new Date( parseInt(when,10) )

    send_social_msg[user.service]( 
      user, 
      'Burning out on '+d+'! Better get back to work... ', 
      function(ok) {
        common.util.sendjson(res,{ok:ok})
      }
    )
  }
}
*/