$(function() {

   if ($('textarea').length) {
       CKEDITOR.replace('ta');
   }

   $('a.confirmDeletion').on("click", function(){
    if (!confirm("Confirm deletion"))
        return false;
   })

   $('a.confirmClearCart').on("click", function(){
    if (!confirm("Confirm clear cart"))
        return false;
   })

   if($("[data-fancybox]").length) {
       $("[data-fancybox]").fancybox()

   }

   $('a.buynow').on("click", function (e) {
    e.preventDefault();
    
    $.get('/cart/buynow', function () {
        $('form.pp input[type=image]').click();
        $('.ajaxbg').show();
    })


})
  
})


