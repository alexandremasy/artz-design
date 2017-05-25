(function(window)
{

  jQuery(window).on('load', function()
  {
    $('a[data-fancybox]').fancybox({

		    baseClass : 'fancybox-custom-layout',
        margin    : 0,
		    infobar   : false,
        thumbs    : {
          hideOnClosing : false
        },
        touch : {
          vertical : 'auto'
        },
        closeClickOutside : false
	});

  });

})(window);
