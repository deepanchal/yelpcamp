$(function () {
    var $el = $('.parallax-background');
    $(window).on('scroll', function () {
        var scroll = $(document).scrollTop();
        $el.css({
            'background-position': '50% ' + (-.4 * scroll) + 'px'
        });
    });
});