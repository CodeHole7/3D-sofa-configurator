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
        color : "000000",
        name : "Black"
    },
    {
        color : "f43838",
        name : "Red"
    },
    {
        color : "38f438",
        name : "Green"
    },
    {
        color : "3838f4",
        name : "Blue"
    },
    {
        color : "858585",
        name : "Gray"
    },
    {
        color : "6D305B",
        name : "Palatinate Purple"
    },
    {
        color : "835284",
        name : "Razzmic Berry"
    },
    {
        color : "FEFAEC",
        name : "Floral White"
    },
    {
        color : "F7EDC2",
        name : "Lemon Meringue"
    },
    {
        color : "E6C26B",
        name : "Arylide Yellow"
    },
    {
        color : "602812",
        name : "Seal Brown"
    },
    {
        color : "803516",
        name : "Kobe"
    },
    {
        color : "FBE6B1",
        name : "Banana Mania"
    },
    {
        color : "FDD06C",
        name : "Orange-Yellow (Crayola)"
    },
    {
        color : "F5983B",
        name : "Royal Orange"
    },
    {
        color : "EB671C",
        name : "Halloween Orange"
    },
    {
        color : "ACC1FF",
        name : "Baby Blue Eyes"
    },
    {
        color : "C7EEFF",
        name : "Diamond"
    },
    {
        color : "FFAEAE",
        name : "Melon"
    },
    {
        color : "FFEC94",
        name : "Flavescent"
    },
    {
        color : "B0E57C",
        Name: "Yellow-Green (Crayola)"
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
