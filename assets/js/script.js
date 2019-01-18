//example data
const lstCategory = [
    {
        name : "LV8005",
        thumbImage : 'images/jori-glove-pure-2018.jpg',
        description : "Cuno Frommherz",
        components : [
            {
                name : "LV8005 1",
                thumbImage : "LV8005-1.jpg",
                data : "LV8005-1.3DS",
                combineInfo : {
                    backChair   : ['top'],
                    leftTop     : [false,false],
                    rightTop    : [false,true],
                    rightBottom : [true,false],
                    leftBottom  : [false,false]
                }
            },
            {
                name : "LV8005 3",
                thumbImage : "LV8005-3.jpg",
                data : "LV8005-3.3DS",
                combineInfo : {
                    backChair   : ['top'],
                    leftTop     : [true,false],
                    rightTop    : [false,true],
                    rightBottom : [true,false],
                    leftBottom  : [false,true]
                }
            },
            {
                name : "LV8005 B2",
                thumbImage : "LV8005-B2.jpg",
                data : "LV8005-B2.3DS",
                combineInfo : {
                    backChair   : ['top'],
                    leftTop     : [true,false],
                    rightTop    : [false,true],
                    rightBottom : [true,false],
                    leftBottom  : [false,true]
                }
            },
            {
                name : "LV8005 B4",
                thumbImage : "LV8005-B4.jpg",
                data : "LV8005-B4.3DS",
                combineInfo : {
                    backChair   : ['top','right'],
                    leftTop     : [true,false],
                    rightTop    : [false,false],
                    rightBottom : [false,true],
                    leftBottom  : [true,true]
                }
            },
            {
                name : "LV8005 B5",
                thumbImage : "LV8005-B5.jpg",
                data : "LV8005-B5.3DS",
                combineInfo : {
                    backChair   : ['left'],
                    leftTop     : [true,false],
                    rightTop    : [false,false],
                    rightBottom : [false,false],
                    leftBottom  : [false,false]
                }
            },
            {
                name : "LV8005 B6",
                thumbImage : "LV8005-B6.jpg",
                data : "LV8005-B6.3DS"
            },
        ]
    },
    {
        name : "LV8013",
        thumbImage : 'images/jori-sophia.jpg',
        description : "Verhaert New Products & Services",
        components : [
            {
                name : "LV8013 C1",
                thumbImage : "LV8013-C1.jpg",
                data : "LV8013-C1.3DS"
            },
            {
                name : "LV8013 C2",
                thumbImage : "LV8013-C2.jpg",
                data : "LV8013-C2.3DS"
            },
            {
                name : "LV8013 C3",
                thumbImage : "LV8013-C3.jpg",
                data : "LV8013-C3.3DS"
            },
            {
                name : "LV8013 C4",
                thumbImage : "LV8013-C4.jpg",
                data : "LV8013-C4.3DS"
            },
            {
                name : "LV8013 C5",
                thumbImage : "LV8013-C5.jpg",
                data : "LV8013-C5.3DS"
            },
        ]
    },
    {
        name : "LV8019",
        thumbImage : 'images/jori-tigra-landscape.jpg',
        description : "Verhaert New Products & Services",
        components : [
            {
                name : "LV8019 1",
                thumbImage : "LV8019-01.jpg",
                data : "LV8019-01.3DS"
            },
            {
                name : "LV8019 2",
                thumbImage : "LV8019-02.jpg",
                data : "LV8019-02.3DS"
            },
            {
                name : "LV8019 3",
                thumbImage : "LV8019-03.jpg",
                data : "LV8019-03.3DS"
            },
            {
                name : "LV8019 4",
                thumbImage : "LV8019-04.jpg",
                data : "LV8019-04.3DS"
            },
            {
                name : "LV8019 5",
                thumbImage : "LV8019-05.jpg",
                data : "LV8019-05.3DS"
            },
            {
                name : "LV8019 6",
                thumbImage : "LV8019-06.jpg",
                data : "LV8019-06.3DS"
            },
        ]
    },
];

