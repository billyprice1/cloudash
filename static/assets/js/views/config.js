window.ConfigView = Backbone.View.extend({
  events: {
    'change #fileElem': 'showlogo',
    'click .preview': 'loadnewpic',
    'click .clearlogo': 'clearlogo',
    'click .savelogo': 'sendlogo',
    'click .savesupport': 'sendsupport'
  },

  clearlogo: function() {
    var self = this;
    this.file = undefined;
    var data = {
      support: $("[name='my-checkbox']").is(':checked')
    };
    modem('DELETE', 'config/logo',
      function(json) {
        var smsg = ['Logo restored', 'Logotipo reposto', 'Logo restaurado'];
        showSuccess(smsg[getlang()]);
        self.render();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }, data
    );
  },
  sendlogo: function() {
    var self = this;
    if (!this.file){
      return;
    }
    var data = {
      rawfile: this.file,
    };

    modem('POST', 'config/logo',
      function(json) {
        var smsg = ['Logo updated', 'Logotipo actualizado', 'Logo actualiza'];
        showSuccess(smsg[getlang()]);
        self.render();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }, data
    );
  },
  sendsupport: function() {
    var self = this;
    var data = {
      support: $("[name='my-checkbox']").is(':checked')
    };

    modem('POST', 'config/support',
      function(json) {
        var smsg = ['Updated support settings', 'Definições de suporte actualizadas', 'Configuraciones de soporte actualizado'];
        showSuccess(smsg[getlang()]);
        location.reload();
        //self.render();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }, data
    );
  },

  showlogo: function() {
    var self = this;
    fileElem = document.getElementById("fileElem");
    var selectedFile = $('#fileElem')[0].files[0];
    //console.log(selectedFile);

    var reader = new FileReader();
    reader.onload = (function(theFile){
      var fileName = theFile.name;
      return function(e){
        self.file = e.target.result;
        $('.preview', self.el).attr('src', self.file);
      };
    })(selectedFile);
    reader.readAsDataURL(selectedFile);

  },
  loadnewpic: function() {
    fileElem = document.getElementById("fileElem");
    if (fileElem) {
      fileElem.click();
    }
  },

  getlogo: function(){
    var self = this;
    modem('GET', 'config',
      function(json) {
        for (var i = 0; i < json.length; i++){
          if (json[i].name === 'logo'){
            $('.currentlogo', self.el).attr('src',json[i].value);
          }
          if (json[i].name === 'support'){
            if (json[i].value == 'false') {
              $("[name='my-checkbox']", self.el).bootstrapSwitch('state', false, true);
              $('#gotosupport').hide();
            } else {
              $("[name='my-checkbox']", self.el).bootstrapSwitch('state', true, true);
              $('#gotosupport').show();
            }
          }
        }

      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },

  render: function() {
    $(this.el).html(this.template());
    $("[name='my-checkbox']", this.el).bootstrapSwitch();
    $('.config', this.el).i18n();
    $('.menulateral li').removeClass('active');
    this.getlogo();
    return this;
  }

});
