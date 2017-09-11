(function ($) {
    $(document).ready(function () {

        $.get("/facebook.json", function (data) {
            data = uniqBy(data.result, function (key) {
                return key.content
            });
            $("#facefeed").append(data
                .map(function (it) {
                    var href = document.createElement('a');
                    href.href = 'https://facebook.com/' + it.postID;
                    href.style.backgroundImage = "url('" + it.photoURL + "')";
                    return href;
                }));
        });

        var feed = new Instafeed({
            get: 'tagged',
            tagName: 'martynaibartosz',
            accessToken: '',
            sortBy: 'most-recent',
            limit: '21',
            resolution: 'low_resolution',
            template: '<a href="{{link}}" class="text-hide" style="background: url({{image}})">{{link}}</a>'
        });
        feed.run();

        $('body').scrollspy({target: '#navbar-spy'});

        $(function () {
            $(window).scroll(function () {
                // set distance user needs to scroll before we fadeIn navbar
                if ($(this).scrollTop() > 100) {
                    $('nav').removeClass('hidden');
                    $('nav').fadeIn();
                } else {
                    $('nav').fadeOut();
                    $('#collapse').collapse('hide');
                }
            });
        });

        $('.nav-link').on('click', function (event) {
            event.preventDefault();
            scrollToID($(this).attr("href"), 750);
            $('#collapse').collapse('hide');
        });

        function scrollToID(id, speed) {
            var offSet = 0;
            var targetOffset = $(id).offset().top - offSet;
            var mainNav = $('#main-nav');
            $('html,body').animate({
                scrollTop: targetOffset
            }, speed);
            if (mainNav.hasClass("open")) {
                mainNav.css("height", "1px").removeClass("in").addClass("collapse");
                mainNav.removeClass("open");
            }
        }

        $('#clock').countdown('2017/09/09 17:00', function (event) {
            $(this).html(event.strftime('%D dni %H:%M:%S'));
        });

        function uniqBy(a, key) {
            var seen = {};
            return a.filter(function (item) {
                var k = key(item);
                return seen.hasOwnProperty(k) ? false : (seen[k] = true);
            })
        }

    });
}(jQuery));
