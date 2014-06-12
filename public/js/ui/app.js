$(window).on("resize", function () {
    if($(window).width()<800) {
        $(".side").css("display", "block");
    }else {
        $(".side").css("display", "none");
    }
}).resize();