const lstColor = [
    {
        category : "F-006",
        color : "d24d02",
        name : "F-006-101"
    },
    {
        category : "F-006",
        color : "715b60",
        name : "F-006-102"
    },
    {
        category : "F-006",
        color : "2d2e4a",
        name : "F-006-103"
    },
    {
        category : "F-006",
        color : "62280d",
        name : "F-006-104"
    },
    {
        category : "F-006",
        color : "b0704b",
        name : "F-006-105"
    },
    {
        category : "F-006",
        color : "aa8e7f",
        name : "F-006-107"
    },
    {
        category : "F-006",
        color : "605b7b",
        name : "F-006-116"
    },
    {
        category : "F-006",
        color : "961d07",
        name : "F-006-117"
    },
    {
        category : "F-006",
        color : "7a0303",
        name : "F-006-120"
    },
    {
        category : "F-006",
        color : "331c22",
        name : "F-006-122"
    },
    {
        category : "F-006",
        color : "131016",
        name : "F-006-124"
    },
    {
        category : "F-006",
        color : "8a0e02",
        name : "F-006-202"
    },
    {
        category : "F-006",
        color : "151d1c",
        name : "F-006-206"
    },
    {
        category : "F-008",
        color : "7a4c26",
        name : "F-008-101"
    },
    {
        category : "F-008",
        color : "421a11",
        name : "F-008-102"
    },
    {
        category : "F-008",
        color : "815801",
        name : "F-008-201"
    },
    {
        category : "F-008",
        color : "af5c1c",
        name : "F-008-203"
    },
    {
        category : "F-008",
        color : "891c05",
        name : "F-008-204"
    },
    {
        category : "F-008",
        color : "7e6061",
        name : "F-008-206"
    },
    {
        category : "F-008",
        color : "6b1700",
        name : "F-008-401"
    },
    {
        category : "F-008",
        color : "3f0305",
        name : "F-008-403"
    },
    {
        category : "F-008",
        color : "501b08",
        name : "F-008-406"
    },
    {
        category : "F-018",
        color : "121015",
        name : "F-018-101"
    },
    {
        category : "F-018",
        color : "8d706d",
        name : "F-018-102"
    },
    {
        category : "F-018",
        color : "9a3d03",
        name : "F-018-106"
    },
    {
        category : "F-018",
        color : "a45b32",
        name : "F-018-114"
    },
    {
        category : "F-018",
        color : "c54100",
        name : "F-018-133"
    },
    {
        category : "F-018",
        color : "a91913",
        name : "F-018-134"
    },
    {
        category : "F-018",
        color : "480f08",
        name : "F-018-135"
    },
    {
        category : "F-018",
        color : "47151b",
        name : "F-018-137"
    },
    {
        category : "F-018",
        color : "101453",
        name : "F-018-138"
    },
    {
        category : "F-018",
        color : "46271c",
        name : "F-018-142"
    },
]
//example data end

var CategoryLoader = function(){

    $('#category-list').children().remove();
    lstCategory.map((item,i)=>{
        $('#category-list').append(
            "<div class='category-item' data-index='"+i+"'>"+
            "<img src='"+item.thumbImage+"' width='100%'>"+
            "<p class='title'>"+item.name+"</p>"+
            "<p class='description'>"+item.description+"</p>"+
            "</div>"
        );
    });
    $('.category-item').click(function(){
        var id = $(this).data('index');
        SofaConfigurator(lstCategory[id]);
    })
}

function hideSideDrawer(){
    $('.toggle-collapse').removeClass('expanded');
    $('.toggle-collapse').addClass('collapsed');
    $('.side-drawer').removeClass('expanded');
    $('.side-drawer').addClass('collapsed');
}

function openSideDrawer(){
    $('.toggle-collapse').addClass('expanded');
    $('.toggle-collapse').removeClass('collapsed');
    $('.side-drawer').addClass('expanded');
    $('.side-drawer').removeClass('collapsed');
}

$('document').ready(function(){
    CategoryLoader();
    $('#sofa-config-panel').hide();
    $('.btn-back').click(function(){
        $('#category-list').show();
        $('#sofa-config-panel').hide();
    })

    $('.toggle-collapse').click(function(){

        if($(this).hasClass('expanded')){
            hideSideDrawer();
        }
        else{
            openSideDrawer();
        }
    })

    ////////////////////////////////////////////
    //nav management
    ////////////////////////////////////////////
    $('.custom-nav-item').click(function(){
        $(this).parent().find('.custom-nav-item').each(function(){
            $(this).removeClass('active');
        })
        $(this).addClass('active');
        if($(this).data('cat') != 'additional')
            openSideDrawer();
        else
            hideSideDrawer();

        var cat = $(this).data('cat');
        //side bar manage
        $('.side-drawer').find('.side-drawer-content').each(function(){
            if($(this).data('cat') == cat) $(this).addClass('active');
            else $(this).removeClass('active');
        })
        $('.custom-nav-content').find('.custom-nav-content-item').each(function(){
            if($(this).data('cat') == cat) $(this).addClass('active');
            else $(this).removeClass('active');
        })
    })

    //add element clicked
    $('.btn-add-element').click(function(){
        $('#select-type').show();
    })

    //dropdown management
    $('.custom-dropdown-header').click(function(){
        if($(this).parent().hasClass('collapsed'))
        {
            $(this).parent().removeClass('collapsed');
            $(this).parent().addClass('expanded');
        }

        else{
            $(this).parent().removeClass('expanded');
            $(this).parent().addClass('collapsed');
        }
    })

})
