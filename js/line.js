$(document).ready(function() {
    var padding = 20;
    var bottom = 20;
    var w = $('#holder').css('width');
    var h = $('#holder').css('height');
    w = w.substring(0, w.indexOf("px"));
    h = h.substring(0, h.indexOf("px"))
    console.log(w, h);

    var r = Raphael(document.getElementById("holder")),
        titletxtattr = { font: "16px 'Helvetica Neue'" },
        subtitletxtattr = { font: "14px 'Helvetica Neue'" },        
        labeltxtattr = { font: "10px 'Helvetica Neue'" },
        vallabeltxtattr = { font: "11px 'Helvetica Neue'" };

    // draw baseline

    // colors array
    var colors = [
        {colors:["#0088cc","#9900cc","#5bb75b","#faa732","#da4f49"]}
    ];
    var colors2 = [
        {colors:["#006dCC","#5200cc","#306130","#fa8532","#d91c14"]}
    ];
    var colorindex = 0;

    // set title
    var title = "Average Rainfall in Boston (inches)";
    $('#options input[name=title]').val(title);
    r.text(w/2, padding, title).attr(titletxtattr);

    // allow title to be changed
    $('#options input[name=title]').keyup(function() {
        title = $('#options input[name=title]').val();
        $('text:first tspan').text(title);
    });

    // set subtitle
    var subtitle = "2011";
    $('#canvas input[name=subtitle]').val(subtitle);
    r.text(w/2, padding*2, subtitle).attr(subtitletxtattr);

    // allow title to be changed
    $('#canvas input[name=subtitle]').keyup(function() {
        subtitle = $('#canvas input[name=subtitle]').val();
        $('text:eq(1) tspan').text(subtitle);
    });

    // set default value for observations
    $('#data input[name=obs]').val(0);

    // get html of header and obs so can append later
    var header = $('#data tr:first');
    var headerhtml = header.html();
    var obs = $('#data tr:last');
    var obshtml = obs.html();

    // set up chart with example data
    var columnname_array = ['Month',"Rainfall"];
    var series_array = [[1,2,3,4,5,6,7,8,9,10,11,12],[3.36, 3.38, 4.32, 3.74, 3.49, 3.68, 3.43, 3.35, 3.44, 3.94, 3.99, 3.78],[1,2,3,4,5,6,7,8,9,10,11,12],[3.36, 3.38, 4.32, 3.74, 3.49, 3.68, 3.43, 3.35, 3.44, 3.94, 3.99, 3.78]];

    // number of col
    var numcol = series_array.length;
    var numcolold = series_array.length;
    $('#data input[name=numcol]').val(numcol);

    // number of series
    var numseries = 1;
    var numseriesold = 1;
    $('#data input[name=numseries]').val(numseries);   

    var series = $('.draggable');
    var serieshtml = series.html(); 
    $('.draggable a').addClass('series0');

    // number of obs
    var obs_len = series_array[0].length;
    var numobs = obs_len;
    var numobsold = obs_len;

    // grow from one column
    while($('#data .columnname td').length < numcol)
    {
        header.append(headerhtml);
        obs.append(obshtml);
    }

    // grow from one obs
    var obshtml2 = $('#data tr:eq(1)').html();
    while($('#data tr.obs').length < numobs)
    {
        $('#data tr:eq(1)').after("<tr class='obs'>"+obshtml2+"</tr>");
    }
    
    setInputToArray(columnname_array, "columnname");    
    setInputToArray(series_array[0], "obs", 1); // 1 b/c 1st child
    setInputToArray(series_array[1], "obs", 2); // 2 b/c 2nd child

    // indices for which column is x and y
    var indices = [[0,1]];
    // initial draw options
    var drawoptions = { nostroke: false, axis: "0 0 1 1", symbol: "circle", smooth: false, colors: colors[colorindex].colors };
    var lineoptionindex = 0;

    redraw();
    
    //drawLabels();

    // clear button
    $('#refresh-button').click(function() {
        for (var i = 0; i < numcol; i++)
        {
            for (var j = 0; j < numobs; j++)
            {
                series_array[i][j] = 0;
            }
        }
        for (var i = 0; i < numcol; i++)
        {
            columnname_array[i] = "";
        }
        title = "Title";
        $('#options input[name=title]').val(title);
        $('text:first tspan').text(title);
        subtitle = "-";
        $('#canvas input[name=subtitle]').val(subtitle);
        $('text:eq(1) tspan').text(subtitle);        
        redraw();
        $('#data input[name=obs]').val(0);
        $('#data input[name=columnname]').val("");
        //drawLabels();
    }); 

    // allow dynamic changing of values
    $(document).on('change','#data input[name=obs]',function() {
        // get index
        var index = $('#data input[name=obs]').index(this);
        var colindex = index % numcol;
        var obsindex = Math.floor(index / numcol);
        if (!$.isNumeric($(this).val()))
        {
            alert("Only numeric, nonmissing values.");
            $(this).val(series_array[colindex][obsindex]);
            $(this).focus();
        }
        series_array[colindex][obsindex] = $(this).val()-0;
        redraw();
    });

    // allow dynamic changing of labels
    $(document).on('change','#data input[name=columnname]',function() {
        // get index to get original value
        var index = $('#data input[name=columnname]').index(this);

        columnname_array[index] = $(this).val();
        //drawLabels();
    });
    
    // allow additional obs
    // here replicating last obs 
    $('#add-obs').click(function() {
        numobs++;

        var collen = numcol;
        while (--collen >= 0)
        {
            var collenplus = collen + 1;
            series_array[collen].push($('#data tr:last-child td:nth-child('+collenplus+') input').val()-0);
        }
        numobsold = numobs;
        $('#data table').append('<tr class="obs">'+$('#data tr:last-child').html()+'</tr>');

        var collen = numcol;
        while (--collen >= 0)
        {
            var collenplus = collen + 1;
            $('#data tr:last-child td:nth-child('+collenplus+') input').val(series_array[collen][numobs-1]);
        }    
        console.log(series_array);    
        //redraw();
    });

    // remove additional obs
    $('#remove-obs').click(function() {
        if ($('#data tr').length > 2)
        {
            $('#data tr:last').remove();
            numobs--;
            var collen = numcol;
            while (--collen >= 0)
                series_array[collen].pop();
        }
        console.log(series_array);
        numobsold = obs;
        //redraw();
    });

    // set x and y columnname order
    // using indices array and draggable/droppable

    // droppable options

    var seriesindex = 0, xyindex = 0, oldthis = 0, oldthiscss = 0;

    var drgOptions = { 
        revert: true, 
        snap: "input[name=columnname]",
        drag: function(event, ui) {
            // get xyindex of button
            seriesindex = Math.floor($('span.draggable a').index(this)/2);
            xyindex = $('span.draggable a').index(this) % 2;
            // get handle and border
            oldthis = $(this); 
            oldthiscss = $(this).css('border');                               
            $(this).removeClass('disabled');
        }
    };  

    var drpOptions = {
        drop: function(event, ui) { 
            // remove border of that color
            $('tr.columnname input[name=columnname]:eq('+indices[xyindex]+')').css('border','none');                
            // get column index
            var headerindex = $('tr.columnname input[name=columnname]').index(this);
            console.log("headerindex",headerindex);
            indices[seriesindex][xyindex] = headerindex;
            // set to -1 excluding seriesindex
            for (var i = 0; i < seriesindex; i++)
            {
                if (indices[i][0]==indices[seriesindex][xyindex])
                {
                    indices[i][0] = -1;               
                    indices[i][1] = -1;               
                } 
                if (indices[i][1]==indices[seriesindex][xyindex])
                {
                    indices[i][1] = -1; 
                    indices[i][0] = -1; 
                }              
            }
            for (var i = seriesindex+1; i < numseries; i++)
            {
                if (indices[i][0]==indices[seriesindex][xyindex])
                {
                    indices[i][0] = -1;               
                    indices[i][1] = -1;               
                } 
                if (indices[i][1]==indices[seriesindex][xyindex])
                {
                    indices[i][1] = -1; 
                    indices[i][0] = -1; 
                }              
            }            

            console.log("indices",indices);

            $(this).css('border',oldthiscss);
            $(oldthis).addClass('disabled');
            redraw();
        }
    };  

    // some droppable from first part of code above
    $('tr.columnname input[name=columnname]').droppable(drpOptions);

    // set initial x and y
    $('.dragx, .dragy').each(function() {
        xyindex = $('span.draggable a').index($(this));
        oldthiscss = $(this).css('border');
        $('tr.columnname input[name=columnname]:eq('+xyindex+')').css('border',oldthiscss);
        $(this).addClass('disabled');
    });

    // draggable x and y
    $(function() {
        // drag
        $('.dragx, .dragy').draggable(drgOptions);
        // drop
        $('tr.columnname input[name=columnname]').droppable(drpOptions);
    });

    // must be global to allow for number input and increment/decrement
    var colorcnt = 1;
    // allow dynamic changing of number of series
    $('#data input[name=numseries]').change(function() {

        numseries = $('#data input[name=numseries]').val();

        if (!$.isNumeric(numseries))
        {
            $(this).val(numseriesold);
            numseries = numseriesold;
        }
        numseriesold = numseries;

        if (numseries < 1)
        {
            $('#data input[name=numseries]').val(1);
            numseries = 1;
        }
        if (numseries > 5)
        {
            $('#data input[name=numseries]').val(5);
            numseries = 5;
        }

        while($('#data span.draggable').length < numseries)
        {
            var newseries = $('#data span.draggable:last');
            newseries.after("<span class='draggable'>"+serieshtml+"</span>");
            //console.log("numdragx",$('#data span.draggable:last a.dragx').length);
            $('#data span.draggable:last a.dragx').css('border-color',colors[0].colors[colorcnt]);
            $('#data span.draggable:last a.dragy').css('border-color',colors2[0].colors[colorcnt]);
            $('#data span.draggable:last .dragx').draggable(drgOptions);
            $('#data span.draggable:last .dragy').draggable(drgOptions);
            indices.push([]);
            indices[colorcnt].push(-1);
            indices[colorcnt].push(-1);
            colorcnt++;
        }

        while($('#data span.draggable').length > numseries)
        {
            var xborder = $('#data span.draggable:last a.dragx').css('border-color');
            var yborder = $('#data span.draggable:last a.dragy').css('border-color');
            // remove series color from columnname row
            $('tr.columnname input').each(function() {
                if ($(this).css('border-color')==xborder)
                    $(this).css('border','none').css('border-bottom','1px solid #CCC');
                if ($(this).css('border-color')==yborder)
                    $(this).css('border','none').css('border-bottom','1px solid #CCC');
            });
            $('#data span.draggable:last').remove();
            indices.pop();
            colorcnt--;
        }
        redraw();
    });

    // allow dynamic changing of number of columns
    $('#data input[name=numcol]').change(function() {

        numcol = $('#data input[name=numcol]').val();

        if (!$.isNumeric(numcol))
        {
            $(this).val(numcolold);
            numcol = numcolold;
        }
        numcolold = numcol;

        if (numcol < 2)
        {
            $('#data input[name=numcol]').val(2);
            numcol = 2;
        }

        while($('#data .columnname td').length < numcol)
        {
            var newheader = $('#data tr:eq(0)');
            var newseries = $('#data tr.obs');
            newheader.append(headerhtml);
            columnname_array.push("");

            newseries.append(obshtml);
            series_array.push([]);
        }

        $('tr.columnname input[name=columnname]').droppable(drpOptions);

        while($('#data .columnname td').length > numcol)
        {
            $('#data .columnname td:last').remove();
            columnname_array.pop();
            $('#data tr.obs td:last-child').remove();
            
            series_array.pop();            
        }
        redraw();
    });

    // set default for csv textarea
    //$('#data textarea').text("Month,1,2,3,4,5,6,7,8,9,10,11,12\nMonth,1,2,3,4,5,6,7,8,9,10,11,12\nRainfall,3.36,3.38,4.32,3.74,3.49,3.68,3.43,3.35,3.44,3.94,3.99,3.78");
    //$('#data textarea').text("Month,1,2,3,4\nRainfall,3.36,3.38,4.32,3.74\nMonth,5,6,7,8\nRainfall,3.44,3.94,3.99,3.78\n");
    $('#data textarea').text("0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99\n2.3076741497498006, 5.413758072769269, 8.905341342790052, 9.19273382681422, 11.204882151447237, 11.191750677768141, 12.451603798894212, 13.264062342233956, 15.619032478425652, 14.536740426905453, 13.008948127739131, 16.2030343641527, 15.18273730110377, 13.115157623542473, 15.933126962278038, 13.6734653217718, 13.490749191027135, 16.542469833046198, 17.95868431823328, 16.83528434857726, 20.596883164951578, 20.168550630798563, 19.968416915275156, 21.596772393444553, 19.85940631176345, 17.819617295637727, 17.02180598746054, 19.170473766746, 19.525327715324238, 22.11754317721352, 19.798186164349318, 16.871666755527258, 18.15921054733917, 16.931256966665387, 18.379712163703516, 17.9124160958454, 19.020648456877097, 18.698050779290497, 17.720887264003977, 19.676026295637712, 17.72716410434805, 19.636148432036862, 18.752176828449592, 20.826951388269663, 22.532807719428092, 25.4961234186776, 28.433078564936295, 29.98950546234846, 30.231186064658687, 33.678143593948334, 32.07094384403899, 29.149969091871753, 31.038967323722318, 33.27734321937896, 32.08250897214748, 31.59697617799975, 32.93487929366529, 35.12353730830364, 33.3057136554271, 32.5022844793275, 34.11659527872689, 34.556488652015105, 31.74939301935956, 30.55516411131248, 32.034810840152204, 33.49710752046667, 34.15613681264222, 34.1868598156143, 37.40723969787359, 36.31127357110381, 37.929209324065596, 39.300601633498445, 42.43891684967093, 46.01262474502437, 44.1581038790755, 46.02307988051325, 46.488594584865496, 50.187442985596135, 47.96253143181093, 45.65120674134232, 48.19309226493351, 45.245698493439704, 44.848831524839625, 46.07778807799332, 43.311783336801454, 41.728698323946446, 41.592504718573764, 42.91927164257504, 43.18530106567778, 46.25395599543117, 50.08432255964726, 50.86993291438557, 54.23207359132357, 54.438606831477955, 54.722264093579724, 58.64648145623505, 57.99467162229121, 58.45930971787311, 56.879207299789414, 54.663091828813776\n0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99\n150.59692058619112, 151.12590484507382, 148.54840276879258, 151.76785184070468, 152.34653792041354, 154.18518864409998, 156.29533723858185, 159.45521872863173, 162.1334514399059, 162.84345683921129, 165.86824006959796, 169.3195283806417, 166.6551299097482, 167.90112046874128, 167.5158772454597, 166.9475875031203, 169.07550212694332, 171.13905495870858, 173.59069762169383, 174.9017568216659, 175.0597126870416, 176.5156059609726, 173.1571889917832, 170.78766693989746, 173.3441219322849, 172.28187246387824, 170.21829744544812, 168.5896513131447, 165.87210658122785, 163.83736938005313, 166.8470066350419, 169.13872791384347, 169.74616317334585, 167.99340517353266, 167.44319274369627, 166.86864383728243, 168.44254058063962, 171.1145219639875, 169.80366290034726, 167.79605414741673, 169.04670051764697, 166.47226258390583, 166.4195843648631, 168.52685079048388, 169.99365638312884, 171.4351596776396, 168.00087018194608, 169.53976278798655, 172.5535134144593, 170.0111526993569, 166.74256469891407, 164.9823732096702, 167.50522302743047, 169.81541264709085, 168.00397873530164, 165.9040234668646, 164.1861728699878, 163.45045590982772, 166.77849350171164, 168.86750809918158, 171.1059802121017, 169.91033410979435, 167.44385695504025, 167.2008009837009, 168.03887143405154, 164.90116449119523, 162.3452123226598, 162.4947510843631, 161.61942858807743, 163.1098948221188, 160.91637335834093, 160.80128376744688, 161.81776049686596, 162.52523517399095, 160.93103626812808, 163.0791448103264, 166.31865662662312, 166.11443983903155, 168.38716325187124, 170.38546407059766, 173.50101235695183, 170.58198807341978, 173.0775448528584, 170.72145668719895, 168.30118883191608, 170.37488985038362, 171.66736692073755, 169.45484390924685, 168.03120047575794, 168.60627887956798, 168.06402070564218, 169.84320588689297, 171.57101331069134, 172.5570257739164, 173.6549796962645, 172.1368937031366, 170.45112828654237, 173.2644439029973, 176.22970588388853, 174.53619416430593");

    var hasheader = 1;
    $('#data input[name=hasheader]').click(function() {
        if (this.checked)
            hasheader = 1;
        else
            hasheader = 0;
    });

    $('#update').click(function() {
        var csv_array = $.csv.toArrays($('#data textarea').val());
        // make sure textarea not empty
        if (csv_array.length == 0)
        {
            alert("No CSV data. Please try again.");
            $('#data textarea').focus();
        }
        else
        {
            // array length
            var arraylength = csv_array[0].length;
            var same = 1;

            // set numcol
            numcol = csv_array.length;

            // update numcol field
            $('#data input[name=numcol]').val(numcol);

            var nonnumericcnt = 0;
            var nonnumeric = 0;

            for (var i = 0; i < csv_array.length; i++)
            {
                same = (csv_array[i].length==arraylength);
                // starts from 1 if hasheader, else 0
                for (var j = hasheader; j < csv_array[i].length; j++) {
                    if (!$.isNumeric(csv_array[i][j]))
                        nonnumericcnt++;
                }
            }
            console.log("cnt",nonnumericcnt);
            nonnumeric = (nonnumericcnt>0);

            // make sure each row has same number of elements
            if (!same)
            {
                alert("CSV row length is not the same. Please try again.");
                $('#data textarea').focus();                
            }
            if (nonnumeric)
            {
                alert("Not all numeric values for non-header data. Please try again.");
                $('#data textarea').focus();                                
            }
            // make sure have at least two rows
            if (numcol < 2)
            {
                alert("Need at least 2 rows of data. Please try again.");
                $('#data textarea').focus();                                                
            }
            if (same && !nonnumeric)
            {
                if (hasheader)
                {
                    columnname_array = [];
                    for (var i = 0; i < csv_array.length; i++)
                    {
                        columnname_array.push(csv_array[i][0]);
                        csv_array[i] = csv_array[i].slice(1);
                        console.log(csv_array[i]);
                    }
                }
                else
                {
                    columnname_array = [];
                    for (var i = 0; i < csv_array.length; i++)
                        columnname_array.push('');
                }
                numobs = csv_array[0].length;
                series_array = [];
                for (var i = 0; i < numcol; i++)
                {
                    series_array.push(csv_array[i]);
                }
                for (var i = 0; i < numcol; i++)
                {
                    for (var j = 0; j < numobs; j++)
                    {
                        series_array[i][j] = parseFloat(series_array[i][j]);
                    }
                }
                updateTable();
                redraw();
                //drawLabels();
            }
        }
    });
/*
    // check if has negative numbers to change positions
    // called in redraw()
    function hasNegative() {
        var negcnt = 0;
        for (var i = 0; i < numseries; i++)
        {
            for (var j = 0; j < numcol; j++)
            {
                if (series_array[i][j] < 0)
                {
                    negcnt++;
                }
            }
        } 
        return negcnt;       
    }*/

    // buttons to indicate wrap or no wrap for csv textarea
    var wrap = 1;
    $('a#wrap').click(function() {
        $(this).addClass('active');
        $('a#nowrap').removeClass('active');
        $('textarea').attr('wrap','on');
        wrap = 1;
    });

    $('a#nowrap').click(function() {
        $(this).addClass('active');
        $('a#wrap').removeClass('active');
        $('textarea').attr('wrap','off');
        wrap = 0;
    });

    // settings for appearance of lines
    $('#linepts,#line,#pts,#smoothpts,#smooth').click(function() {
        lineoptionindex = $('.lineoptions a').index(this);
        $('.lineoptions a').removeClass('active');
        $('.lineoptions a:eq('+lineoptionindex+')').addClass('active');
        setDrawOptions();
    });

    // drawing functions
    function setDrawOptions()
    {
        switch (lineoptionindex)
        {
            case 0:
                drawoptions = { nostroke: false, axis: "0 0 1 1", symbol: "circle", smooth: false, colors: colors[colorindex].colors };
                break;
            case 1:
                drawoptions = { nostroke: false, axis: "0 0 1 1", symbol: "", smooth: false, colors: colors[colorindex].colors };
                break;
            case 2:
                drawoptions = { nostroke: false, axis: "0 0 1 1", symbol: "circle", smooth: false, colors: colors[colorindex].colors };
                break;
            case 3:
                drawoptions = { nostroke: false, axis: "0 0 1 1", symbol: "circle", smooth: true, colors: colors[colorindex].colors };
                break;   
            case 4:
                drawoptions = { nostroke: false, axis: "0 0 1 1", symbol: "", smooth: true, colors: colors[colorindex].colors };
                break;   
        }
        redraw();
    }

    function redraw()
    {
        var xgraph = padding;
        var ygraph = padding;
        var wgraph = w-padding*2;
        var hgraph = h-padding-bottom;

        // add 0,0 to each column to make sure graph includes origin
        for (var i = 0; i < numcol; i++)
            series_array[i].push(0);

        // don't draw if has [-1,-1] or [-1,x] or [x,-1]
        // only draw if has valid pair
        // wait for user to fix
        var indices_len = indices.length;
        var valid_seriesx_array = [];
        var valid_seriesy_array = [];
        // TODO
        //var selectedcolors = [];

        for (var i = 0; i < indices_len; i++)
        {
            if (indices[i][0] != -1 && indices[i][1] != -1)
            {
                valid_seriesx_array.push(indices[i][0]);
                valid_seriesy_array.push(indices[i][1]);
            }
        }

        console.log("valid",valid_seriesx_array);
        console.log("valid",valid_seriesy_array);
        var seriesx_array = [];
        var seriesy_array = [];
        for (var i = 0; i < valid_seriesx_array.length; i++)
        {
            seriesx_array.push(series_array[valid_seriesx_array[i]]);
            seriesy_array.push(series_array[valid_seriesy_array[i]]);
        }
        console.log("seriesx_array",seriesx_array);
        console.log("seriesy_array",seriesy_array);

        // TODO
        //drawoptions.colors = selectedcolors;

        var numplotseries = valid_seriesx_array.length;
        if (numplotseries > 0) 
        {
            $('path').remove();
            $('circle').remove();
            $('text:gt(0)').remove();

            r.linechart(xgraph, ygraph, wgraph, hgraph, seriesx_array, seriesy_array,
                drawoptions);

            //series_array = [[1,2,3],[3.36, 3.38, 4.32],[2,3,4],[3.36, 3.38, 4.32],[3,4,5],[3.36, 3.38, 4.32],[4,5,6],[3.36, 3.38, 4.32],[5,6,7],[3.36, 3.38, 4.32]];

            //r.linechart(xgraph, ygraph, wgraph, hgraph, [series_array[0],series_array[2],series_array[4],series_array[6],series_array[8]], [series_array[1],series_array[3],series_array[5],series_array[7],series_array[9]], 
            //    drawoptions);

            //r.linechart(xgraph, ygraph, wgraph, hgraph, series_array[indices[0]], series_array[indices[1]], 
            //    drawoptions);
            //series_array = [[1,2,3],[3.36, 3.38, 4.32]];

            var pathchar = 'L';
            // remove 0,0 and last circle and segment of path
            if (lineoptionindex == 0 || lineoptionindex == 2 || lineoptionindex == 3)
            {
                pathchar = (lineoptionindex == 3) ? 'C' : 'L';
                for (var i = 0; i < numplotseries; i++)
                {
                    var pathnum = i + 2;
                    var pathnum2 = pathnum + 1;
                    var numcircle1 = $('svg path:eq('+pathnum+')~circle').length;
                    var numcircle2 = $('svg path:eq('+pathnum2+')~circle').length;
                    console.log("numcircle1",numcircle1,"numcircle2",numcircle2);
                    var diff = numcircle1 - numcircle2;
                    console.log("diff",diff);
                    while (diff > numobs)
                    {
                        console.log("deleting");
                        var diffmin1 = diff - 1;
                        // this is the tricky css selector - last circle before last path
                        $('svg path:eq('+pathnum+')~circle:eq('+diffmin1+')').remove();
                        var d = $('svg path:eq('+pathnum+')').attr('d');
                        var substring = d.substring(0,d.lastIndexOf(pathchar));
                        //console.log(substring);
                        $('svg path:eq('+pathnum+')').attr('d',substring);
                        numcircle1 = $('svg path:eq('+pathnum+')~circle').length;
                        numcircle2 = $('svg path:eq('+pathnum2+')~circle').length;
                        console.log("numcircle1",numcircle1,"numcircle2",numcircle2);
                        
                        diff = numcircle1 - numcircle2;
                        console.log("diff",diff);
                        //console.log($('svg path:last').attr('d'));
                    }
                }
                if (lineoptionindex == 2)
                {
                    $('svg path:last').remove();
                    $('svg path:last').remove();
                }
            }
            else
            {
                pathchar = (lineoptionindex == 4) ? 'C' : 'L';
                var re = new RegExp(pathchar,"g");

                for (var i = 0; i < numplotseries; i++)
                {
                    var pathnum = i + 2;
                    var d = $('svg path:eq('+pathnum+')').attr('d');
                    // add one for initial M
                    console.log("numpts",d.match(re).length + 1);
                    console.log("numobs",numobs);

                    while ((d.match(re).length + 1) > numobs)
                    {
                        var substring = d.substring(0,d.lastIndexOf(pathchar));
                        $('svg path:eq('+pathnum+')').attr('d',substring);
                        // reset d now that it's been changed
                        d = $('svg path:eq('+pathnum+')').attr('d');
                    }
                }
            }

            // remove 0,0 
            for (var i = 0; i < numcol; i++)
                series_array[i].pop();

        }
        
        //drawValueLabels();
    }

    // based on csv edit, update table edit
    function updateTable()
    {
        while($('#data .columnname td').length < numcol)
        {
            var newheader = $('#data tr.columnname');
            var newobs = $('#data tr.obs');
            var newobshtml = $('#data tr.obs td:last').html();
            newheader.append(headerhtml);
            newobs.append("<td class='col'>"+newobshtml+"</td>");
        }
        // make droppable
        $('#data tr.columnname input').droppable(drpOptions);

        console.log("numcol",numcol);
        while($('#data .columnname td').length > numcol)
        {
            $('#data tr.columnname td:last').remove();
            $('#data tr.obs td:last-child').remove();          
        }

        while (numobsold < numobs) 
        {
            $('#data table').append('<tr class="obs">'+$('#data tr:last').html()+'</tr>');
            numobsold++;
        }
        while (numobsold > numobs && numobs > 1)
        {
            $('#data tr:last').remove();
            numobsold--;
        }

        var i = 0, j = 0;
        $('#data input[name=obs]').each(function(index) {
            $(this).val(series_array[i][j]);
            i++;
            if (i==numcol)
            {
                j++;
                i = 0;
            }
        });

        var i = 0;
        $('#data input[name=columnname]').each(function(index) {
            $(this).val(columnname_array[i]);
            i++;
        });
    }

    function setInputToArray(input_array, name, pos)
    {
        if (pos)
            $('#data tr.'+name+' td:nth-child('+pos+') '+'input[name='+name+']').each(function(index) {
                $(this).val(input_array[index]);
            });
        else
            $('#data tr.'+name+' input[name='+name+']').each(function(index) {
                $(this).val(input_array[index]);
            });            
    }
/*
    function drawLabels() {
        $('svg text[font="10px \'Helvetica Neue\'"]').remove();
        var barwidth = $('svg rect:first').attr('width')-1;

        if (stacked == 0)
            barwidth *= 2;

        // apply label
        var rectindex = 0;
        for (var j = 0; j < numcol; j++)
        {
            var labeltext = columnname_array[j];
            var barx = $('svg rect:eq('+rectindex+')').attr('x')-0;
            r.text(barx + barwidth/2, h - padding, labeltext).attr(labeltxtattr);
            rectindex += numseries;
        }
    }

    function drawValueLabels() {
        $('svg text[font="11px \'Helvetica Neue\'"]').remove();
        var barwidth = $('svg rect:first').attr('width')-1;

        var pathindex = 0;
        var rectindex = 0;

        if (numseries == 1)
        {
            for (var i = 0; i < numseries; i++)
            {
                for (var j = 0; j < numcol; j++)
                {
                    var labeltext = series_array[i][j];
                    var barx = $('svg rect:eq('+rectindex+')').attr('x')-0;
                    var d = $('svg path:eq('+pathindex+')').attr('d');
                    var dlen = d.length;
                    var bary = d.substring(d.lastIndexOf(',')+1, dlen-1)-0;
                    r.text(barx + barwidth/2, bary - 5, labeltext).attr(vallabeltxtattr);

                    pathindex++;
                    rectindex++;
                }
            }            
        }
        else {
            // for stacked or grouped bar chart
            // transpose multidimensional array to match sequence of svg objects
            var t = transposeArray(series_array);
            if (t != 0 && stacked == 1)
            { 
                // reverse elements in each array
                var collen = numcol;
                while (--collen >= 0)
                    t[collen].reverse();
            }
            // note need to change loop for transposed array
            for (var j = 0; j < numcol; j++)
            {
                for (var i = 0; i < numseries; i++)
                {
                    //console.log("j",j,"i",i);
                    var labeltext = t[j][i];
                    // don't show value label for value of 0 for stacked bar
                    if (labeltext == 0)
                        labeltext = "";
                    var barx = $('svg rect:eq('+rectindex+')').attr('x')-0;
                    var d = $('svg path:eq('+pathindex+')').attr('d');
                    var dlen = d.length;
                    var bary = d.substring(d.lastIndexOf(',')+1, dlen-1)-0;
                    r.text(barx + barwidth/2, bary - 5, labeltext).attr(vallabeltxtattr);

                    pathindex++;
                    if (stacked == 0)
                        rectindex++;
                }
                if (stacked == 1)
                    rectindex+=numseries;
            }
        }
    }

    function transposeArray(input_array) {
        // Calculate the width and height of the Array
        var w = input_array.length ? input_array.length : 0;
        var h = input_array[0] instanceof Array ? input_array[0].length : 0;

        // In case it is a zero matrix, no transpose routine needed.
        if (h === 0 || w <= 1)
            return 0;

        var i, j, t = [];

        // Loop through every item in the outer array (height)
        for(i=0; i<h; i++) {
            // Insert a new row (array)
            t[i] = [];
            // Loop through every item per item in outer array (width)
            for(j=0; j<w; j++) {
                // Save transposed data.
                t[i][j] = input_array[j][i];
            }
        }
        return t;
    }
*/

});