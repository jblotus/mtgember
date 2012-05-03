var App = Em.Application.create();

App.Card = Em.Object.extend({
  name: '',
  tapped: false
});

App.Cards = Em.Object.create({
  cards:  [],
  shuffle : function() { 
    var o = this.get('cards');
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    this.set('cards', o);
  }
});
 

App.PlayMatView = Em.View.extend({
  id: 'playmat'
});

App.cardsController = Ember.ArrayController.create({

  contentBinding: 'App.Cards.cards',

  refresh: function() {
    App.Cards.set('cards', [
      App.Card.create({ name: 'Grizzly Bears', img_src: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129586&type=card', type: 'creature',  power: 2, toughness: 2, tapped: true }),
      App.Card.create({ name: 'Gravecrawler', img_src: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=222902&type=card', type: 'creature',  power: 2, toughness: 1 })
    ]);

    return this;
  },

  shuffle: function() {
    App.Cards.shuffle();
  }
});

Handlebars.registerHelper('ifCreature', function(type, options) {
  if (Em.getPath(this, type) === 'creature') {
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

App.cardsController.refresh().shuffle();