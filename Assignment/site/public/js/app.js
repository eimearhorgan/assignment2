function pd( func ) {
  return function( event ) {
    event.preventDefault()
    func && func(event)
  }
}

document.ontouchmove = pd()

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  escape:      /\{\{-(.+?)\}\}/g,
  evaluate:    /\{\{=(.+?)\}\}/g
};

var AppRouter = Backbone.Router.extend({
	routes : {
		'playerprofile': 'playerprofile',
		'team': 'showToTeamList',
	},

	playerprofile : function() { 
	    var self = this
		_.bindAll(self)
        
		},
	
	showToTeamList : function() { 
	    var self = this
		_.bindAll(self)
		},
})

var i = 0

var app = {
  model: {},
  view: {},
  tabs: {
   home:    { index:i++, icon:'home_24', },
	team:  { index:i++, icon:'man_24', },
	fixtures:   { index:i++, icon:'pencil_24',}, 
    table:  { index:i++, icon:'book_24', },
    more: { index:i++, icon:'plus_24', },
  },
  platform: /Android/.test(navigator.userAgent)?'android':'ios',
  initialtab: 'home'
}

console.log(app)


var bb = {
  model: {},
  view: {},
  social: [{name:'twitter'},{name:'facebook'}]
}


bb.init = function() {

  bb.model.State = Backbone.Model.extend({    
    defaults: {
      current: 'none'
    },
    
  })
  
  var scrollContent = {
    scroll: function() {
      var self = this
      setTimeout( function() {
        if( self.scroller ) {
          self.scroller.refresh()
        } else {
          self.scroller = new iScroll( $("div[data-role='content']")[0] )
        }
      },1)
    }}
  
 

bb.model.Item = Backbone.Model.extend(_.extend({    
    defaults: {
      text: '',
      weight: '',
      height: '',
      position: '',
      DOB: '',
     },
    initialize: function() {
      var self = this
      _.bindAll(self)
    },
		
		toggle : function() {
			this.save({
				checked : !this.get("checked")
				
			});
		}

  }))  
  
bb.model.Items = Backbone.Collection.extend(_.extend({    
    model: bb.model.Item,
	url: '/api/rest/todo',

    initialize: function() {
      var self = this
      _.bindAll(self)
      self.count = 0
      self.on('reset',function() {
        self.count = self.length
      })
    },

	additem: function(text, weight, height, position, DOB) {
      var self = this
      var item = new bb.model.Item({
        text : text,
		weight : weight,
		height: height,
		position : position,
		DOB : DOB,
		
      })
      self.count++
	  self.add(item)
      item.save() 
	}

  }))

     bb.view.Head = Backbone.View.extend(_.extend({    
    events: {
		'tap #cancel': function(){ 
		var self = this
		_.bindAll(self)
		self.hideAddItem()
		},
		
		'tap #add': function(){ 
		var self = this
		_.bindAll(self)
		self.setElement("div[id='main']")
		self.elem = {
		
			add : self.$el.find('#add'),
			cancel : self.$el.find('#cancel'),
			newitem : self.$el.find('#newitem'),
			newitemtext : self.$el.find('#newitemtext'),
			weight : self.$el.find('#weight'),
			height : self.$el.find('#height'),
			position : self.$el.find('#position'),
			DOB : self.$el.find('#DOB'),
			save : self.$el.find('#save'),
			
			}
			
		self.showAddItem()
		},
	  
				
		'tap #newitemtext' : function() {
			var self = this
			_.bindAll(self)
			$('#newitemtext').focus();
		},
		
		'tap #weight' : function() {
			var self = this
			_.bindAll(self)
			$('#weight').focus();
		},
		
		'tap #height' : function() {
			var self = this
			_.bindAll(self)
			$('#height').focus();
		},
		
		'tap #position' : function() {
			var self = this
			_.bindAll(self)
			$('#position').focus();
		},
		
		'tap #DOB' : function() {
			var self = this
			_.bindAll(self)
			$('#DOB').focus();
		},
		
		'tap #save' : function() {
			var self = this
				_.bindAll(self)
			self.setElement("div[id='main']")
			self.elem = {
				newitemtext : self.$el.find('#newitemtext'),
				add : self.$el.find('#add'),
				cancel : self.$el.find('cancel'),
				weight : self.$el.find('#weight'),
			    height : self.$el.find('#height'),
			    position : self.$el.find('#position'),
				DOB : self.$el.find('#DOB'),
                newitem : self.$el.find('#newitem')				
			}
		var text = self.elem.newitemtext.val()
		var weight = self.elem.weight.val()
		var height = self.elem.height.val()
		var position = self.elem.position.val()
		var DOB = self.elem.DOB.val()
				
		if(0 == text.length) {
			return
			}
		self.items.additem(text, weight, height, position, DOB)
		self.hideAddItem()
		},
		
		'tabchange #tab_home': function(){ 
		var self = this
		_.bindAll(self)
		self.hideAddButton()
		}
    },

    initialize: function( items ) {
		var self = this
		_.bindAll(self)
		self.items = items
		self.setElement("div[data-role='header']")
		self.elem = {
			add: self.$el.find('#add'),
			title: self.$el.find('h1')
      }
      
		self.tm = {
			title: _.template( self.elem.title.html() )
      }

    },

    render: function() {
	
      var self = this
      _.bindAll(self)
      self.setElement("div[data-role='header']")      
	  			self.elem = {
				add : self.$el.find('#add'),
				title : self.$el.find('#titlebar')
			}
      var loaded = 'loaded' == app.model.state.get('items')
      self.elem.title.html( self.tm.title({
        title: loaded ? self.items.length+' Items' : 'Loading...'
      }) )

      if( loaded ) {
        self.elem.add.show()
      }
    },
	
	showAddItem: function(){
		$('#add').hide();
		$('#cancel').show();
		$('#newitem').slideDown();
		$('#newitemtext').focus();
	},

	hideAddItem: function(){
		$('#add').show();
		$('#cancel').hide();
		$('#newitem').slideUp();
		$('#newitemtext').val('').blur()	
	},
	
	hideAddButton: function (){
		$('#add').hide()
	},
	
	
}))
   bb.view.SocialMsg = Backbone.View.extend({    
    initialize: function( items ) {
      var self = this
      _.bindAll(self)

      self.elem = {msg:{}}
      app.social.forEach(function(service){
        self.elem.msg[service.name] = $('#social_msg_'+service.name)
        self.elem.msg[service.name].tap(function(){
          self.socialmsg(service)
        })
      })

      app.model.state.on('change:user',self.render)
    },

    render: function() {
      var self = this

      var user = app.model.state.get('user')
      app.social.forEach(function(service){
        var btn = self.elem.msg[service.name].show()

        if( user && user.service === service.name ) {
          btn.show()
        }
        else {
          btn.hide()
        }
      })
    },

    socialmsg: function( service ) {
      console.log(service.name)

      var death = app.model.state.get('death')

      http.post('/user/socialmsg/'+death.getTime(),{},function(res){
        alert( res.ok ? 'Message sent!' : 'Unable to send message.')
      })
    }
  })
  
  bb.view.Navigation = Backbone.View.extend({    
    initialize: function( items ) {
      var self = this
      _.bindAll(self)

      self.elem = {
        header: $("#header"),
        footer: $("#footer")
      }

      self.elem.header.css({zIndex:1000})
      self.elem.footer.css({zIndex:1000})

      function handletab(tabname) {
        return function(){
          app.model.state.set({current:tabname})
        }
      }

      var tabindex = 0
      for( var tabname in app.tabs ) {
        console.log(tabname)
        $("#tab_"+tabname).tap(handletab(tabname))
      }

      app.scrollheight = window.innerHeight - self.elem.header.height() - self.elem.footer.height()
      if( 'android' == app.platform ) {
        app.scrollheight += self.elem.header.height()
      }
    },

    render: function() {
    }
  })


  bb.view.Content = Backbone.View.extend({    
    initialize: function( initialtab ) {
      var self = this
      _.bindAll(self)

      self.current = initialtab
      self.scrollers = {}

      app.model.state.on('change:current',self.tabchange)

      window.onresize = function() {
        self.render()
      }

      app.model.state.on('scroll-refresh',function(){
        self.render()
      })
    },

    render: function() {
      var self = this

      app.view[self.current] && app.view[self.current].render()

      var content = $("#content_"+self.current)
      if( !self.scrollers[self.current] ) {
        self.scrollers[self.current] = new iScroll("content_"+self.current)      
      }

      content.height( app.scrollheight ) 

      setTimeout( function() {
        self.scrollers[self.current].refresh()
      },300 )
    },

    tabchange: function() {
      var self = this

      var previous = self.current
      var current = app.model.state.get('current')
      console.log( 'tabchange prev='+previous+' cur='+current)

      $("#content_"+previous).hide().removeClass('leftin').removeClass('rightin')
      $("#content_"+current).show().addClass( app.tabs[previous].index <= app.tabs[current].index ?'leftin':'rightin')
      self.current = current

      self.render()
    }
  })


  bb.view.home = Backbone.View.extend({
    initialize: function() {
      var self = this
      _.bindAll(self)
	}
    
  })
  

  bb.view.List = Backbone.View.extend(_.extend({    
    initialize: function( items ) {
    var self = this
    _.bindAll(self)
    self.setElement('#list')
    self.items = items
    self.items.on('destroy',self.render)
	self.items.on('sync', self.appenditem)	
	self.items.on('fetch',self.render)
    },
    render: function() {
      var self = this
      self.$el.empty()
      self.items.each(function(item){
        self.appenditem(item)
		})
		return this;
	},
    appenditem: function(item) {
      var self = this
      var itemview = new bb.view.Item({
        model: item
      })    
	  self.$el.append(itemview.el)
	  self.scroll()
    }
  },scrollContent))

  bb.view.Item = Backbone.View.extend(_.extend({    
    events: {
		'tap .delete-item' : function() {
		var self = this
		_.bindAll(self)
		var itemdata = self.model.attributes
		self.model.destroy()
		},

		'swiperight .tm' : function() {
			var self = this
			_.bindAll(self)
			var itemdata = self.model.attributes
			app.model.items.each(function(item){
				$('#rm_' + item.attributes.id).hide()
			})
			$('#rm_' + itemdata.id).show()
		},
		
		'swipeleft .tm' : function() {
			var self = this
			_.bindAll(self)
			var itemdata = self.model.attributes
			$('#rm_' + itemdata.id).hide()
		}
    },

    initialize: function() {
      var self = this
      _.bindAll(self)
      self.render()
    },

	render: function() {
      var self = this
      var html = self.tm.item( self.model.toJSON() )
      self.$el.append( html ) 
    }
  },{
    tm: {
      item: _.template( $('#list').html() )
    }
  }))


  bb.view.fixtures = Backbone.View.extend({
    initialize: function() {
      var self = this
      _.bindAll(self)

      self.elem = {
      }
      
    },
    
    render: function() {
    }
  })

  bb.view.table = Backbone.View.extend({
    initialize: function() {
      var self = this
      _.bindAll(self)

      self.elem = {
      }
    },
    render: function() {
    }
  })

  bb.view.more = Backbone.View.extend({
    initialize: function() {
      var self = this
      _.bindAll(self)

      self.elem = {
      }
    },
    render: function() {
    }
  })
  
  /* new page for details playerprofile = Lists */ 
 bb.view.playerprofile = Backbone.View.extend(_.extend({    
    initialize: function( items ) {
    var self = this
    _.bindAll(self)
    self.setElement('#playerprofile')
    self.items = items
    self.items.on('destroy',self.render)
	self.items.on('sync', self.appenditem)	
	self.items.on('fetch',self.render)
    },


    render: function() {
      var self = this
      self.$el.empty()
      self.items.each(function(PlayerItem){
        self.appenditem(PlayerItem)
		})
		return this;
	},


    appenditem: function(PlayerItem) {
      var self = this
      var itemview = new bb.view.PlayerItem({
        model: PlayerItem
      })    
	  self.$el.append(itemview.el)
	  self.scroll()
    }

  },scrollContent))
  
 bb.viewPlayerItem = Backbone.View.extend(_.extend({    
    events: {
			
		'tap .delete-item' : function() {
		var self = this
		_.bindAll(self)
		var itemdata = self.model.attributes
		self.model.destroy()
		},

		'swiperight .tm' : function() {
			var self = this
			_.bindAll(self)
			var itemdata = self.model.attributes
			app.model.items.each(function(item){
				$('#rm_' + item.attributes.id).hide()
			})
			$('#rm_' + itemdata.id).show()
		},
		'swipeleft .tm' : function() {
			var self = this
			_.bindAll(self)
			var itemdata = self.model.attributes
			$('#rm_' + itemdata.id).hide()
		}
    },

    initialize: function() {
      var self = this
      _.bindAll(self)
      self.render()
    },

	render: function() {
      var self = this
      var html = self.tm.item( self.model.toJSON() )
      self.$el.append( html ) 
    }
  },{
    tm: {
      item: _.template( $('#playerprofile').html() )
    }
  }))
  
  /*FAQ*/
   bb.view.FAQ = Backbone.View.extend()
   
   /*ContactUs*/
   bb.view.ContactUs = Backbone.View.extend()
   
   /*AboutTagTastic*/
   bb.view.AboutTagTastic = Backbone.View.extend()
   
   /*Terms*/
   bb.view.Terms = Backbone.View.extend()
}

