
<h2>Bar Chart</h2>
<hr>
<div id="holder"></div>
<div id="options">
    <ul class="nav nav-tabs primary">
        <li><a href="#canvas" data-toggle="tab">Canvas</a></li>
        <li><a href="#data" data-toggle="tab">Data</a></li>
    </ul>
    <div class="tab-content">       
        <div class="tab-pane" id="canvas">
            <ul class="nav nav-tabs secondary">
                <li><a href="#canvastitle" data-toggle="tab">Title</a></li>
                <li><a href="#canvasdimensions" data-toggle="tab">Dimensions</a></li>
                <li><a href="#canvaspadding" data-toggle="tab">Padding</a></li>
            </ul> 
            <div class="tab-content">
                <div class="tab-pane active" id="canvastitle">
                    <span class="fieldname">Title</span> 
                    <input type="text" name="title" placeholder="Title">
                    <br>
                    <span class="fieldname">Subtitle</span> 
                    <input type="text" name="subtitle" placeholder="Subtitle"> 
                </div>
                <div class="tab-pane" id="canvasdimensions">
                    <span class="fieldname">
                        Auto Width
                        <input type="checkbox" name="autowidth" checked="yes">
                    </span> 
                </div>
                <div class="tab-pane" id="canvaspadding">
                    <span class="fieldname">
                        Auto Padding
                        <input type="checkbox" name="autopadding" checked="yes">
                    </span> 

                </div>
            </div>           
        </div>
        <div class="tab-pane active" id="data">
            <ul class="nav nav-tabs secondary">
                <li><a href="#datatable" data-toggle="tab">Table Edit</a></li>
                <li><a href="#datacsv" data-toggle="tab">CSV Edit</a></li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane active" id="datatable">
                    <input type="number" name="numcol" min="1" placeholder="# columns"> 
                    <span class="fieldname">Columns</span>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <!-- stacked vs. grouped button -->
                    <span class="btn-toolbar">
                      <span class="btn-group">
                        <a class="btn" id="stacked"><i class="icon-align-justify"></i></a>
                        <a class="btn" id="grouped"><i class="icon-align-left"></i></a>
                      </span>
                    </span>
                    <!-- end -->
                    <table>
                        <tr class="columnname">
                            <td class="col">
                                <input type="text" name="columnname">
                            </td>
                        </tr>
                        <tr class="series">
                            <td class="col">
                                <input type="text" name="series" value="0">
                            </td>
                        </tr>
                    </table>
                    <!-- add, remove, clear button -->                    
                    <span class="btn-toolbar">
                      <span class="btn-group">                    
                            <input class="btn" type="button" id="add-series" value="Add Series">
                            <input class="btn" type="button" id="remove-series" value="Remove Series">
                            <input class="btn" type="button" id="refresh-button" value="Clear">
                        </span>
                    </span>  
                </div>
                <div class="tab-pane" id="datacsv">
                    <span class="fieldname">
                        Includes Header Row &nbsp;<input type="checkbox" name="hasheader" checked="yes">
                    </span>
                    <br>
                    <div id="textarea">
                        <textarea></textarea>
                    </div>
                    <div id="wrap-options">                
                        <a class="btn active" id="wrap"><i class="icon-share-alt"></i></a>
                        <br>
                        <a class="btn" id="nowrap"><i class="icon-arrow-right"></i></a>
                    </div>
                    <div class="clear">
                        <input class="btn" type="button" id="update" value="Update">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
