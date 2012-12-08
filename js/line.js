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
        labeltxtattr = { font: "10px 'Helvetica Neue'" },
        vallabeltxtattr = { font: "11px 'Helvetica Neue'" };

    // draw baseline

    // colors array
    var colors = [
        {colors:["#8DD3C7","#FFFFB3","#BEBADA","#FB8072","#80B1D3","#FDB462","#B3DE69","#FCCDE5","#D9D9D9","#BC80BD","#CCEBC5","#FFED6F"]}
    ];
    console.log(colors[0].colors);
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

    // set default value for observations
    $('#data input[name=obs]').val(0);

    // get html of series (columnname and pair) so can append later
    var header = $('#data tr:first');
    var headerhtml = header.html();
    var obs = $('#data tr:last');
    var obshtml = obs.html();

    // set up chart with example data
    var columnname_array = ['Month','Rainfall']
    var series_array = [[1,2,3],[3.36, 3.38, 4.32]];

    // number of col
    var numcol = series_array.length;
    var numcolold = series_array.length;
    $('#data input[name=numcol]').val(numcol);

    // number of obs
    var obs_len = series_array[0].length;
    var numobs = obs_len;
    var numobsold = obs_len;

    while($('#data .columnname td').length < numcol)
    {
        header.append(headerhtml);
        obs.append(obshtml);
    }

    var obshtml2 = $('#data tr:eq(1)').html();
    while($('#data tr.obs').length < numobs)
    {
        $('#data tr:eq(1)').after("<tr class='obs'>"+obshtml2+"</tr>");
    }
    
    setInputToArray(columnname_array, "columnname");    
    setInputToArray(series_array[0], "obs", 1); // 1 b/c 1st child
    setInputToArray(series_array[1], "obs", 2); // 2 b/c 2nd child

    //redraw();
    
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
        //redraw();
        $('#data input[name=obs]').val(0);
        $('#data input[name=columnname]').val("");
        //drawLabels();
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

        while($('#data .columnname td').length > numcol)
        {
            $('#data .columnname td:last').remove();
            columnname_array.pop();
            $('#data tr.obs td:last-child').remove();
            
            series_array.pop();            
        }
        //redraw();
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
        //redraw();
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

    var indices = [0,1];
    // set x and y columnname sborder
    $('#dragx, #dragy').each(function(index) {
        var index = $('span.draggable a').index($(this));
        var oldthiscss = $(this).css('border');
        $('tr.columnname input[name=columnname]:eq('+index+')').css('border',oldthiscss);
        $(this).addClass('disabled');
    });

    // draggable x and y
    // for when document is unchanged
    $(function() {
        var index = 0, oldthis = 0, oldthiscss = 0;
        $('#dragx, #dragy').draggable({ 
            revert: true, 
            snap: "input[name=columnname]",
            drag: function(event, ui) {
                // get index of button
                index = $('span.draggable a').index(this);
                // get handle and border
                oldthis = $(this); 
                oldthiscss = $(this).css('border');                               
                $(this).removeClass('disabled');
            }
        });
        $('tr.columnname input[name=columnname]').droppable({
            drop: function(event, ui) { 
                // remove border of that color
                $('tr.columnname input[name=columnname]:eq('+indices[index]+')').css('border','none');                
                // get column index
                var headerindex = $('tr.columnname input[name=columnname]').index(this);
                console.log("headerindex",headerindex);
                indices[index] = headerindex;
                if (indices[0]==indices[1])
                {
                    if (index == 0 )
                        indices[1] = -1;
                    else if (index == 1)
                        indices[0] = -1;
                }

                console.log("indices",indices);

                $(this).css('border',oldthiscss);
                $(oldthis).addClass('disabled');
            }
        });
    });
    // again for when document changes
    $(document).on('change',function() {
        var index = 0, oldthis = 0, oldthiscss = 0;
        $('#dragx, #dragy').draggable({ 
            revert: true, 
            snap: "input[name=columnname]",
            drag: function(event, ui) {
                // get index of button
                index = $('span.draggable a').index(this);
                // get handle and border
                oldthis = $(this); 
                oldthiscss = $(this).css('border');                               
                $(this).removeClass('disabled');
            }
        });
        $('tr.columnname input[name=columnname]').droppable({
            drop: function(event, ui) { 
                // remove border of that color
                $('tr.columnname input[name=columnname]:eq('+indices[index]+')').css('border','none');                
                // get column index
                var headerindex = $('tr.columnname input[name=columnname]').index(this);
                console.log("headerindex",headerindex);
                indices[index] = headerindex;
                if (indices[0]==indices[1])
                {
                    if (index == 0 )
                        indices[1] = -1;
                    else if (index == 1)
                        indices[0] = -1;
                }

                console.log("indices",indices);

                $(this).css('border',oldthiscss);
                $(oldthis).addClass('disabled');
            }
        });
    });

/*

    // new buttons for stroke and no stroke

    // buttons to indicate active status of stacked vs. grouped bar charts
    var stacked = 1;
    $('a#stacked').click(function() {

        redraw();
    });

    $('a#grouped').click(function() {

        redraw();
    });
*/
    // set default for csv textarea
    $('#data textarea').text("1,2,3,4,5,6,7,8,9,10,11,12\n3.36,3.38,4.32,3.74,3.49,3.68,3.43,3.35,3.44,3.94,3.99,3.78");

    $('#update').click(function() {
        var csv_array = $.csv.toArrays($('#data textarea').val());
        // make sure textarea not empty
        if (csv_array.length == 0)
        {
            alert("No CSV data. Please try again.");
            $('#data textarea').focus();
        }
        /*else
        {
            // array length
            var arraylength = csv_array[0].length;
            var same = 1;

            // set numseries so numericlength accurate
            if (hasheader)
                numseries = csv_array.length - 1;
            else
                numseries = csv_array.length;

            // numeric length
            var numericlength = arraylength*numseries;
            var numericcnt = 0;
            var allnumeric = 1;

            for (var i = 0; i < csv_array.length; i++)
            {
                same = (csv_array[i].length==arraylength);
                for (var j = 0; j < csv_array[i].length; j++) {
                    if ($.isNumeric(csv_array[i][j]))
                        numericcnt++;
                }
            }
            console.log("length",numericlength);
            console.log("cnt",numericcnt);
            allnumeric = (numericcnt==numericlength);

            // make sure each row has same number of elements
            if (!same)
            {
                alert("CSV row length is not the same. Please try again.");
                $('#data textarea').focus();                
            }
            if (!allnumeric)
            {
                alert("Not all numeric values for non-header data. Please try again.");
                $('#data textarea').focus();                                
            }
            if (same && allnumeric)
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
                //redraw();
                //drawLabels();
            }
        }*/
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

    // ancillary functions called above
    function redraw()
    {
        $('path').remove();
        $('circle').remove();
        console.log("redraw:", series_array);

        var xgraph = padding;
        var ygraph = padding;
        var wgraph = w-padding*2;
        var hgraph = h-padding-bottom;

        r.linechart(xgraph, ygraph, wgraph, hgraph, series_array[0], series_array[1], 
            { nostroke: false, axis: "0 0 1 1", symbol: "circle", smooth: false, colors: colors[colorindex].colors});
        //drawValueLabels();
    }
/*
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
    }*/

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