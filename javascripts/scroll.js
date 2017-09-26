window.blockMenuHeaderScroll = false;
$(window).on('touchstart', function(e)
             {
             if ($(e.target).closest('#mobileMenuHeader').length == 1)
             {
             blockMenuHeaderScroll = true;
             }
             });
$(window).on('touchend', function()
             {
             blockMenuHeaderScroll = false;
             });
$(window).on('touchmove', function(e)
             {
             if (blockMenuHeaderScroll)
             {
             e.preventDefault();
             }
             });