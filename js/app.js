var App = Em.Application.create();

App.Card = Em.Object.extend({
  name: '',
  tapped: false
});
 

App.PlayMatView = Em.View.extend({
  id: 'playmat',
  contentBinding: 'App.cardsController.content'
});

App.cardsController = Ember.Object.create({
  content: Ember.Object.create({
    cards : [
     App.Card.create({ name: 'Grizzly Bears', img_src: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129586&type=card', type: 'creature',  power: 2, toughness: 2, tapped: true }),
     App.Card.create({ name: 'Gravecrawler', img_src: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=222902&type=card', type: 'creature',  power: 2, toughness: 1 })
    ]
  })
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