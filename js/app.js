var App = Em.Application.create();

App.Card = Em.Object.extend({
  name: '', 
  img_src: '', 
  type: '',
  subtypes: [],  
  power: null, 
  toughness: null, 
  tapped: false
});

var cardStub = [
  { 
    name: 'Grizzly Bears', 
    img_src: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129586&type=card', 
    type: 'Creature',
    subtypes: ['Bear'],
    power: 2, 
    toughness: 2 
  },

  { 
    name: 'Gravecrawler', 
    img_src: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=222902&type=card', 
    type: 'Creature',
    subtypes: ['Zombie'],
    power: 2, 
    toughness: 1 
  },

  { 
    name: 'Swamp', 
    img_src: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=269627&type=card', 
    type: 'Basic Land',
    subtypes: ['Swamp'],
    power: 2, 
    toughness: 1 
  }
];

App.Library = Em.Object.create({

  cards:  [],

  init: function() {

    var cards = cardStub;

    cards = cards.map(function(item, index, self) {
      return App.Card.create(item);
    });

    this.set('cards', cards);
  },

  shuffle : function() { 
    var o = this.get('cards');
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    this.set('cards', o);
  }
});

App.Hand = Em.Object.create({

  cards:  [],

  draw: function() {
    var card = App.Library.get('cards').popObject();
    this.get('cards').pushObject(card);
  }
});


App.PlayMatView = Em.View.extend({
  templateName: 'playmat',
  id: 'playmat'
});

App.LibraryView = Em.View.extend({
  templateName: 'library',
  id: 'library',
  draw: function() {
    App.handController.draw();
  }
});

App.libraryController = Ember.ArrayController.create({

  contentBinding: 'App.Library.cards',

  init: function() {

    //cards coming from the model now right?
    App.Library.init();

    return this;
  },

  shuffle: function() {
    App.Library.shuffle();
  }
});

App.handController = Ember.ArrayController.create({
  contentBinding: 'App.Hand.cards',
  draw: function(e) {
    App.Hand.draw();
  }
});

Handlebars.registerHelper('ifCreature', function(type, options) {
  if (Em.getPath(this, type) === 'Creature') {
    return options.fn(this);
  }  
});

App.CardView = Em.View.extend({
  templateName: 'card',
  defaultClass: 'card',
  content: null,

  style: function() {
    return 'background: url(' + this.get('content').get('img_src') + ')';
  }.property(),

  toggleTapped: function() {
    
    var content = this.get('content');
    var tapped = content.get('tapped');
    
    return tapped ? content.set('tapped', false) : content.set('tapped', true);
  },

  handle: function() {
    this.toggleTapped();
  }
});


App.StartView = Em.View.extend({
  templateName: 'start'
});

App.gameState = Em.StateManager.create({
  enableLogging: true,
  initialState: 'notPlaying',

  notPlaying: Em.ViewState.create({
    view: App.StartView,

    startGame: function(stateManager, event) {      
      App.PlayMatView.create().appendTo('body');
      stateManager.goToState('playing');
    }
  }),

  playing: Em.State.create({

    initialState: 'beginTurn',

    beginTurn: Ember.State.create({
      
      enter: function(stateManager, transition) {
        App.libraryController.shuffle();
        stateManager.goToState('playing.upkeep');
      }
    }),

    upkeep: Ember.State.create()
  })
});