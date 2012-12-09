$(document).ready(function() {
    var padding = 20;
    var top = 10;
    var bottom = 20;
    var w = $('#holder').css('width');
    var h = $('#holder').css('height');
    w = w.substring(0, w.indexOf("px"));
    h = h.substring(0, h.indexOf("px"))
    console.log(w, h);

    var r = Raphael(document.getElementById("holder")),
        titletxtattr = { font: "18px 'Helvetica Neue'" },
        subtitletxtattr = { font: "14px 'Helvetica Neue'" },
        labeltxtattr = { font: "10px 'Helvetica Neue'" },
        vallabeltxtattr = { font: "11px 'Helvetica Neue'" };


    // colors array
    var colors = [
        {colors:["#8DD3C7","#FFFFB3","#BEBADA","#FB8072","#80B1D3","#FDB462","#B3DE69","#FCCDE5","#D9D9D9","#BC80BD","#CCEBC5","#FFED6F"]}
    ];
    var colorscopy = [
        {colors:["#8DD3C7","#FFFFB3","#BEBADA","#FB8072","#80B1D3","#FDB462","#B3DE69","#FCCDE5","#D9D9D9","#BC80BD","#CCEBC5","#FFED6F"]}
    ];
    console.log(colors[0].colors);
    var colorindex = 0;

    // set title
    var title = "Average Rainfall in Boston (inches)";
    $('#canvas input[name=title]').val(title);
    r.text(w/2, padding, title).attr(titletxtattr);

    // allow title to be changed
    $('#canvas input[name=title]').keyup(function() {
        title = $('#canvas input[name=title]').val();
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

    // set default value for bar
    $('#data input[name=series]').val(0);

    // get html of single column (columnname and series) so can append later
    var header = $('#data .columnname');
    var headerhtml = header.html();
    var series = $('#data .series');
    series.val(0);
    var serieshtml = series.html();

    // number of series
    var numseries = 1;
    var numseriesold = 1;

    // set up chart with example data
    //var columnname_array = ['Jan','Feb'];
    //var series_array = [[1,1]];    
    var columnname_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var series_array = [[3.36, 3.38, 4.32, 3.74, 3.49, 3.68, 3.43, 3.35, 3.44, 3.94, 3.99, 3.78]];
    //var columnname_array = ['Jan', 'Feb', 'Mar'];
    //var series_array = [[3.36, 3.38, 4.32]];

    var series_array_len = series_array[0].length;
    $('#data input[name=numcol]').val(series_array_len);
    var numcol = series_array_len;
    var numcolold = series_array_len;

    while($('#data .series td').length < numcol)
    {
        header.append(headerhtml);
        series.append(serieshtml);
    }

    setInputToArray(series_array[0], "series");
    setInputToArray(columnname_array, "columnname");

    redraw();
    drawLabels();

    // clear button
    $('#refresh-button').click(function() {
        for (var i = 0; i < numseries; i++)
        {
            for (var j = 0; j < numcol; j++)
            {
                series_array[i][j] = 0;
            }
        }
        for (var j = 0; j < numcol; j++)
        {
            columnname_array[j] = "";
        }
        title = "Title";
        $('#canvas input[name=title]').val(title);
        $('text:first tspan').text(title);
        subtitle = "-";
        $('#canvas input[name=subtitle]').val(subtitle);
        $('text:eq(1) tspan').text(subtitle);
        redraw();
        $('#data input[name=series]').val(0);
        $('#data input[name=columnname]').val("");
        drawLabels();
    });    

    // allow dynamic changing of number of columns
    $('#data input[name=numcol]').change(function() {

        numcol = $('#data input[name=numcol]').val();

        console.log("changing numcol", numseries);
        /*if (colorscopy[0].colors.length < numcol && numseries == 1) {
            var first = colors[0].colors[0];
            colors[0].colors = [];
            for (var i = 0; i < numcol; i++)
            {
                colors[0].colors.push(first);
            }
        }
        else {
            colors[0].colors = colorscopy[0].colors;
        }*/


        if (!$.isNumeric(numcol))
        {
            $(this).val(numcolold);
            numcol = numcolold;
        }
        numcolold = numcol;

        if (numcol < 1)
        {
            $('#data input[name=numcol]').val(1);
            numcol = 1;
        }

        while($('#data .columnname td').length < numcol)
        {
            var newheader = $('#data .columnname');
            var newseries = $('#data .series');
            newheader.append(headerhtml);
            columnname_array.push("");

            newseries.append(serieshtml);
            var serieslen = numseries;
            while (--serieslen >= 0)
                series_array[serieslen].push(0);
        }

        while($('#data .columnname td').length > numcol)
        {
            $('#data .columnname td:last').remove();
            columnname_array.pop();
            $('#data .series td:last-child').remove();
            
            var serieslen = numseries;
            while (--serieslen >= 0)
                series_array[serieslen].pop();            
        }
        redraw();
        drawLabels();
    });

    // allow dynamic changing of values
    $(document).on('change','#data input[name=series]',function() {
        // get index
        var index = $('#data input[name=series]').index(this);
        var colindex = index % numcol;
        var seriesindex = Math.floor(index / numcol);
        if (!$.isNumeric($(this).val()))
        {
            alert("Only numeric, nonmissing values.");
            $(this).val(series_array[seriesindex][colindex]);
            $(this).focus();
        }
        series_array[seriesindex][colindex] = $(this).val()-0;
        redraw();
    });

    // allow dynamic changing of labels
    $(document).on('change','#data input[name=columnname]',function() {
        // get index to get original value
        var index = $('#data input[name=columnname]').index(this);

        columnname_array[index] = $(this).val();
        drawLabels();
    });

    // allow additional series
    $('#add-series').click(function() {
        $('#data table').append('<tr class="series">'+$('#data tr:eq(1)').html()+'</tr>');
        numseries++;
        series_array.push([]);
        var collen = numcol;
        while (--collen >= 0)
            series_array[numseries-1].push(0);
        numseriesold = numseries;
        if (colorscopy[0].colors.length < numcol && numseries == 1) {
            var first = colors[0].colors[0];
            colors[0].colors = [];
            for (var i = 0; i < numcol; i++)
            {
                colors[0].colors.push(first);
            }
        }
        else {
            colors[0].colors = colorscopy[0].colors;
        }              
        
        redraw();
    });

    // remove additional series
    $('#remove-series').click(function() {
        if ($('#data tr').length > 2)
        {
            $('#data tr:last').remove();
            numseries--;
            series_array.pop();
        }
        numseriesold = numseries;
        redraw();
    });

    // buttons to indicate active status of stacked vs. grouped bar charts
    var stacked = 1;
    $('a#stacked').click(function() {
        $(this).addClass('active');
        $('a#grouped').removeClass('active');
        stacked = 1;
        redraw();
    });

    $('a#grouped').click(function() {
        $(this).addClass('active');
        $('a#stacked').removeClass('active');
        stacked = 0;
        redraw();
    });

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

    // set default for csv textarea
    //$('#data textarea').text("Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec\n3.36,3.38,4.32,3.74,3.49,3.68,3.43,3.35,3.44,3.94,3.99,3.78");
    $('#data textarea').text("USA,CHN,JPN,DEU,FRA,BRA,GBR,ITA,RUS,IND,CAN,ESP,AUS,MEX,KOR,IDN,NLD,TUR,CHE,SAU,SWE,POL,BEL,NOR,ARG,AUT,ZAF,ARE,THA,DNK\n15094000,7318499,5867154,3570556,2773032,2476652,2431589,2194750,1857770,1847982,1736051,1490810,1371764,1155316,1116247,846832,836257,773091,635650,576824,538131,514496,511533,485803,445989,418484,408237,360245,345649,332677\n");      
        //USA,CHN,JPN,DEU,FRA,BRA,GBR,ITA,RUS,IND,CAN,ESP,AUS,MEX,KOR,IDN,NLD,TUR,CHE,SAU,SWE,POL,BEL,NOR,ARG,AUT,ZAF,ARE,THA,DNK,COL,IRN,VEN,GRC,MYS,FIN,CHL,HKG,ISR,SGP
        //\n
        //15094000,7318499,5867154,3570556,2773032,2476652,2431589,2194750,1857770,1847982,1736051,1490810,1371764,1155316,1116247,846832,836257,773091,635650,576824,538131,514496,511533,485803,445989,418484,408237,360245,345649,332677,331655,331015,316482,298734,278671,266071,248585,243666,242929,239700\n");
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

            if (hasheader)
                numseries = csv_array.length - 1;
            else
                numseries = csv_array.length;

            // numeric length
            var nonnumericcnt = 0;
            var nonnumeric = 1;

            for (var i = 0; i < csv_array.length; i++)
            {
                same = (csv_array[i].length==arraylength);
                if (hasheader && i==0)
                    continue;
                for (var j = 0; j < csv_array[i].length; j++) {
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
            if (same && !nonnumeric)
            {
                if (hasheader)
                {
                    columnname_array = csv_array[0];
                    console.log(columnname_array);
                }
                else
                {
                    columnname_array = [];
                    for (var i = 0; i < csv_array[0].length; i++)
                        columnname_array.push("");
                }
                numcol = columnname_array.length;
                $('#data input[name=numcol]').val(numcol);
                
                console.log("csving numseries",numseries);
                if (colorscopy[0].colors.length < numcol && numseries == 1) {
                    var first = colors[0].colors[0];
                    colors[0].colors = [];
                    for (var i = 0; i < numcol; i++)
                    {
                        colors[0].colors.push(first);
                    }
                }
                else {
                    colors[0].colors = colorscopy[0].colors;
                }              

                series_array = [];
                for (var i = hasheader; i < numseries + hasheader; i++)
                {
                    series_array.push(csv_array[i]);
                }
                console.log(series_array);
                console.log(numseries);
                console.log(numcol);
                for (var i = 0; i < numseries; i++)
                {
                    for (var j = 0; j < numcol; j++)
                    {
                        series_array[i][j] = parseFloat(series_array[i][j]);
                    }
                }
                updateTable();
                redraw();
                drawLabels();
            }
        }
    });

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
    }

    /* negative values in barchart are a known issue in Raphael
     * fix here instead of changing core Raphael library */

    // generate array of binary indicators to indicate negative
    // neg_series_array has positive values
    var neg_array = [];
    var neg_series_array = []; 
    function genNegArray() {
        neg_array = [];
        neg_series_array = [];
        for (var i = 0; i < numseries; i++)
        {
            neg_array.push([]);
            neg_series_array.push([]);
            for (var j = 0; j < numcol; j++)
            {
                neg_array[i][j] = 0;
                neg_series_array[i][j] = series_array[i][j];
                if (series_array[i][j] < 0)
                {
                    // make negative series_array values positive
                    neg_series_array[i][j] = series_array[i][j]*-1;
                    // fill in 1's for neg_array
                    neg_array[i][j] = 1;
                }
            }
        } 
        console.log(neg_array);
    }

    // ancillary functions called above
    function redraw()
    {
        $('path').remove();
        $('rect').remove();
        console.log("redraw:", series_array);

        var xgraph = padding;
        var ygraph = padding;
        var wgraph = w-padding*2;
        var hgraph = h-padding-bottom;

        var negcnt = hasNegative();
        if (negcnt)
        {
            // generate indicator array of neg values
            genNegArray();
            // change height of graph
            hgraph = hgraph/2+padding;

            if (numseries == 1)
                r.barchart(xgraph, ygraph, wgraph, hgraph, neg_series_array[0], {colors: colors[colorindex].colors});
            else if (stacked == 1)
                r.barchart(xgraph, ygraph, wgraph, hgraph, neg_series_array, {stacked: true, colors: colors[colorindex].colors});
            else if (stacked == 0)
                r.barchart(xgraph, ygraph, wgraph, hgraph, neg_series_array, {colors: colors[colorindex].colors});
        }
        else {
            if (numseries == 1)
                r.barchart(xgraph, ygraph, wgraph, hgraph, series_array[0], {colors: colors[colorindex].colors});
            else if (stacked == 1)
                r.barchart(xgraph, ygraph, wgraph, hgraph, series_array, {stacked: true, colors: colors[colorindex].colors});
            else if (stacked == 0)
                r.barchart(xgraph, ygraph, wgraph, hgraph, series_array, {colors: colors[colorindex].colors});
        }
        if (negcnt)
        {
            // mirror bars
            fixNegative();
        }
        drawValueLabels();
    }

    // make negative values positive then turn negative
    // also change height of graph
    function fixNegative() {
        var pathindex = 0;

        if (numseries == 1)
        {
            for (var i = 0; i < numseries; i++)
            {
                for (var j = 0; j < numcol; j++)
                {
                    if (series_array[i][j] < 0)
                    {
                        var d = $('svg path:eq('+pathindex+')').attr('d');
                        var dlen = d.length;
                        var bary1 = d.substring(d.lastIndexOf(',')+1, dlen-1)-0;
                        var bary2 = d.substring(d.indexOf(',')+1, d.indexOf('L'))-0;                                       
                        var newy = bary2 - bary1 + bary2;
                        var first = d.substring(0,d.lastIndexOf('L'));
                        var second = first.substring(0,first.lastIndexOf(',')+1);
                        var barx2 = d.substring(1,d.indexOf(','));
                        d = second + newy + "L"+ barx2 + "," + newy + "Z";
                        $('svg path:eq('+pathindex+')').attr('d',d);                    
                    }
                    pathindex++;
                }
            }       
        }
        else {
            // for stacked or grouped bar chart
            // transpose multidimensional array to match sequence of svg objects
            var t = transposeArray(series_array);
            console.log("T", t);
            if (t != 0 && stacked == 1)
            { 
                // reverse elements in each array
                var collen = numcol;
                while (--collen >= 0)
                    t[collen].reverse();
            }
            // flipping negative values     
            var minheight_array = [];
            var minvalue_array = [];
            for (var j = 0; j < numcol; j++)
            {
                for (var i = 0; i < numseries; i++)
                {
                    //console.log("flipping",t[j][i],"i",i);

                    var d = $('svg path:eq('+pathindex+')').attr('d');
                    //console.log("d",d);
                    var dlen = d.length;
                    var bary1 = d.substring(d.lastIndexOf(',')+1, dlen-1)-0;
                    //console.log("y1",bary1);
                    var bary2 = d.substring(d.indexOf(',')+1, d.indexOf('L'))-0;                                       
                    //console.log("y2",bary2);

                    if (i == numseries - 1)
                    {
                        minheight_array.push(bary2 - bary1);
                        minvalue_array.push(t[j][i]);
                    }

                    if (t[j][i] == 0 && stacked == 1)  
                    {
                        //console.log("==0");
                        var newy = bary2;
                        // end of subtract
                        //console.log("newy",newy);
                        var first = d.substring(0,d.lastIndexOf('L'));
                        var second = first.substring(0,first.lastIndexOf(',')+1);
                        var barx2 = d.substring(1,d.indexOf(','));
                        d = second + newy + "L"+ barx2 + "," + newy + "Z";
                        //console.log("d",d);
                        $('svg path:eq('+pathindex+')').attr('d',d);                           
                    }         
                    else if (t[j][i] < 0)
                    {
                        //console.log("<0");                       

                        var newy = bary2 - bary1 + bary2;
                        //console.log("newy",newy);
                        var first = d.substring(0,d.lastIndexOf('L'));
                        var second = first.substring(0,first.lastIndexOf(',')+1);
                        var barx2 = d.substring(1,d.indexOf(','));
                        d = second + newy + "L"+ barx2 + "," + newy + "Z";
                        //console.log("d",d);
                        $('svg path:eq('+pathindex+')').attr('d',d);                    
                    }
                    pathindex++;
                }
            }
            //console.log("minheight_array",minheight_array);
            //console.log("minvalue_array",minvalue_array);
            var ratio = Math.abs(minheight_array[0]/minvalue_array[0]);
            console.log("ratio",ratio);

            // now that you've flipped, scale by a ratio using the front-most bar
            // then add on the height of any previous bars using neg_array
            var pathindex = 0, pathindex2 = 0;

            for (var j = 0; j < numcol; j++)
            {
                var pos_height_array = [];
                var neg_height_array = [];

                /*** SCALING ***/

                console.log("-----COLUMN", j,"-----");
                for (var i = 0; i < numseries; i++)
                {
                    //console.log("Scaling!",j,i);
                    //console.log("value:",t[j][i]);
                    var d = $('svg path:eq('+pathindex+')').attr('d');
                    //console.log("d",d);
                    var dlen = d.length;
                    var bary1 = d.substring(d.lastIndexOf(',')+1, dlen-1)-0;
                    //console.log("y1",bary1);
                    var bary2 = d.substring(d.indexOf(',')+1, d.indexOf('L'))-0;                                       
                    //console.log("y2",bary2);

                    // scale all values     
                    if (t[j][i] == 0)
                    {
                        neg_height_array.push(0);                         
                        pos_height_array.push(0);                         
                    }
                    else if (t[j][i] < 0)
                    {
                        var pseudoval = Math.abs((bary1-bary2)/ratio);
                        //console.log("pseudoval",pseudoval);
                        var newy = bary2 + ratio*Math.abs(t[j][i]);
                        //console.log("newy",newy);

                        var first = d.substring(0,d.lastIndexOf('L'));
                        var second = first.substring(0,first.lastIndexOf(',')+1);
                        var barx2 = d.substring(1,d.indexOf(','));
                        d = second + newy + "L"+ barx2 + "," + newy + "Z";
                        //console.log("d",d);
                        $('svg path:eq('+pathindex+')').attr('d',d); 

                        neg_height_array.push(ratio*Math.abs(t[j][i]));
                        pos_height_array.push(0); 
                    }
                    else if (t[j][i] > 0)
                    {
                        var pseudoval = Math.abs((bary1-bary2)/ratio);
                        //console.log("pseudoval",pseudoval);
                        var newy = bary2 - ratio*Math.abs(t[j][i]);
                        //console.log("newy",newy);

                        var first = d.substring(0,d.lastIndexOf('L'));
                        var second = first.substring(0,first.lastIndexOf(',')+1);
                        var barx2 = d.substring(1,d.indexOf(','));
                        d = second + newy + "L"+ barx2 + "," + newy + "Z";
                        //console.log("d",d);
                        $('svg path:eq('+pathindex+')').attr('d',d); 

                        pos_height_array.push(ratio*Math.abs(t[j][i]));
                        neg_height_array.push(0);  
                    }
                    pathindex++;
                }
                /*** END OF SCALING ***/

                /*** DETERMINE ADJUSTMENT ***/
                console.log("pos_height_array",pos_height_array);
                console.log("neg_height_array",neg_height_array);

                var change_pos_height_array = Array(pos_height_array.length);
                var change_neg_height_array = Array(neg_height_array.length);

                // set array to zeroes
                for (var c = 0; c < numseries; c++)
                {
                    change_pos_height_array[c] = 0;
                    change_neg_height_array[c] = 0;
                }

                // find minimum
                var posmin = returnMin(pos_height_array,Math.max.apply(null,pos_height_array),0);
                var negmin = returnMin(neg_height_array,Math.max.apply(null,neg_height_array),0);

                console.log("posmin",posmin);
                console.log("negmin",negmin);
                
                var posnonzerocnt = countNonZero(pos_height_array);
                var negnonzerocnt = countNonZero(neg_height_array);

                var possum = 0;
                var next = 0;
                var changecnt = 0;
                while (changecnt < posnonzerocnt-1 && posnonzerocnt!=1)
                {
                    console.log("in loop");
                    if (changecnt == 0)
                    {
                        possum = possum + pos_height_array[posmin[1]];
                        pos_height_array[posmin[1]] = 0;
                    }
                    else {
                        possum = possum + pos_height_array[next];
                        pos_height_array[next] = 0;
                    }
                    next = returnNextNonZero(pos_height_array);                    
                    change_pos_height_array[next] = possum;
                    changecnt++;
                }
                
                var negsum = 0;
                var next = 0;
                var changecnt = 0;
                while (changecnt < negnonzerocnt-1 && negnonzerocnt!=1)
                {
                    console.log("in loop");
                    if (changecnt == 0)
                    {
                        negsum = negsum + neg_height_array[negmin[1]];
                        neg_height_array[negmin[1]] = 0;
                    }
                    else {
                        negsum = negsum + neg_height_array[next];
                        neg_height_array[next] = 0;
                    }
                    next = returnNextNonZero(neg_height_array);                    
                    change_neg_height_array[next] = negsum;
                    changecnt++;
                }

                console.log("POS",change_pos_height_array);
                console.log("NEG",change_neg_height_array);
                /*** END OF DETERMINE ADJUSTMENT ***/

                /*** APPLY ADJUSTMENT ***/

                for (var i = 0; i < numseries; i++)
                {
                    console.log("series",i,"changing");
                    var d = $('svg path:eq('+pathindex2+')').attr('d');
                    var dlen = d.length;
                    var bary1 = d.substring(d.lastIndexOf(',')+1, dlen-1)-0;
                    var bary2 = d.substring(d.indexOf(',')+1, d.indexOf('L'))-0; 

                    if (t[j][i] > 0 && posnonzerocnt!=1)
                    {
                        var pseudoval = Math.abs((bary1-bary2)/ratio);
                        console.log("POS",change_pos_height_array[i]);
                        var newy = bary1 - change_pos_height_array[i];
                        console.log("y1",bary1,"->",newy);

                        var first = d.substring(0,d.lastIndexOf('L'));
                        var second = first.substring(0,first.lastIndexOf(',')+1);
                        var barx2 = d.substring(1,d.indexOf(','));
                        d = second + newy + "L"+ barx2 + "," + newy + "Z";
                        $('svg path:eq('+pathindex2+')').attr('d',d); 
                    }
                    else if (t[j][i] < 0 && negnonzerocnt!=1)
                    {
                        var pseudoval = Math.abs((bary1-bary2)/ratio);
                        var newy = bary1 + change_neg_height_array[i];
                        console.log("y1",bary1,"->",newy);

                        var first = d.substring(0,d.lastIndexOf('L'));
                        var second = first.substring(0,first.lastIndexOf(',')+1);
                        var barx2 = d.substring(1,d.indexOf(','));
                        d = second + newy + "L"+ barx2 + "," + newy + "Z";
                        $('svg path:eq('+pathindex2+')').attr('d',d); 
                    }                    
                    pathindex2++;
                }
                /*** END OF APPLY ADJUSTMENT ***/
            }
        }
    }

    // want non-zero min height and index
    // if have same value, you want higher index
    // b/c that bar is going to be stacked on top of the ones with lower index
    // once all values in array are zero set returnarray[0] to 0
    function returnMin(input_array, defaultval, defaultindex)
    {
        var min = defaultval;
        var minindex = defaultindex;
        for (var i = 0; i < numseries; i++)
        {
            if ((input_array[i] < min || input_array[i] == min) && input_array[i]!=0)
            {
                min = input_array[i];
                minindex = i;
            } 
        }    
        var returnarray = [min, minindex];
        return returnarray;   
    }

    function returnNextNonZero(input_array)
    {
        var index = -1;
        for (var i = numseries-1; i >= 0; i--)
        {
            if (input_array[i]!=0)
            {
                index = i;
                break;
            } 
        }    
        return index;   
    }

    function countNonZero(input_array) {
        var nonzerocnt = 0;
        for (var i = 0; i < numseries; i++)
        {
            if (input_array[i]!=0)
            {
                nonzerocnt++;
            } 
        }   
        return nonzerocnt;
    }

    // based on csv edit, update table edit
    function updateTable()
    {
        while($('#data .columnname td').length < numcol)
        {
            var newheader = $('#data .columnname');
            var newseries = $('#data .series');
            newheader.append(headerhtml);
            newseries.append(serieshtml);
        }
        while($('#data .columnname td').length > numcol)
        {
            $('#data .columnname td:last').remove();
            $('#data .series td:last-child').remove();          
        }
        console.log(numseriesold);
        console.log(numseries);

        while (numseriesold < numseries) 
        {
            $('#data table').append('<tr class="series">'+$('#data tr:eq(1)').html()+'</tr>');
            numseriesold++;
        }
        while (numseriesold > numseries && numseriesold > 1)
        {
            $('#data tr:last').remove();
            numseriesold--;
        }

        var i = 0, j = 0;
        $('#data input[name=series]').each(function(index) {
            $(this).val(series_array[i][j]);
            j++;
            if (j==numcol)
            {
                i++;
                j = 0;
            }
        });

        var i = 0;
        $('#data input[name=columnname]').each(function(index) {
            $(this).val(columnname_array[i]);
            i++;
        });
    }

    function setInputToArray(input_array, name)
    {
        $('#data input[name='+name+']').each(function(index) {
            $(this).val(input_array[index]);
        });
    }

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

    $('a[href=#save]').click(function() {
        $('#save input[name=title]').val(title);
    });

    $('#save input[name=title]').keyup(function() {
        title = $('#save input[name=title]').val();
        $('text:first tspan').text(title);
        $('#canvas input[name=title]').val(title);
    });


    $('#saveform').submit(function() {

        var action = $('#saveform').attr('action');
        console.log(action);

        var series_array_string = "";
        for (var i = 0; i < series_array.length; i++)
        {
            series_array_string += "[" + series_array[i].toString() + "]"; 
            if (i < series_array.length - 1)
                series_array_string += ",";
        }

        var columnname_array_string = "[" + columnname_array.toString() + "]";

        var form_data = {
            type: "bar",
            series_array: series_array_string,
            columnname_array: columnname_array_string,
            header: hasheader,
            title: $('#canvas input[name=title]').val(),
            subtitle: $('#canvas input[name=subtitle]').val(),
            numcol: parseInt($('#data input[name=numcol]').val()),
            numseries: 0,
            structure: stacked,
            seriesx_array: -1,
            seriesy_array: -1
        };

        $.ajax({
            type: "POST",
            url: action,
            data: form_data,
            dataType: "json",
            success: function(response)
            {
                if (response[0] == "success")
                {
                    alert("success");
                }
                else {
                    alert("failure");
                    //$('.modal-body p.error').text('That account already exists. Please try again.');
                }
            }
        });
        return false;  
    });      

});