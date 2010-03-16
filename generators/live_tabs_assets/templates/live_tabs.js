Tabset = function(){};

Tabset.initialize = function() {

  $$('.tabs').each(Tabset.initOneTabset);

  if (window.location.hash != '') {
    var tab_with_focus = 'tab_'+window.location.hash.substring(1, window.location.hash.length);
    Event.fire(tab_with_focus, 'tabs:tabfocus');
  }
}

Tabset.initTab = function(tab, activeTab, container, tabs, tabList) {
  var li = new Element('li', {id:'tab_'+tab.id});

  if (activeTab && activeTab.id == li.id) {
    li.addClassName('active');
  }

  li.update(tab.down('.title').innerHTML);

  if (!tab.hasClassName('notabhandler')) {
    var handler = function(){

        if (tab.hasClassName('callback')) {
          var _handler = eval('tab_callback_'+container.id+'_'+tab.id);
          _handler();
        }

        Tabset.deactivateTabList(tabList);

        li.addClassName('active');

        Tabset.deactivateTabs(tabs);
        tab.addClassName('active');

        window.location.hash = '#'+tab.id;
      }

    li.observe('click', handler);
    li.observe('tabs:tabfocus', handler);
  }
  tabList.insert({bottom:li});
}

Tabset.deactivateTabList = function(tabList){
  tabList.select('li').invoke('removeClassName', 'active');
}

Tabset.deactivateTabs = function(tabs){
  tabs.invoke('removeClassName', 'active');
}

Tabset.initOneTabset = function(container){

  var tabs = container.select('.tab');
  var tablist_id = 'tablist_'+container.id;
  var tabList, activeTab;

  if (tabList = $(tablist_id)) {
    activeTab = tabList.down('.active')
    tabList.remove();
  }

  tabList = new Element('ul', {'class':'tablist', 'id':tablist_id});

  tabs.each(function(tab){
    Tabset.initTab(tab, activeTab, container, tabs, tabList);
  });

  container.addClassName('enhanced');
  container.insert({top:tabList});

  if (t = tabs.first()) {
    t.addClassName('active');
    tabList.down('li').addClassName('active');
  }
};

document.observe('dom:loaded', Tabset.initialize);
