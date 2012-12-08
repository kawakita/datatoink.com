                var height_array = [];

                var minheight = 0;
                var height_index_array = [];
                var minindex = 0;
                var minpositive = 1;
                var negativecnt = 0;
                // gather some info about the column
                for (var i = 0; i < numseries; i++)
                {
                    var d = $('svg path:eq('+pathindex2+')').attr('d');
                    var dlen = d.length;
                    var bary1 = d.substring(d.lastIndexOf(',')+1, dlen-1)-0;
                    var bary2 = d.substring(d.indexOf(',')+1, d.indexOf('L'))-0;                                       
                    var diff = bary2 - bary1;
                    if (i == 0)
                    {
                        minheight = diff;
                        minindex = i;
                    }
                    if (diff < minheight)
                    {
                        minheight = diff;
                        minindex = i;
                        minpositive = (t[j][i] > 0);
                    }
                    if (t[j][i] < 0)
                        negativecnt++;
                    height_array.push(diff);
                    pathindex2++;
                }
                var allnegative = (negativecnt==numseries);
                var subtract = Math.min.apply(null, height_array);
                console.log("minpos",minpositive);
                console.log("subtract:", subtract, "minheight:", minheight);


                    else if (t[j][i] < 0)
                    {
                        console.log("<0");                       
                        // subtract if stacked
                        if (stacked == 0 || allnegative)
                            subtract = 0;
                        else if (minpositive)
                        {
                            console.log("height_array",height_array);
                            console.log("i",i);
                            var sum = 0;
                            for (var k = i; k < numseries-1; k++)
                                sum += height_array[k+1];
                            subtract = sum;
                        }
                        console.log("subtract",subtract);
                        var newy = bary2 - bary1 + bary2 - subtract;
                        // end of subtract
                        console.log("newy",newy);
                        var first = d.substring(0,d.lastIndexOf('L'));
                        var second = first.substring(0,first.lastIndexOf(',')+1);
                        var barx2 = d.substring(1,d.indexOf(','));
                        d = second + newy + "L"+ barx2 + "," + newy + "Z";
                        console.log("d",d);
                        $('svg path:eq('+pathindex+')').attr('d',d);                    
                    }
                    /*else if (t[j][i] > 0)
                    {
                        console.log(">0");                                               
                        // subtract if stacked
                        if (stacked == 0 || allnegative)
                            subtract = 0;
                        else if (minpositive)
                        {
                            console.log("height_array",height_array);
                            console.log("i",i);
                            subtract = height_array[i-1];
                        }
                        console.log("subtract",subtract);
                        var newy = bary2 - bary1 + bary2 - subtract;
                        // end of subtract
                        console.log("newy",newy);
                        var first = d.substring(0,d.lastIndexOf('L'));
                        var second = first.substring(0,first.lastIndexOf(',')+1);
                        var barx2 = d.substring(1,d.indexOf(','));
                        d = second + newy + "L"+ barx2 + "," + newy + "Z";
                        console.log("d",d);
                        $('svg path:eq('+pathindex+')').attr('d',d);                    
                    }*/