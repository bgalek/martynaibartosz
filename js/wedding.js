var config = {
};

firebase.initializeApp(config);

function writeUserData(username, rsvp, bed) {
    firebase.database().ref('users/' + slugify(username)).set({
        username: username,
        rsvp: rsvp,
        bed: bed
    });
}

function getUserData(username) {
    return firebase.database()
        .ref('users/' + slugify(username))
        .once('value');
}

window.fbAsyncInit = function () {
    FB.init({appId: '450042002008613', status: true, cookie: true, xfbml: true});
    var $rsvp = $('#schedule');
    var decline = $rsvp.find('.decline');
    var accept = $rsvp.find('.accept');
    var alert = $rsvp.find('.alert');
    var message = $rsvp.find('.message');
    var rsvpAfter = $rsvp.find('.rsvp-after');

    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            FB.api('/me', function (response2) {
                getUserData(response2.name).then(function (snapshot) {
                    var userData = snapshot.val();
                    rsvpAfter.find('.bed').attr('checked', userData.bed);
                    var decision = userData.rsvp;
                    if (decision) {
                        setAccepted(response2.name);
                    } else {
                        setDeclined(response2.name);
                    }
                });

            });
        }
    });

    function setAccepted(username) {
        decline.attr('disabled', true);
        alert.html('<strong>' + username + '</strong> dziękujemy za potwierdzenie!');
        alert.addClass('alert-success');
        message.fadeIn();
        rsvpAfter.fadeIn();
        rsvpAfter.find('.bed').click(function () {
            writeUserData(username, true, rsvpAfter.find('.bed').is(':checked'));
        });
    }

    function setDeclined(username) {
        accept.attr('disabled', true);
        alert.html('<strong>' + username + '</strong> strasznie nam przykro :(');
        alert.addClass('alert-danger');
        message.fadeIn();
    }

    accept.click(function () {
        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me', function (response) {
                    setAccepted(response.name);
                    writeUserData(response.name, true, false);
                });
            }
        });
    });

    decline.click(function () {
        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me', function (response) {
                    setDeclined(response.name);
                    writeUserData(username, false, false);
                });
            }
        });
    });
};

(function (d) {
    var js, id = 'facebook-jssdk';
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/pl_PL/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);
}(document));

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace('ł', 'l')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
