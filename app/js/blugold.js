console.log("blugold.js");
//blugold-page
//blugold-nav

$(document).ready(function(){
  // console.log($(".blugold-page"));
  // $(".blugold-page").addClass("hide");
});

// console.log($(".blugold-nav"));
$(".blugold-nav").on('click','*', function (event){
    var targetParent= $(event.target).parents(".blugold-nav")[0];
    var iBlugoldPage = targetParent.dataset.blugoldpage;
    var iPageToShow = $(".blugold-page[data-blugoldpage='"+iBlugoldPage+"']");
    if ($(iPageToShow).hasClass("hide")){
        $(".blugold-page").addClass("hide");
        iPageToShow.removeClass("hide");
    }
});

/* $.each($(".blugold-nav"), function (index, iNavElement){
    iNavElement.addEventListener("click", function(event){
        var iBlugoldPage = event.target.dataset.blugoldpage;
        var iPageToShow = $(".blugold-page[data-blugoldpage='"+iBlugoldPage+"']");
        if ($(iPageToShow).hasClass("hide")){
            $(".blugold-page").addClass("hide");
            iPageToShow.removeClass("hide");
        }
    },
    {once: false, capture: true}); //Make sure it runs on children
}); */
