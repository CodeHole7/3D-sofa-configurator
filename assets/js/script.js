//example data
const lstCategory = [
    {
        name : "LV8005",
        thumbImage : 'images/jori-glove-pure-2018.jpg',
        description : "Cuno Frommherz"
    },
    {
        name : "LV8013",
        thumbImage : 'images/jori-sophia.jpg',
        description : "Verhaert New Products & Services"
    },
];
//example data end

var CategoryLoader = function(){
    console.log('load categories');
    console.log('data',lstCategory);

    $('#category-list').children().remove();
    lstCategory.map((item,i)=>{
        $('#category-list').append(
            "<div class='category-item' data-index='"+i+"'>"+
            "<img src='"+item.thumbImage+"'>"+
            "<p class='title'>"+item.name+"</p>"+
            "<p class='description'>"+item.description+"</p>"+
            "</div>"
        );
    });
    $('.category-item').click(function(){
        var id = $(this).data('index');
        console.log('clicked')
        SofaConfigurator(lstCategory[id]);
    })
}

$('document').ready(function(){
    console.log('document ready');
    CategoryLoader();
    $('#sofa-config-panel').hide();
    $('.btn-back').click(function(){
        $('#category-list').show();
        $('#sofa-config-panel').hide();
    })
})
