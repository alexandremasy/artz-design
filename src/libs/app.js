(function(window)
{

  jQuery(window).on('load', function()
  {
    $('a[data-fancybox="cl-group"]').fancybox({

		    baseClass : 'fancybox-custom-layout',
        margin    : 0,
		    infobar   : false,
        thumbs    : {
          hideOnClosing : false
        },
        touch : {
          vertical : 'auto'
        },
        closeClickOutside : false,

        // Customize caption area - append an ad to the bottom
        caption : function( instance ) {
          var ad = '<div class="ad"><p><a href="//fancyapps.com/fancybox/">fancyBox3</a> - touch enabled, responsive and fully customizable lightbox script</p></div>';
          return ad + ( $(this).data('caption') || '' );
        }
	});

  });

})(window);
