var app, appData;

appData = localStorage.getItem('appData');

appData = appData ? JSON.parse(appData) : [];

app = (function($) {
  $('.wrap:first').fadeIn(350);
  return {
    s: {},
    i: null,
    module: {},
    saveAppData: function() {
      return localStorage.setItem('appData', JSON.stringify(appData));
    },
    init: function() {
      app.initVars();
      app.initEvents();
      app.modules();
      return app.sortable();
    },
    sortable: function() {
      $('.multi-list').sortable({
        connectWith: ".multi-chosen"
      });
      $('.multi-chosen').sortable({
        connectWith: ".multi-list"
      });
      $('.single-list').sortable({
        connectWith: ".single-chosen"
      });
      return $('.single-chosen').sortable({
        connectWith: ".single-list"
      });
    },
    initVars: function() {
      app.$mods = $('.modules');
      app.$n = $('#module');
      app.$tax = $('.tax .list');
      app.$meta = $('.meta .list');
      app.$multi = $('.multi .list');
      return app.$single = $('.single .list');
    },
    initEvents: function() {
      return app.$mods.on('click', '.module', function() {
        var $t;
        $t = $(this);
        app.i = $t.attr('i');
        app.module = appData[app.i];
        return app.initModule();
      });
    },
    switchS: function(screen) {
      var $s;
      $s = $('#' + screen);
      if (!$s.is(':visible')) {
        $('.wrap').fadeOut(350);
        return $s.fadeIn(350);
      }
    },
    initModule: function() {
      var fn, fn1, fn2, fn3, m, name, ref, ref1, ref2, ref3, val;
      app.switchS('module');
      m = app.module;
      $('#name').val(m.name);
      app.$tax.html('');
      app.$meta.html('');
      app.$multi.html('');
      app.$single.html('');
      ref = m.Taxo;
      fn = function(name, val) {
        app.$tax.append('<span class="btn pu-bg field">' + name + '</span>');
        app.$multi.append('<div data-name="' + name + '" class="btn pu-bg field"><span class="field-name">' + name + '</span> : <span class="field-value">' + val + '</span></div>');
        return app.$single.append('<div data-name="' + name + '" class="btn pu-bg field"><span class="field-name">' + name + '</span> : <span class="field-value">' + val + '</span></div>');
      };
      for (name in ref) {
        val = ref[name];
        fn(name, val);
      }
      ref1 = m.Meta;
      fn1 = function(name, val) {
        app.$meta.append('<span class="btn pu-bg field">' + name + '</span>');
        app.$multi.append('<div data-name="' + name + '" class="btn pu-bg field"><span class="field-name">' + name + '</span> : <span class="field-value">' + val + '</span></div>');
        return app.$single.append('<div data-name="' + name + '" class="btn pu-bg field"><span class="field-name">' + name + '</span> : <span class="field-value">' + val + '</span></div>');
      };
      for (name in ref1) {
        val = ref1[name];
        fn1(name, val);
      }
      ref2 = m.MultiView;
      fn2 = function(name, val) {
        return app.$multi.children('[data-name="' + name + '"]').appendTo(app.$multi.siblings('.chosen'));
      };
      for (name in ref2) {
        val = ref2[name];
        fn2(name, val);
      }
      ref3 = m.SingleView;
      fn3 = function(name, val) {
        return app.$single.children('[data-name="' + name + '"]').appendTo(app.$single.siblings('.chosen'));
      };
      for (name in ref3) {
        val = ref3[name];
        fn3(name, val);
      }
      return $('.multi-list, .multi-chosen, .single-list, .single-chosen').each(function() {
        return $(this).sortable("refresh");
      });
    },
    newModule: function() {
      app.i = null;
      app.module = {
        name: '',
        Taxo: {},
        Meta: {},
        MultiView: {},
        SingleView: {}
      };
      return app.initModule();
    },
    modules: function() {
      var i, mod, results;
      app.switchS('modules');
      if (appData.length) {
        app.$mods.html('');
        results = [];
        for (i in appData) {
          mod = appData[i];
          results.push((function(i, mod) {
            return app.$mods.append('<a i="' + i + '" class="btn pu-bg module">' + mod.name + '</a>');
          })(i, mod));
        }
        return results;
      }
    },
    modTaxo: function() {
      app.insertFieldCallback = function(name, example) {
        return app.module.Taxo[name] = example;
      };
      return app.insertFieldDlog('New Taxonomy');
    },
    modMeta: function() {
      app.insertFieldCallback = function(name, example) {
        return app.module.Meta[name] = example;
      };
      return app.insertFieldDlog('New Metadata field');
    },
    insertFieldDlog: function(label) {
      if (label == null) {
        label = '';
      }
      $('#field-name').val('');
      $('#field-value').val('');
      return $('.add-field').fadeIn().find('h2').html(label);
    },
    insertField: function() {
      var $dlog, name, value;
      $dlog = $('.add-field');
      name = $('#field-name').val();
      value = $('#field-value').val();
      if (!name) {
        return alert('Please type name for the ' + $dlog.find('h2').html() + ', Like City/Email for a person.');
      }
      if (!value) {
        return alert('Please type an example value for the ' + $dlog.find('h2').html() + ', Like Kerala for City or alex@example.com for Email');
      }
      app.insertFieldCallback(name, value);
      app.initModule();
      return $dlog.fadeOut();
    },
    save: function() {
      app.module.name = $('#name').val();
      if (null === app.i) {
        appData.push(app.module);
      } else {
        appData[app.i] = app.module;
      }
      app.saveAppData();
      return app.modules();
    }
  };
})(jQuery);

app.init();

window.beforeunload = app.saveAppData;
