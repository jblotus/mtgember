var Em = window.Em;
var App = window.App;
var Handlebars = window.Handlebars;

App = Em.Application.create({
  ready: function() {
    App.gameState = App.GameState.create();
    this._super();
  }
});

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

  cards: [],

  init: function() {

    var cards = cardStub;

    cards = cards.map(function(item) {
      return App.Card.create(item);
    });

    this.set('cards', cards);
  },

  shuffle: function() {
    var o = this.get('cards');
    for (var j, x, i = o.length; i;) {
      j = parseInt(Math.random() * i, 10);
      x = o[--i];
      o[i] = o[j];
      o[j] = x;
    }
    this.set('cards', o);
  }
});

App.Hand = Em.Object.create({

  cards: [],

  drawCard: function() {
    var cards = App.Library.get('cards');
    if (cards.length === 0) {
      alert('lost game');
      return;
    }

    var card = cards.popObject();

    this.get('cards').pushObject(card);
  }
});

App.phasesController = Em.ArrayController.create({
  content: [
    'Untap step', 'Upkeep step', 'Draw step',
    'Main',
    'Beginning of Combat', 'Declare Attackers', 'Declare blocks', 'Combat Damage', 'End of Combat',
    'Main',
    'End Step',
    'Cleanup'
  ]
});

App.PhasesView = Em.View.extend({
  templateName: 'phases'
});


App.PlayMatView = Em.View.extend({
  templateName: 'playmat',
  id: 'playmat'
});

App.LibraryView = Em.View.extend({
  templateName: 'library',
  id: 'library',
  drawCard: function() {
    App.handController.drawCard();
  }
});

App.libraryController = Em.ArrayController.create({

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

App.handController = Em.ArrayController.create({
  contentBinding: 'App.Hand.cards',
  drawCard: function() {
    App.Hand.drawCard();
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
  templateName: 'start',
  startGame: function() {
    App.gameState.goToState('playing');
  }
});

App.TurnState = Em.StateManager.extend({
  enableLogging: true,
  initialState: 'draw',
  draw: Em.State.create({
    enter: function() {
      App.handController.drawCard();
    }
  })
});

App.GameState = Em.StateManager.extend({
  enableLogging: true,
  initialState: 'stopped',
  stopped: Em.State.create({
    enter: function() {
      App.startView = App.StartView.create({});
      App.startView.append();
    },
    exit: function() {
      App.startView.remove();
    }
  }),
  playing: Em.State.create({
    enter: function() {
      App.playMatView = App.PlayMatView.create({});
      App.playMatView.append();
      App.turnState = App.TurnState.create({});
    },
    exit: function() {
      App.playMatView.remove();
    }
  })
});
