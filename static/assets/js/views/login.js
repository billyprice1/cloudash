window.LoginView = Backbone.View.extend({
  events: {
    'click .btnlogin': 'logina',
    'click .recoverpass': 'recoverpass'
  },
  recoverpass: function() {
    //user/:user/recover
    modem('POST', 'user/'+$('#emailfp').val()+'/recover',
      function(json) {
        alert('Email was sent with recovery instructions');
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },

  logina: function() {
    var self = this;

    localStorage.setItem('cloudylang', $("#txt_language").val());

    var user = $('.usernameinput').val();
    var password = $('.passwordinput').val();

    var credential = user + ':' + password;

    if ($("#rememberme").is(':checked')) {
      localStorage.setItem('keyo', btoa(credential));
    } else {
      sessionStorage.setItem('keyo', btoa(credential));
    }


    modem('POST', 'user/login',
      function(json) {
        self.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        $('.alert-danger').show();
        setTimeout(function () {
          $('.alert-danger').hide();
        }, errTimer);
      }
    );
  },

  log: function (json) {
    window.profile = new Profile();
    window.profile.fetch(json, function () {
      window.logged = true;
      app.navigate('/home', {
        trigger: true
      });
      if (localStorage.getItem('cloudylang') != window.language) {
        window.location.reload();
      }
    }, function () {
      alert('Login failed');
    });

  },

  getlogo: function(){
    var self = this;
    modem('GET', 'config',
      function(json) {
        for (var i = 0; i < json.length; i++){
          if (json[i].name === 'logo'){
            $('.img-responsive', self.el).attr('src',json[i].value);
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
    this.getlogo();
    return this;
  }

});