app.init_browser = function() {
  if( browser.android ) {
    $("#main div[data-role='content']").css({
      bottom: 0
    })
  }
}

app.boot = function() {
  document.ontouchmove = function(e){ e.preventDefault(); }
  $( '#main' ).live( 'pagebeforecreate',function(){
    app.boot_platform()
  })
}

app.boot_platform = function() {
  if( 'android' == app.platform ) {
    $('#header').hide()
    $('#footer').attr({'data-role':'header'})
    $('#content').css({'margin-top':59})
  }
}

app.init_platform = function() {
  if( 'android' == app.platform ) {
    $('li span.ui-icon').css({'margin-top':-4})
  }
}

app.start = function() {
  $("#tab_"+app.initialtab).tap()
}

app.erroralert = function( error ) {
  alert(error)
}


app.init = function() {
  console.log('start init')

  app.init_platform()

  bb.init()

  app.model.state = new bb.model.State()
  app.model.items = new bb.model.Items()
  
  app.view.head = new bb.view.Head(app.model.items)
  app.view.head.render()
  
  app.view.list = new bb.view.List(app.model.items)
  app.view.list.render()
  
  /* new code */
  app.view.list = new bb.view.List(app.model.items)
  app.view.list.render()
  /* end new code */
  
  app.view.navigation = new bb.view.Navigation(app.initialtab)
  app.view.navigation.render()

  app.view.content = new bb.view.Content(app.initialtab)
  app.view.content.render()
  

   
   app.view.home    = new bb.view.home()
	/*app.view.team   = new bb.view.team()*/
	app.view.table  = new bb.view.table()
	app.view.more = new bb.view.more()
  
  
  app.myToDoRouter = new AppRouter();

  app.model.items.fetch( {
    success: function() {
      app.model.state.set({items:'loaded'})
      app.view.list.render()
    }
  })
  
  app.model.PlayerItem.fetch( {
    success: function() {
      app.model.state.set({items:'loaded'})
      app.view.list.render()
    }
  })
  app.start()

  console.log('end init')
}


app.boot()
$(app.init)
