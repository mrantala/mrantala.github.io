console.log("blugold.js");
//blugold-page
//blugold-nav

// $(document).ready(function(){
  // console.log($(".blugold-page"));
  // $(".blugold-page").addClass("hide");
// });

// console.log($(".blugold-nav"));
$(".blugold-nav").on('click','*', function (event){console.log("a");
    var targetParent= $(event.target).parents(".blugold-nav")[0];
    var iBlugoldPage = targetParent.dataset.blugoldpage;console.log(iBlugoldPage);
    var iPageToShow = $(".blugold-page[data-blugoldpage='"+iBlugoldPage+"']");
    if ($(iPageToShow).hasClass("hide")){
        $(".blugold-page").addClass("hide");
        iPageToShow.removeClass("hide");
    }
});