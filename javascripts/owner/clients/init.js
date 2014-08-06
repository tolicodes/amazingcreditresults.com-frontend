var model = {
    'flash':{
        'error': ko.observableArray(),
        'success': ko.observableArray(),
        'info': ko.observableArray()
    },
    'message': ko.observable(),
    'messageLink': ko.observable(),
    'clients': ko.observableArray(),
    'userToBeCreated': {
        'email':ko.observable(),
        'givenName':ko.observable(),
        'middleName':ko.observable(),
        'familyName':ko.observable(),
        'accountVerified':ko.observable(),
        'needQuestionnaire':ko.observable()
    },
    'createClient': function () {
        var that = this;
        $.post('/admin/clients', {
            'email': this.userToBeCreated.email(),
            'givenName': this.userToBeCreated.givenName(),
            'middleName': this.userToBeCreated.middleName(),
            'familyName': this.userToBeCreated.familyName(),
            'needQuestionnaire': true //temporary
        }, function (data) {
//                console.log(data);
            var newClient = /*JSON.parse*/(data);
//                console.log(newClient);
            newClient.root = false;
//                console.log(newClient);
            that.userToBeCreated.email('');
            that.userToBeCreated.givenName('');
            that.userToBeCreated.middleName('');
            that.userToBeCreated.familyName('');
            that.userToBeCreated.accountVerified('');
            that.userToBeCreated.needQuestionnaire('');
            that.clients.push(newClient);
        });
    },
    'sendWelcomeEmail': function (client) {
        $.post('/admin/clients/welcome/' + client.id, {}, function (data) {
//              console.log(data);
          if(data.error) {
            model.message(data.error);
          } else {
            model.message('Welcome message is send! Visit link below to verify that it works');
            model.messageLink(data.welcomeLink);
          }
        });
    },
    'sendResetPasswordEail': function (client) {
        $.post('/admin/clients/resetPassword/' + client.id, {}, function (data) {
//              console.log(data);
          if(data.error) {
            model.message(data.error);
          } else {
            model.message('Reset message is send! Visit link below to verify that it works');
            model.messageLink(data.welcomeLink);
          }
        });
    },
    'updateClient': function (client) {
      console.log(client);
      $.post('/admin/clients/'+client.id, {
        '_method':'PUT',
        'email': client.email,
        'familyName' : client.name.familyName,
        'givenName' : client.name.givenName,
        'middleName': client.name.middleName,
        'localAddress': client.localAddress,
        'telefone': client.telefone,
        'title': client.title,
        'needQuestionnaire':client.needQuestionnaire
      }, function(data){
        if(data.error) {
          model.message(data.error);
        } else {
          model.message('Updated!');
          alert('Updated!');
        }
      });
    }
};


ko.applyBindings(model);

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        $.get('/admin/clients.json', function (data) {
            console.log(data);
            data.clients.map(function (client) {
              client.isChanged = true;
              client.needQuestionnaire = client.needQuestionnaire || true;
              model.clients.push(client);
            })
        });
    }
};