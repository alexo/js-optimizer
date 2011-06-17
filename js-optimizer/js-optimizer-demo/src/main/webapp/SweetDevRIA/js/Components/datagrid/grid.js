/** ------------------------------------
 * SweetDEV RIA library
 * Copyright [2006] [Ideo Technologies]
 * ------------------------------------
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 		http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * For more information, please contact us at:
 *         Ideo Technologies S.A
 *        124 rue de Verdun
 *        92800 Puteaux - France
 *
 *      France & Europe Phone : +33 1.46.25.09.60
 *         USA & Canada Phone : (201) 984-7514
 *
 *        web : http://www.ideotechnologies.com
 *        email : SweetDEV-RIA@ideotechnologies.com
 *
 *
 * @version 2.2
 * @author Ideo Technologies
 */
 /**
* This is the Table component class 
* @param {String} id Id of this table
* @constructor
* @extends RiaComponent
* @base RiaComponent
*/
SweetDevRia.Grid = function (id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Grid");

	this.columns = {};
	
	this.columnNumber = 0;
	this.visibleColumnNumber = 0;
	
	this.width = null;
	this.columnSizeSum = 0; // Sum of column's width
	
	this.checkboxColWidth = 30; 
	this.minColumnWidth = 30;
	
	// used by adjustLastColumnSize mehtod
	this.keepColumnWidth = true;
	
	this.draggableColumns = true; 
	
	this.resizable = true;

	this.selectionMode = SweetDevRia.Grid.prototype.NO_SELECTION;
	this.selection = null;
	
	this.displayCheckbox = false;
	this.checkedRows = [];
	
	this.lastSelectionAdded = null;  //Last row or cell added to selection (by key, click or API)
	
	this.loadAllData = false;
	this.rowPerPage = 50;
	this.actualPage = 1;
	this.pageNumber = 1;


	this.totalDataNumber = 6;

	this.innerExportId = null;
	
	this.heightHeader = null;
	this.heightRow = null;
	this.height = null;
	
	this.adjustedColumnId = null;
	
	this.isInitialized = false;
	
	
	this.sortPropertiesDeep = 3;
	
	
	/**
	 * Ids
	 */
	this.headPrefix = this.id+"_"+SweetDevRia.Grid.HEAD_COLUMN;
	this.spliterPrefix = this.id+"_"+SweetDevRia.Grid.HEAD_COLUMN_SPLITER;
	this.ddArrowId = this.id+"_"+SweetDevRia.Grid.DD_ARROW;
	this.theadId = this.id+"_"+SweetDevRia.Grid.THEAD;
	this.tbodyId = this.id+"_"+SweetDevRia.Grid.TBODY;
	this.resizerId = this.id+"_"+SweetDevRia.Grid.RESIZER;
	this.pageBarId = this.id+"_"+SweetDevRia.Grid.PAGEBAR;
	this.sortPropertiesWindowId = this.id+"_"+SweetDevRia.Grid.SORT_PROPERTIES;
	this.excelPropertiesWindowId = this.id+"_"+SweetDevRia.Grid.EXCEL_PROPERTIES;
	
	
	
	/**
	 * accessors
	 */	
	this.tableBody = null;
	this.tableHead = null;
	this.spliters = [];
	this.headerDDs = {};
	this.resizer = null;
	this.ddArrow = null;
};

extendsClass (SweetDevRia.Grid, SweetDevRia.RiaComponent);


/**
 * Constants
 */

/**
 * This constant indicate that no selection is possible in this table.
 * @type int
 */
SweetDevRia.Grid.NO_SELECTION = 0;

/**
 * This constant indicate that the user can select only one row at once.
 * @type int
 */
SweetDevRia.Grid.ROW_SELECTION = 1;

/**
 * This constant indicate that the user can select many rows.
 * @type int
 */
SweetDevRia.Grid.ROWS_SELECTION = 2;

/**
 * This constant indicate that the user can select only one cell at once.
 * @type int
 */
SweetDevRia.Grid.CELL_SELECTION = 3;

/**
 * This constant indicate that the user can select many cells.
 * @type int
 */
SweetDevRia.Grid.CELLS_SELECTION = 4;

/**
 * This constant indicate that the excel export will contain data like display at the screen (hidden columns, order, etc...).
 * @type int
 */
SweetDevRia.Grid.WYSIWYG_EXPORT = 1;

/**
 * This constant indicate that the excel export will contain all data included in server model.
 * @type int
 */
SweetDevRia.Grid.MODEL_EXPORT = 2;



SweetDevRia.Grid.HEAD = "head";
SweetDevRia.Grid.THEAD = "thead";
SweetDevRia.Grid.BODY = "body";
SweetDevRia.Grid.TBODY = "tbody";
SweetDevRia.Grid.FOOT = "foot";
SweetDevRia.Grid.TFOOT = "tfoot";
SweetDevRia.Grid.HEAD_COLUMN = "headColumn";
SweetDevRia.Grid.HEAD_COLUMN_SPLITER = "headColumnSpliter";
SweetDevRia.Grid.RESIZER = "resizer";
SweetDevRia.Grid.PAGEBAR = "pageBar";
SweetDevRia.Grid.DD_ARROW = "ddArrow";
SweetDevRia.Grid.BODY_TABLE = "bodyTable";
SweetDevRia.Grid.HEAD_TABLE = "headTable";
SweetDevRia.Grid.SORT_PROPERTIES = "sortPropertiesWindow";
SweetDevRia.Grid.EXCEL_PROPERTIES = "excelPropertiesWindow";




/**
 * This method is called before Set the table data
 * To be overridden !!
 * @param {Array} data The new Table data
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetData  = function(data){  /* override this */ return true;  };

/**
 * This method is called after Set the table data
 * @param {Array} data The new Table data
 * To be overridden !!
 */
SweetDevRia.Grid.prototype.afterSetData = function(data){  /* override this */ };

/**
 * This method is called before Add a new column in the datagrid. This column is added at the last position. 
 * To be overridden !!
 * @param {String} id Identifiant of this new column 
 * @param {String} header Header text of this new column 
 * @param {int} size Width of this new column 
 * @param {boolean} ascendant  Indicate if this column must be sorted. True indicate this column must be ascendant sorted, false descendant sorted and null if not sorted.
 * @param {boolean} visible  Indicate if this column is visible
 * @param {boolean} resizable Indicate if this column will be resizable by the user
 * @param {boolean} sortable Indicate if this column will be sortable by the user
 * @param {boolean} hideable Indicate if this column will be hideable by the user
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeAddColumn  = function(id, header, size, ascendant, visible, resizable, sortable, hideable){  /* override this */ return true;  };

/**
 * This method is called after Add a new column in the datagrid. This column is added at the last position. 
 * @param {String} id Identifiant of this new column 
 * @param {String} header Header text of this new column 
 * @param {int} size Width of this new column 
 * @param {boolean} ascendant  Indicate if this column must be sorted. True indicate this column must be ascendant sorted, false descendant sorted and null if not sorted.
 * @param {boolean} visible  Indicate if this column is visible
 * @param {boolean} resizable Indicate if this column will be resizable by the user
 * @param {boolean} sortable Indicate if this column will be sortable by the user
 * @param {boolean} hideable Indicate if this column will be hideable by the user
 * To be overridden !!
 */
SweetDevRia.Grid.prototype.afterAddColumn = function(id, header, size, ascendant, visible, resizable, sortable, hideable){  /* override this */ };

/**
 * This method is called before Set the column visiblity
 * To be overridden !!
 * @param {String} colId Identifiant of the column to set
 * @param {boolean} visibility the new visibility of the column
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetColumnVisibility  = function(colId, visibility){  /* override this */ return true;  };

/**
 * This method is called after Set the column visiblity
 * @param {String} colId Identifiant of the column to set
 * @param {boolean} visibility the new visibility of the column
 * To be overridden !!
 */
SweetDevRia.Grid.prototype.afterSetColumnVisibility = function(colId, visibility){  /* override this */ };

/**
 * This method is called before Initialize the Grid. This method ms be called at the page load !!!
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeInitialize = function(){  /* override this */ return true;  };

/**
 * This method is called after Initialize the Grid. This method ms be called at the page load !!!
 * To be overridden !!
 */
SweetDevRia.Grid.prototype.afterInitialize = function(){  /* override this */ };

/**
 * This method is called before Check or uncheck the html checkbox component which check all checkboxes
 * To be overridden !!
 * @param {boolean} select True to select the checkbox, else false
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetCheckboxAll = function (select){  /* override this */ return true;  };
	
/**
 * This method is called after Check or uncheck the html checkbox component which check all checkboxes
 * To be overridden !!
 * @param {boolean} select True to select the checkbox, else false
 */
SweetDevRia.Grid.prototype.afterSetCheckboxAll = function (select){  /* override this */ };

/**
 * This method is called as an event listener of the checkbox check/uncheck
 * @param {String} rowId row identifiant
 * @param {boolean} select True to select the checkbox, else false
 * @param {boolean} testAll True if the method must test if all checbox are checked to check the checkboxAll, else false
 * @return True if this method can be called, else false.
 * @type boolean
 * To be overridden !!
 */
SweetDevRia.Grid.prototype.onCheckRow = function (rowId, select, testAll){  /* override this */return true; };

/**
 * This method is called before setting the check status of a row. Triggered on check, after pagin... 
 * To be overridden !!
 * @param {String} rowId row identifiant
 * @param {boolean} select True to select the checkbox, else false
 * @param {boolean} testAll True if the method must test if all checbox are checked to check the checkboxAll, else false
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetCheckbox = function (rowId, select, testAll){  /* override this */ return true;  };
	
/**
 * This method is called after setting the check status of a row. Triggered on check, after pagin...
 * To be overridden !!
 * @param {String} rowId row identifiant
 * @param {boolean} select True to select the checkbox, else false
 * @param {boolean} testAll True if the method must test if all checbox are checked to check the checkboxAll, else false
 */
SweetDevRia.Grid.prototype.afterSetCheckbox = function (rowId, select, testAll){  /* override this */ };
	

/**
 * This method is called before Set the table width
 * To be overridden !!
 * @param {int} width The new table width
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetWidth  = function(width){  /* override this */ return true;  };

/**
 * This method is called after Set the table width
 * To be overridden !!
 * @param {int} width The new table width
 */
SweetDevRia.Grid.prototype.afterSetWidth = function(width){  /* override this */ };

/**
 * This method is called before Set the table height
 * To be overridden !!
 * @param {int} height The new table height
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetHeight  = function(height){  /* override this */ return true;  };

/**
 * This method is called after Set the table height
 * To be overridden !!
 * @param {int} height The new table height
 */
SweetDevRia.Grid.prototype.afterSetHeight = function(height){  /* override this */ };

/**
 * This method is called before Set the table size
 * To be overridden !!
 * @param {int} width The new table width
 * @param {int} height The new table height
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetSize  = function(width, height){  /* override this */ return true;  };

/**
 * This method is called after Set the table size
 * To be overridden !!
 */
SweetDevRia.Grid.prototype.afterSetSize  = function(){  /* override this */ };

/**
 * This method is called before Set the selection mode of the table
 * To be overridden !!
 * @param {int} mode New selection mode. Possible valus are SweetDevRia.Grid.NO_SELECTION, SweetDevRia.Grid.ROW_SELECTION, SweetDevRia.Grid.ROWS_SELECTION, SweetDevRia.Grid.CELL_SELECTION , SweetDevRia.Grid.CELLS_SELECTION
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetSelectionMode  = function(mode){  /* override this */ return true;  };

/**
 * This method is called after Set the selection mode of the table
 * To be overridden !!
 * @param {int} mode New selection mode. Possible valus are SweetDevRia.Grid.NO_SELECTION, SweetDevRia.Grid.ROW_SELECTION, SweetDevRia.Grid.ROWS_SELECTION, SweetDevRia.Grid.CELL_SELECTION , SweetDevRia.Grid.CELLS_SELECTION
 */
SweetDevRia.Grid.prototype.afterSetSelectionMode  = function(mode){  /* override this */ };

/**
 * This method is called before Set the total data number of the table
 * To be overridden !!
 * @param {int} data number New total data number of the table
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetTotalDataNumber  = function(total){  /* override this */ return true;  };

/**
 * This method is called after Set the total data number of the table
 * To be overridden !!
 * @param {int} data number New total data number of the table
 */
SweetDevRia.Grid.prototype.afterSetTotalDataNumber  = function(total){  /* override this */ };

/**
 * This method is called before Set a row selection
 * To be overridden !!
 * @param {String} rowId Identifiant of the row to select or unselect
 * @param {boolean} select select the row if true, else unselect
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetRowSelection  = function(rowId, select){  /* override this */ return true;  };

/**
 * This method is called after Set a row selection
 * To be overridden !!
 * @param {String} rowId Identifiant of the row to select or unselect
 * @param {boolean} select select the row if true, else unselect
 */
SweetDevRia.Grid.prototype.afterSetRowSelection  = function(rowId, select){  /* override this */ };
	
/**
 * This method is called before Set a cell selection
 * To be overridden !!
 * @param {String} rowId Row identifiant of the cell's row to select or unselect
 * @param {String} columnId Column identifiant of the cell to select or unselect
 * @param {boolean} select Select the cell if true, else unselect
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetCellSelection  = function(rowId, columnId, select){  /* override this */ return true;  };

/**
 * This method is called after Set a cell selection
 * To be overridden !!
 * @param {String} rowId Row identifiant of the cell's row to select or unselect
 * @param {String} columnId Column identifiant of the cell to select or unselect
 * @param {boolean} select Select the cell if true, else unselect
 */
SweetDevRia.Grid.prototype.afterSetCellSelection  = function(rowId, columnId, select){  /* override this */ };

/**
 * This method is called before Clear all table selection
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeClearSelection = function(){  /* override this */ return true;  };

/**
 * This method is called after Clear all table selection
 * To be overridden !!
 */
SweetDevRia.Grid.prototype.afterClearSelection  = function(){  /* override this */ };

/**
 * This method is called before Set the resizable column property
 * To be overridden !!
 * @param {String} colId Column identifiant to set
 * @param {boolean} resizable New value of te resizable property. If true, te use will be able to resize this column, else not
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetColumnResizable  = function(colId, resizable){  /* override this */ return true;  };

/**
 * This method is called after Set the resizable column property
 * To be overridden !!
 * @param {String} colId Column identifiant to set
 * @param {boolean} resizable New value of te resizable property. If true, te use will be able to resize this column, else not
 */
SweetDevRia.Grid.prototype.afterSetColumnResizable  = function(colId, resizable){  /* override this */ };


/**
 * This method is called before Set the draggableColumns property. This property indicate if the user can drag columns or not
 * To be overridden !!
 * @param {boolean} draggable If true, the user can drag columns, else false
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetDraggableColumns  = function(draggable){  /* override this */ return true;  };

/**
 * This method is called after Set the draggableColumns property. This property indicate if the user can drag columns or not
 * To be overridden !!
 * @param {boolean} draggable If true, the user can drag columns, else false
 */
SweetDevRia.Grid.prototype.afterSetDraggableColumns  = function(draggable){  /* override this */ };

/**
 * This method is called before Set the sortable column property, This property indicate if the user can sort this column or not
 * To be overridden !!
 * @param {String} colId Column to set
 * @param {boolean} sortable True if the user can sort this column, false if can't
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetColumnSortable  = function(colId, sortable){  /* override this */ return true;  };

/**
 * This method is called after Set the sortable column property, This property indicate if the user can sort this column or not
 * To be overridden !!
 * @param {String} colId Column to set
 * @param {boolean} sortable True if the user can sort this column, false if can't
 */
SweetDevRia.Grid.prototype.afterSetColumnSortable  = function(colId, sortable){  /* override this */ };

/**
 * This method is called before Set a colum width
 * To be overridden !!
 * @param {Stirng} colId Identifiant of the column to resize
 * @param {int} size New width of the column
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetColumnSize  = function(colId, size){  /* override this */ return true;  };

/**
 * This method is called after Set a colum width
 * To be overridden !!
 * @param {Stirng} colId Identifiant of the column to resize
 * @param {int} size New width of the column
 */
SweetDevRia.Grid.prototype.afterSetColumnSize  = function(colId, size){  /* override this */ };

/**
 * This method is called before Set a column position 
 * To be overridden !!
 * @param {String} colId Identifiant of the column to move
 * @param {int} position New position of the column
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetColumnPosition  = function(colId, position){  /* override this */ return true;  };

/**
 * This method is called after Set a column position 
 * To be overridden !!
 * @param {String} colId Identifiant of the column to move
 * @param {int} position New position of the column
 */
SweetDevRia.Grid.prototype.afterSetColumnPosition  = function(colId, position){  /* override this */ };

/**
 * This method is called before Sort a column 
 * To be overridden !!
 * @param {String} colId Identifiant of the column to sort
 * @param {boolean} ascendant True is the column must be ascendant sorted, false for descendant sorting 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSortColumn  = function(colId, ascendant){  /* override this */ return true;  };

/**
 * This method is called after Sort a column 
 * To be overridden !!
 * @param {String} colId Identifiant of the column to sort
 * @param {boolean} ascendant True is the column must be ascendant sorted, false for descendant sorting 
 */
SweetDevRia.Grid.prototype.afterSortColumn  = function(colId, ascendant){  /* override this */ };


/**
 * This method is called before Execute a multiple column sort
 * To be overridden !!
 * @param {Array} columnsOrder Contains all columns order to sort.Each value is an array with the column id and the ascendant property. 
 * exemple : [["col4", true], ["col1", false], ["col3", true]]
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeMultipleColumnSort = function(columnsOrder){ /* override this */ return true;  };

/**
 * This method is called after Execute a multiple column sort
 * To be overridden !!
 * @param {Array} columnsOrder Contains all columns order to sort.Each value is an array with the column id and the ascendant property. 
 * exemple : [["col4", true], ["col1", false], ["col3", true]]
 */
SweetDevRia.Grid.prototype.afterMultipleColumnSort  = function(columnsOrder){  /* override this */ };

/**
 * This method is called before Excel Export of rows 
 * To be overridden !!
 * @param {int} exportMode Define if we export in wysiwyg mode or model mode. Possible values are SweetDevRia.Grid.WYSIWYG_EXPORT and SweetDevRia.Grid.MODEL_EXPORT
 * @param {Array} exportdRowIds Array containing all exported row ids. If null, all rows will be exported.
 * @param {String} exportId String representing the id of the export being processed.
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeExcelExport = function(exportMode, exportdRowIds, exportId){ /* override this */ return true;  };

/**
 * This method is called after  Excel Export of rows 
 * To be overridden !!
 * @param {int} exportMode Define if we export in wysiwyg mode or model mode. Possible values are SweetDevRia.Grid.WYSIWYG_EXPORT and SweetDevRia.Grid.MODEL_EXPORT
 * @param {Array} exportdRowIds Array containing all exported row ids. If null, all rows will be exported.
 * @param {String} exportId String representing the id of the export being processed.
 */
SweetDevRia.Grid.prototype.afterExcelExport  = function(exportMode, exportdRowIds, exportId){  /* override this */ };

/**
 * This method is called before Change the displayed page into table pagination
 * To be overridden !!
 * @param {int} actualPage New displayed page number
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeGoToPage  = function(actualPage){  /* override this */ return true;  };

/**
 * This method is called after Change the displayed page into table pagination
 * To be overridden !!
 * @param {int} actualPage New displayed page number
 */
SweetDevRia.Grid.prototype.afterGoToPage  = function(actualPage){  /* override this */ };

/**
 * This method is called before Set the resizable property. This method hide or show the resizer
 * To be overridden !!
 * @param {boolean} resizable True if the ser can resize the table, else false
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetResizable  = function(resizable){  /* override this */ return true;  };

/**
 * This method is called after Set the resizable property. This method hide or show the resizer
 * To be overridden !!
 * @param {boolean} resizable True if the ser can resize the table, else false
 */
SweetDevRia.Grid.prototype.afterSetResizable  = function(resizable){  /* override this */ };





/**
 * Set the table data
 * @param {Array} data The new Table data
 */
SweetDevRia.Grid.prototype.setData = function (data) {
	if (this.beforeSetData (data)) {
		this.data = data;
		if (this.initialized) {

			var str =  this.getDataStr ();

			var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
			divBody.innerHTML = str;

			this.tableBody = SweetDevRia.DomHelper.get (this.id+"_"+SweetDevRia.Grid.BODY_TABLE);

			var colNum = this.getColumnNumber ();
			for(var i = 0; i < colNum; i++){
				var column = this.getColumnAtPosition (i);
	
				// initialize column size property
				this.setColumnSize (column.id, column.size);
			}

			//reset checkbox all
			var rowId =  this.getRowIdByIndex (this.getFirstVisibleIndex());
			this.setCheckbox (rowId, this.checkedRows.contains (rowId), true);
			
			this.synchroniseWidths ();
			this.synchronizeHeader ();
		}
		
		this.afterSetData (data);
	}
};

SweetDevRia.Grid.prototype.getDataStr = function () {
	var str =  TrimPath.processDOMTemplate(this.templateData, this);

	return str;
};

/**
 * Return the total number of columns
 * @return the total number of columns
 * @type int
 */
SweetDevRia.Grid.prototype.getColumnNumber = function () {
	return this.columnNumber;
};

/**
 * Return the number of visible columns
 * @return the total number of visible columns
 * @type int
 */
SweetDevRia.Grid.prototype.getVisibleColumnNumber = function () {
	return this.visibleColumnNumber;
};

/**
 * Return the first visible index in the data
 * @return the first visible index in the data
 * @type int
 */
SweetDevRia.Grid.prototype.getFirstVisibleIndex = function () {
	if (this.loadAllData) {
		return ((this.actualPage - 1) * this.rowPerPage);
	}
	else {
		return 0;
	}
};

/**
 * Return the last visible index in the data
 * @return the last visible index in the data
 * @type int
 */
SweetDevRia.Grid.prototype.getLastVisibleIndex = function () {
	if (this.loadAllData) {
		return Math.min (((this.actualPage * this.rowPerPage) - 1), this.totalDataNumber - 1);
	}
	else {
		return Math.min (this.data.length - 1, this.rowPerPage);
	}
};

/**
 * Return the header text of the column. This method remove the header html code, just return text. 
 * @param {String} colId Column identifiant associated with the header
 * @return header text of the column. This method remove the header html code, just return text.
 * @type String
 * @private
 */
SweetDevRia.Grid.prototype.getHeaderText = function (colId) {
	var col = this.getColumn (colId);
	
	var cellIndex = this.getCellIndexOfColumn (col);

	var cells = this.tableHead.rows[0].cells;
	var header = cells [cellIndex];
	
	var children = header.childNodes;
	var res = "";
	
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		
		if (child.id == this.headPrefix + colId+"_sort"){
			break;
		}
		
		res += SweetDevRia.DomHelper.getTextValue (child);
	}

	return res;
};

/**
 * Add a new column in the datagrid. This column is added at the last position. 
 * @param {String} id Identifiant of this new column 
 * @param {String} header Header text of this new column 
 * @param {int} size Width of this new column 
 * @param {boolean} ascendant  Indicate if this column must be sorted. True indicate this column must be ascendant sorted, false descendant sorted and null if not sorted.
 * @param {boolean} visible  Indicate if this column is visible
 * @param {boolean} resizable Indicate if this column will be resizable by the user
 * @param {boolean} sortable Indicate if this column will be sortable by the user
 * @param {boolean} hideable Indicate if this column will be hideable by the user
 */
SweetDevRia.Grid.prototype.addColumn = function (id, header, size, ascendant, sortOrder, visible, resizable, sortable, hideable) {
	if (this.beforeAddColumn (id, header, size, ascendant, sortOrder, visible, resizable, sortable, hideable)) {
		
		this.addColumnAtPosition (id, header, size, ascendant, sortOrder, visible, resizable, sortable, hideable, this.columnNumber, this.columnNumber);
		
		this.afterAddColumn (id, header, size, ascendant, sortOrder, visible, resizable, sortable, hideable);
	}
};

SweetDevRia.Grid.prototype.addColumnAtPosition = function (id, header, size, ascendant, sortOrder, visible, resizable, sortable, hideable, initialPosition, position) {
//TODO before after
		if (!hideable) {visible = true;}
	
		size = SweetDevRia.DomHelper.parsePx (size);
	
		var column = {"id" : id, "header" : header, "position": position, "initialPosition": initialPosition, "visible" : visible, "size" : size, "ascendant" : ascendant, "sortOrder" : sortOrder, "sortable" : sortable, "resizable" : resizable, "hideable" : hideable};
		this.columns [id] = column;

		if (visible) {
			this.columnSizeSum += size;
			if (this.visibleColumnNumber > 0){
				this.columnSizeSum += 2; // +2 because of spliter width
			}
			
			this.visibleColumnNumber ++;
		}
				
		this.columnNumber ++;
};

/**
 * Return the column id from its position
 * @param {int} position Position of the searched column id
 * @return the column id from its position
 * @type String
 */
SweetDevRia.Grid.prototype.getColumnIdAtPosition = function (position) {
    for (var colId in this.columns) {
		var column = this.getColumn (colId);
		if (column && column.position == position) {
			return colId;
		}
	}
	
	return null;
};

/**
 * Return the column from its position
 * @param {int} position
 * @return the column from its position
 * @type Object
 */
SweetDevRia.Grid.prototype.getColumnAtPosition = function (position) {
	var colId = this.getColumnIdAtPosition (position);

	return this.getColumn (colId);
};

/**
 * Find the column from this cellIndex
 * @param {int} cellIndex of the searched column
 * @return the column from this cellIndex
 * @type Object
 * @private
 */
SweetDevRia.Grid.prototype.getColumnWithCellIndex = function (cellIndex) {
	var cells = this.tableHead.rows[0].cells;
	
	var header = cells [cellIndex];
	
	if (header && header.id && header.id.indexOf(this.headPrefix) == 0) { // If it's a header !!
		var colId = header.id.substring (this.headPrefix.length);
		var column = this.getColumn (colId);
		return column;
	}
	
	return null;
};


/**
 * Find this cellIndex from the column 
 * @param {Column} column Column which we search the cellIndex
 * @return the cellIndex from the column 
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getCellIndexOfColumn = function (column) {
	return this.getCellIndexFromPosition (column.position);
};

/**
 * Find this cellIndex from the column position
 * @param {int} position Column position which we search the cellIndex
 * @return the cellIndex from the column 
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getCellIndexFromPosition = function (position) {

	var cells = this.tableHead.rows[0].cells;
	
	var result = -1;
	var start = 1; // RAG
	
	// Il checkboxes are displayed, we start at the position 2!
	if (this.displayCheckbox){
		start = 3; // RAG
	}
	
	for (var i = start; i < cells.length; i++) {
		var cell = cells [i];
		if (! YAHOO.util.Dom.hasClass(cell,"ideo-ndg-headSeparator")) {
			result ++;
		}
		
		if (result == position) {
			return i;
		}
	}
	
	return null;
};


/**
 * Return the column 
 * @param {String} colId Identifiant of the searched column
 * @return the column from its identifiant
 * @type Object
 */
SweetDevRia.Grid.prototype.getColumn = function (colId) {
    var column =  this.columns [colId];
	if (column == "undefined" || (typeof(column)+"").toLowerCase() == "function") {column =  null;}
	
	return column;
};

/**
 * Return the column position 
 * @param {String} colId Identifiant of the searched column position
 * @return the column position
 * @type int
 */
SweetDevRia.Grid.prototype.getColumnPosition = function(colId){
	var column = this.getColumn (colId);
	if (column) {
		return column.position;
	}
	return null;
};

/**
 * Return the column size 
 * @param {String} colId Identifiant of the searched column size
 * @return the column size
 * @type int
 */
SweetDevRia.Grid.prototype.getColumnSize = function(colId){
	var column = this.getColumn (colId);
	if (column) {
		return column.size;
	}
	return null;
};

/**
 * Return the column visibility 
 * @param {String} colId Identifiant of the searched column visibility
 * @return the column visibility
 * @type boolean
 */
SweetDevRia.Grid.prototype.getColumnVisibility = function(colId){
	var column = this.getColumn (colId);
	if (column) {
		return column.visible;
	}
	return null;
};

/**
 * Swap the column visibility. Hide the column if it's visible, else show it.
 * @param {String} colId Identifiant of the column to swap
 */
SweetDevRia.Grid.prototype.swapColumnVisibility = function(colId){
	var visibility = this.getColumnVisibility (colId);
	this.setColumnVisibility (colId, ! visibility);
};

/**
 * Refresh all columns visiblities. Hide all hiddens, show all visibles.
 * @private
 */
SweetDevRia.Grid.prototype.refreshColumnVisibilities = function(){
    for (var colId in this.columns) {
		var column = this.getColumn (colId);
		if (column) {
	 		this.setColumnVisibility (column.id, column.visible);
		}
	}
};

/**
 * Set the column visiblity
 * @param {String} colId Identifiant of the column to set
 * @param {boolean} visibility the new visibility of the column
 */
SweetDevRia.Grid.prototype.setColumnVisibility = function(colId, visibility){
	
	if (this.beforeSetColumnVisibility (colId, visibility)) {
		
		var col = this.getColumn (colId);

		var colElem = SweetDevRia.DomHelper.get (this.id+"_col_"+col.position); 
		if (colElem == null){
			return;
		}
		
		//if ((visibility == this.testElementVisibility (colElem)) || ! col.hideable) return;

		var oldVisibility = col.visible; 
		
		if (oldVisibility != visibility) {
			// update menuitem check
			var menuItem = SweetDevRia.$ (this.id + "MenuItem"+colId);

			// the user can't hide lhe last visible column
			if (!visibility && this.visibleColumnNumber == 1) {
				SweetDevRia.DomHelper.addClassName(menuItem.view(),"ideo-mnu-check");
				return;	
			}

			if (menuItem && menuItem.setChecked && ! menuItem.disabled) {
				if (visibility) {
					SweetDevRia.DomHelper.addClassName(menuItem.view(),"ideo-mnu-check");
				}
				else {
					SweetDevRia.DomHelper.removeClassName(menuItem.view(),"ideo-mnu-check");
				}
			}
						
			if (visibility) {
				this.visibleColumnNumber ++;

				this.columnSizeSum = this.columnSizeSum + col.size + 2; // + 2 becaufe of spliter width
			}
			else {
				this.visibleColumnNumber --;

				this.columnSizeSum = this.columnSizeSum - col.size - 2;  // - 2 becaufe of spliter width
			}

		}

		col.visible = visibility;

		this.tableBody.style.tableLayout = "auto";
	
		this.tableHead.style.tableLayout = "auto";
		
		if (document.all) {
			this.setColumnElementsVisibility (colId, visibility);
		}
		else {
			setTimeout("SweetDevRia.$ (\""+this.id+"\").setColumnElementsVisibility(\""+colId+"\", "+visibility+")",10);
		}
		
		this.afterSetColumnVisibility (colId, visibility);
	}
};

/**
 * Synchronize the header sizes from column sizes
 * @private
 */
SweetDevRia.Grid.prototype.synchroniseWidths = function(){
	this.tableHead.parentNode.style.width = this.tableBody.parentNode.clientWidth + "px";
};


/**
 * Create a new spliter used to resize columns
 * @param {String} colId Column identifiant associated with this spliter
 * @private
 */
SweetDevRia.Grid.prototype.createSpliter = function(colId){
	// create header spliter objects  to resize columns
	var spliterId = this.spliterPrefix + colId;

	var spliter = new SweetDevRia.VSpliter(spliterId, this.minColumnWidth);

	spliter.shift = true;
	spliter.onSplit = this.onSplit(this);
	spliter.getPreviousNode = this.getPreviousNode(this);
	spliter.onMouseUp = function(e) {};
	this.spliters.push(spliter);

};

/**
 * Reset spliters constaints
 * @private
 */
SweetDevRia.Grid.prototype.resetSpliters = function(){
	for(var i=0;i<this.spliters.length;i++){
		this.spliters[i].previousNode= null;
		this.spliters[i].resetConstraints ();
	}
};

/**
 * Initialize the Grid. This method ms be called at the page load !!!
 * @private
 */
SweetDevRia.Grid.prototype.initialize = function(){
	if (this.beforeInitialize ()) {

		this.initialized = true;
		
		this.ddArrow = SweetDevRia.DomHelper.get (this.ddArrowId);
		this.tableBody = SweetDevRia.DomHelper.get (this.id+"_"+SweetDevRia.Grid.BODY_TABLE);
		this.tableHead = SweetDevRia.DomHelper.get (this.id+"_"+SweetDevRia.Grid.HEAD_TABLE);

		this.createContextMenu ();

		this.pageNumber = Math.ceil (this.totalDataNumber / this.rowPerPage);
		if (this.pageNumber > 1) {
			this.createPageBar ();
		}
				
		this.columnSizeSum += this.checkboxColWidth + 1; // RAG
		if (this.displayCheckbox) {
			this.columnSizeSum += this.checkboxColWidth + 2; 
		}
		
		this.setSelectionMode(this.selectionMode);
	
		var colNum = this.getColumnNumber ();
	
		for(var i = 0; i < colNum - 1; i ++){
			var column = this.getColumnAtPosition (i);
	
			this.createSpliter (column.id);
	
			// initialize resizable column property (lock or unlock dragdrop objects)
			this.setColumnResizable (column.id, column.resizable);
		}
	
		// allow to drop headers on document.
	    var documentDropZone = new YAHOO.util.DDTarget("#document", "headers");
		
		for(var i = 0; i < colNum; i++){
			var column = this.getColumnAtPosition (i);

			// create header objects to move columns
		    var headerDD = new YAHOO.util.DragDrop(this.headPrefix + column.id, "headers");
	 		headerDD.onDragDrop = this.dropColumn(this);
		    headerDD.onDragOver = this.onDragColumn(this);
			this.headerDDs[column.id] = headerDD;


			// active or desactive sortable property (header click action)
			this.setColumnSortable (column.id, column.sortable);

			// initialize column size property
			this.setColumnSize (column.id, column.size);
		}

		// initialize draggable columns property (lock or unlock dragdrop objects)
		this.setDraggableColumns (this.draggableColumns);
		
		this.setWidth(this.width);

		this.isInitialized = true;
		
	 	YAHOO.util.Event.addListener(window, "beforeunload", function (evt, grid) {
			grid.updateServerModel ();
		}, this);
		
		this.afterInitialize ();
	}
	
	return true;
};

/**
 * This method is called at the table resizer drop
 * @param {Table} table Table component associated wit this resizer
 * @private
 */
SweetDevRia.Grid.prototype.resizerOnMouseUp = function(table){
	return function(e){
        var node = this.getEl();

		var tableElem = node.parentNode;

        var tableHeight = tableElem.offsetHeight;
        var tableWidth = tableElem.offsetWidth;
		var tableCoord = SweetDevRia.DomHelper.getXY (tableElem);
		
		var top = parseInt(node.style.top,10);
		var left = parseInt(node.style.left,10);

		var divBody = SweetDevRia.DomHelper.get (table.id+"_bodyDiv");
		var scrollerWidth = SweetDevRia.DomHelper.getScrollerWidth (divBody);
	    var arrowHeight = table.ddArrow.offsetHeight;

		var resizerId = table.id+"_"+SweetDevRia.Grid.RESIZER;
		var resizer = SweetDevRia.DomHelper.get (resizerId);
		var resizerWidth = SweetDevRia.DomHelper.getWidth (resizer);
		var resizerHeight = SweetDevRia.DomHelper.getHeight (resizer);

		var width = left + scrollerWidth + resizerWidth;
		var height = top - arrowHeight - resizerHeight;
		
		table.setSize (width, height);
	};
};

/**
 * This method is called before the table resizer drag
 * @param {Table} table Table component associated wit this resizer
 * @private
 */
SweetDevRia.Grid.prototype.resizerOnMouseDown = function(table){
	return function(e){
		table.resizer.resetConstraints ();
	};
};

/**
 * Set the table width
 * @param {int} width The new table width
 */
SweetDevRia.Grid.prototype.setWidth = function (width){
	if (this.beforeSetWidth (width)) {
		if (this.isInitialized && ! this.resizable){
			return;
		}
	
		if (width == null) {
			var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
			var scrollerWidth = SweetDevRia.DomHelper.getScrollerWidth (divBody);
			width = this.columnSizeSum + scrollerWidth; 
		}
		
		width = SweetDevRia.DomHelper.parsePx (width);

		this.width = width;
		if (this.initialized) {
			var container = SweetDevRia.DomHelper.get (this.id+"_container");
			if (container != null) {
			    container.style.width =  width + "px";
			}
	
			var table = SweetDevRia.DomHelper.get (this.id);
		    table.style.width =  width + "px";
	
			var tbody = SweetDevRia.DomHelper.get (this.tbodyId);
			var datatable = tbody.parentNode.parentNode;
		    datatable.style.width =  width + "px";

			this.adjustLastColumnSize ();
	
		    this.synchroniseWidths();
	
			this.setResizable(this.resizable);
			
			this.resizer.resetConstraints ();
		}
		this.afterSetWidth (width);
	}
};

/**
 * Set the table height
 * @param {int} height The new table height
 */
SweetDevRia.Grid.prototype.setHeight = function (height){
	if (this.beforeSetHeight (height)) {
		if (! this.resizable){
			return;
		}
	
		height = SweetDevRia.DomHelper.parsePx (height);
		this.height = height;
	
		if (this.initialized) {
	       	var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
		    divBody.style.height = (height - this.heightHeader) + "px";

			this.setResizable(this.resizable);
		}
		
		this.afterSetHeight (height);
	}
};

/**
 * Set the table size
 * @param {int} width The new table width
 * @param {int} height The new table height
 */
SweetDevRia.Grid.prototype.setSize = function(width, height){
	if (this.beforeSetSize (width, height)) {
		if (! this.resizable){
			return;
		}
		
		this.setHeight (height);
		
		this.setWidth (width);

		this.afterSetSize ();
	}
};

/**
 * Return the table height
 * @return table height
 * @type int
 */
SweetDevRia.Grid.prototype.getHeight = function (){
	return this.height;
};

/**
 * Return the table width
 * @return table width
 * @type int
 */
SweetDevRia.Grid.prototype.getWidth = function (){
	return this.width;
};


/**
 * Return the minimum column width
 * @return minimum column width
 * @type int
 */
SweetDevRia.Grid.prototype.getMinColumnWidth = function (){
	return this.minColumnWidth;
};


/**
 * Set the minimum column width
 * @param {int} minColumnWidth The new minimum column width
 */
SweetDevRia.Grid.prototype.setMinColumnWidth = function (minColumnWidth){
	this.minColumnWidth = minColumnWidth;
};


/**
 * Return the table size
 * @return table size
 * @type Array
 */
SweetDevRia.Grid.prototype.getSize = function (){
	return [this.width,this.height] ;
};

/**
 * Return the header from a x position. This method is called during column header drag drop.
 * @param {int} x X position
 * @return header from a x position. This method is called during column header drag drop.
 * @type HtmlElement
 * @private  
 */
SweetDevRia.Grid.prototype.getHeaderFromX = function (x) {

	var previous = this.getFirstVisibleColumn();
	var previousHeader = SweetDevRia.DomHelper.get (this.headPrefix+previous.id);

    for (var i = 0; i < this.visibleColumnNumber - 1; i ++) {
		var column = this.getNextVisibleColumn (previous);

		if (column.visible) {
			var headerCol = SweetDevRia.DomHelper.get (this.headPrefix+column.id); 
			var headerX = SweetDevRia.DomHelper.getX (headerCol);
			
			if (headerX > x) {
				return previousHeader;
			}
			else {
				previousHeader = headerCol;
				previous = column;
			}

		}
	}

	return previousHeader;
};

/**
 * This method put the dragdrop arrow at the good place according to header drag position. It s called during column drag.
 * @param {Table} table Table component
 * @private
 */
SweetDevRia.Grid.prototype.onDragColumn = function(table){
	return function(e,id){

		var node = this.getEl();
		var target = SweetDevRia.DomHelper.get(id);

		var x = YAHOO.util.Event.getPageX(e);
		if (id == "#document") {
			target = table.getHeaderFromX (x); 
		}

	    var width = target.offsetWidth;
		var targetX = SweetDevRia.DomHelper.getX(target);
	    var offsetX = x - targetX;
	    table.ddArrow.style.position = "relative";
	    table.ddArrow.style.visibility = "visible";

	    if(offsetX<width /2){
	        table.ddArrow.style.left = target.offsetLeft - 4 + "px";
	    }
	    else{
	        table.ddArrow.style.left = target.offsetLeft + width - 5 + "px";
	    }
	};
};

/**
 * This method is called when the user drop a column
 * @param {Table} table Table component
 * @private
 */
SweetDevRia.Grid.prototype.dropColumn = function(table){
	return function(e,id){
 		table.ddArrow.style.visibility = "hidden";

	    var node = this.getEl();
	    var targetNode = SweetDevRia.DomHelper.get(id);

		var x = YAHOO.util.Event.getPageX(e);
		if (id == "#document") {
			targetNode = table.getHeaderFromX (x); 
		}
		
	    if (node == targetNode){
			return;
	    }
		
		// we search moved column position
		var movedId = node.id.substring (table.headPrefix.length);
		var movedCol = table.getColumn (movedId);
		var movedPosition = movedCol.position;

		var targetId = targetNode.id;
		var position = null;
		// If the target node is a spliter, we simulate a drop at the begining of the next header
		if (targetId.indexOf (table.spliterPrefix) == 0) {
			var targetId = targetId.substring (table.spliterPrefix.length);
			var targetCol = table.getColumn (targetId);
			position = targetCol.position + 1;
		}
		else {
			var targetId = targetId.substring (table.headPrefix.length);
			var targetCol = table.getColumn (targetId);
			position = targetCol.position;
	
			// we search if the drop is before or after this target column
		    var width = targetNode.offsetWidth;
		    var targetX = SweetDevRia.DomHelper.getX(targetNode);
		    var offsetX = x - targetX;

		    if(offsetX >= width /2){				
				position ++;
		    }
		}


		if (movedPosition < position) {
		    if (position-1 == movedPosition){
				return;
		    }
		}
		else {
		    if (position == movedPosition){
				return;
		    }
		}

		table.setColumnPosition (movedId, position);

	};
};


/**
 * This method drop all datafrom a column position to another one
 * @param {String} id Identifiant of the html body table
 * @param {String} nodeId Moved column identifiant
 * @param {String} separatorId Moved spliter identifiant
 * @param {String} targetId Target column identifiant
 * @param {boolean} isLast Indicate if the target position is the last one
 * @private
 */
SweetDevRia.Grid.prototype.dropDataColumn = function(id,nodeId,separatorId,targetId,isLast){
	for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
		var rowId =  this.getRowIdByIndex (i);

        var completeNodeId = this.id+"_cell_"+rowId+"_"+nodeId;
        var node = document.getElementById (completeNodeId);

        var completeSeparatorId = this.id+"_cell_spliter_"+rowId+"_"+separatorId; 
    	var separator = document.getElementById (completeSeparatorId); 

        if(!isLast){
	        var completeTargetId = this.id+"_cell_"+rowId+"_"+targetId; 
	        var target = document.getElementById (completeTargetId); 

            node = node.parentNode.removeChild(node);
       		separator = separator.parentNode.removeChild(separator);                        
	        target.parentNode.insertBefore(node,target);
	       	target.parentNode.insertBefore(separator,target);                        
        }
        else{
            separator.parentNode.appendChild(separator.parentNode.removeChild(separator));
            node.parentNode.appendChild(node.parentNode.removeChild(node));
        }
	}		
};


/**
 * Synchronize the scroll position between header and body.
 * @private
 */
SweetDevRia.Grid.prototype.synchronizeHeader = function (){
	var thead = SweetDevRia.DomHelper.get (this.id+"_"+SweetDevRia.Grid.THEAD);
	var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
    var table = thead.parentNode.parentNode;
	
    table.scrollLeft = divBody.scrollLeft;
	for(var i=0;i<this.spliters.length;i++){
		this.spliters[i].setScrollLeft(divBody.scrollLeft);
	}
};

/**
 * Find the previous Td of a spliter
 * @param {Table} table Table component
 * @return the previous Td of a node
 * @type HtmlElement
 * @private
 */
SweetDevRia.Grid.prototype.getPreviousNode = function(table){
	return function(){
	    if(this.previousNode === null) {
			var previousTd = this.getNode().previousSibling;

			while(previousTd.nodeType == 3 || (previousTd.tagName && (previousTd.tagName.toLowerCase() != "td" || table.testHeaderVisibilty (previousTd) != true))) {
				previousTd = previousTd.previousSibling;
			}

			this.previousNode = previousTd;
		}

		return this.previousNode;
	};
};

/**
 * Test the header visiblity
 * @param {HtmlElement} node Header to test
 * @return true is the node is visible, false else.
 * @type boolean
 * @private
 */
SweetDevRia.Grid.prototype.testHeaderVisibilty = function (node) {
	if (node && node.id && node.id.indexOf(this.headPrefix) == 0) { // If it's a header !!
		var colId = node.id.substring (this.headPrefix.length);
		var column = this.getColumn (colId);
		if (column) {
			var headerCol = SweetDevRia.DomHelper.get (this.id+"_head_col_"+column.position); 
			var visibility = this.testElementVisibility (headerCol);

			return visibility;
		}
	}

	return null; 
};

/**
 * resize columns according to spliter position. This method is called during column resize.
 * @param {Table} table Table component
 * @private
 */
SweetDevRia.Grid.prototype.onSplit = function(table){
	return function(){
	    var cellIndex = this.getNode().cellIndex;
	    var previousSize = this.getPreviousNode().offsetWidth;

		var column = table.getColumnWithCellIndex (cellIndex + 1);
		column = table.getPreviousVisibleColumn (column);

		table.setColumnSize (column.id, previousSize);
	};
};

/**
 * return the next cell of html table
 * @param {HtmlTd} td Cell which we search the next 
 * @private
 */
SweetDevRia.Grid.prototype.getNextCell = function(td){
    if(td.cellIndex<(td.parentNode.cells.length-1)){
        return td.parentNode.cells[td.cellIndex+1];		
	}
    else{
		return null;
	}
};
  
/**
 * return the previous cell of html table
 * @param {HtmlTd} td Cell which we search the previous 
 * @private
 */          
SweetDevRia.Grid.prototype.getPreviousCell = function(td){
	if(td.cellIndex>0){
	    return td.parentNode.cells[td.cellIndex-1];		
	}
	else{
		return null;
	} 
}; 

/**
 * Return the selection mode of the table
 * @return selection mode of the table
 * @type int
 */ 
SweetDevRia.Grid.prototype.getSelectionMode = function(){
	return this.selectionMode;
};

/**
 * Set the selection mode of the table
 * @param {int} mode New selection mode. Possible valus are SweetDevRia.Grid.NO_SELECTION, SweetDevRia.Grid.ROW_SELECTION, SweetDevRia.Grid.ROWS_SELECTION, SweetDevRia.Grid.CELL_SELECTION , SweetDevRia.Grid.CELLS_SELECTION
 */
SweetDevRia.Grid.prototype.setSelectionMode = function(mode){
	if (this.beforeSetSelectionMode (mode)) {
		if (! this.initialized) {
			this.selectionMode = mode;
		}
		else {
			this.clearSelection();
			this.selectionMode = mode;
		
			if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION || this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){
				this.selection = null;
			}
			else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION || this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
				this.selection = [];
			}
		}	

		this.afterSetSelectionMode (mode);
	}
};

/**
 * Return the total data number of the table
 * @return the total data number of the table
 * @type int
 */ 
SweetDevRia.Grid.prototype.getSelectionMode = function(){
	return this.totalDataNumber;
};

/**
 * Set the total data number of the table
 * @param {int} mode New total data number of the table
 */
SweetDevRia.Grid.prototype.setTotalDataNumber = function(total){
	if (this.beforeSetTotalDataNumber (total)) {
		//TODO some init ?
		this.totalDataNumber = total;
		this.afterSetTotalDataNumber (total);
	}
};

/**
 * Return the displayCheckbox property
 * @return true if checkboxes are displayed, else false
 * @type boolean
 */ 
SweetDevRia.Grid.prototype.getDisplayCheckbox = function(){
	return this.displayCheckbox;
};

/**
 * Set the displayCheckbox property
 * @param {boolean} displayCheckbox True if checkboxes must be displayed, else false
 */
SweetDevRia.Grid.prototype.setDisplayCheckbox = function(displayCheckbox){
	this.displayCheckbox = displayCheckbox;
};

/**
 * Return the value of the html checkbox component which check all checkboxes
 * @return true if the checkbox component is checked, flase else, or null if this checkbox doesn't exist
 * @type boolean
 */
SweetDevRia.Grid.prototype.getCheckboxAll = function(){
	var checkboxAll = SweetDevRia.DomHelper.get (this.id+"_col_checkboxAll");
	if (checkboxAll) {
		return checkboxAll.checked;
	}
	
	return null;
};

/**
 * Return the value of the html checkbox component associated with one row
 * @param {int} rowId Row identifiant
 * @return true if the checkbox component is checked, flase else, or null if this checkbox doesn't exist
 * @type boolean
 */
SweetDevRia.Grid.prototype.getCheckbox = function(rowId){
	var checkbox =  SweetDevRia.DomHelper.get (this.id+"_col_"+rowId+"_checkbox");
	if (checkbox) {
		return checkbox.checked;
	}
	
	return null;
};

/**
 * Check or uncheck the html checkbox component which check all checkboxes
 * @param {boolean} select True to select the checkbox, else false
 */
SweetDevRia.Grid.prototype.setCheckboxAll = function (select){
	if (this.beforeSetCheckboxAll (select)) {
		
		if (! this.displayCheckbox){
			return;
		}
		
		var checkboxAll = SweetDevRia.DomHelper.get (this.id+"_col_checkboxAll");
		checkboxAll.checked = select;

		for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
			var rowId =  this.getRowIdByIndex (i);
			this.setCheckbox (rowId, select, false);
		}
		
		this.afterSetCheckboxAll (select);
	}
};


/**
 * Return the checked rows identifiants
 * @return checked rows identifiants
 * @type Array
 */
SweetDevRia.Grid.prototype.getCheckedRows = function(){
	return this.checkedRows;
};

/**
 * Check or uncheck the html checkbox component associated with one row
 * @param {String} rowId row identifiant
 * @param {boolean} select True to select the checkbox, else false
 * @param {boolean} testAll True if the method must test if all checbox are checked to check the checkboxAll, else false
 */
SweetDevRia.Grid.prototype.setCheckbox = function(rowId, select, testAll){
	if (this.beforeSetCheckbox (rowId, select, testAll)) {
		if (! this.displayCheckbox){
			return;
		}
		
		if (testAll == null){
			testAll = true;
		}

		var checkbox = SweetDevRia.DomHelper.get (this.id+"_col_"+rowId+"_checkbox");
		if (checkbox) {
			checkbox.checked = select;
			
			if (select) {
				if (!this.checkedRows.contains (rowId)) {
					this.checkedRows.add (rowId);
				}
			}
			else {
				this.checkedRows.remove (rowId);
			}
		}

		//update checkboxAll value;	
		if (testAll) {
			var checkboxAll = SweetDevRia.DomHelper.get (this.id+"_col_checkboxAll");
			if (select) {
				for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
					var rowId =  this.getRowIdByIndex (i);
					if (! this.getCheckbox (rowId)) {
						checkboxAll.checked = false;
						return;
					}
				}
				
				checkboxAll.checked = true;
			}
			else {
				checkboxAll.checked = false;
			}
		}
		
		this.afterSetCheckbox (rowId, select, testAll);
	}
};

/**
 * return the row identifiant of the row at the rowIndex position
 * @param {Object} rowIndex
 * @return row identifiant of the row at the rowIndex position
 * @type String
 * @private
 */
SweetDevRia.Grid.prototype.getRowIdByIndex = function(rowIndex){
	var row = this.data [rowIndex];
	if (row) {
		return row [0];
	}	
	return null;
};

/**
 * return the row index corresponding to the row id 
 * @param {String} rowIndex
 * @return row index corresponding to the row id parameter
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getRowIndexForId = function(rowId){
	for(var row = 0;row < this.data.length;++row){
		if(this.data[row][0] == rowId){
			return row;   
		}
	}
	return null;
};

/**
 * return the row data contained in the grid for a specific rowId 
 * @param {String} rowId
 * @return map a map with the column id as key and cell value as value. ( {"colid":"cellvalue"} )
 * @type Map
 */
SweetDevRia.Grid.prototype.getRowData = function(rowId){
	var rowIndex = this.getRowIndexForId(rowId);
	var map = {};

	for(var i=0;i<this.getColumnNumber();++i){
		map[this.getColumnAtPosition(i).id] = this.getCellValue(i, rowIndex);
	}
	return map;
};

/**
 * Get the real row index from the visible row index
 * @param {HtmlRows} rows Set of html rows
 * @param {int} rowIndex visible row index 
 * @return real row index from the visible row index
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getRowIndex = function(rows, rowIndex){
	var result = -1;
	for (var i = 0; i < rows.length; i++) {
		var row = rows [i];
		if (! YAHOO.util.Dom.hasClass(row,"ideo-ndg-detail")) {
			result ++;
		}
		
		if (result == rowIndex) {
			return i;
		}
	}
	
	return -1;
};


/**
 * Set a row selection
 * @param {String} rowId Identifiant of the row to select or unselect
 * @param {boolean} select select the row if true, else unselect
 */
SweetDevRia.Grid.prototype.setRowSelection = function(rowId, select){
	if (this.beforeSetRowSelection (rowId, select)) {
		
		if (select){
			this.addRowSelection (rowId);
		}
		else {
			this.removeRowSelection (rowId);
		}
		
		this.afterSetRowSelection (rowId, select);
	}
};

/**
 * Set a cell selection
 * @param {String} rowId Row identifiant of the cell's row to select or unselect
 * @param {String} columnId Column identifiant of the cell to select or unselect
 * @param {boolean} select Select the cell if true, else unselect
 */
SweetDevRia.Grid.prototype.setCellSelection = function(rowId, columnId, select){
	if (this.beforeSetCellSelection (rowId, columnId, select)) {
		if (select){
			this.addCellSelection (rowId, columnId);
		}
		else {
			this.removeCellSelection (rowId, columnId);
		}
		
		this.afterSetCellSelection (rowId, columnId, select);
	}
};

/**
 * Method is called when the user click on a cell.
 * @param {Event} mouse clic event
 * @param {String} rowId Row identifiant of the clicked cell
 * @param {String} columnId Column identifiant of the clicked cell
 * @private
 */
SweetDevRia.Grid.prototype.onSelectCell = function (evt, rowId, columnId){
	var ctrl = evt.ctrlKey;
	var shift = evt.shiftKey;

	this.setActive (true);

   	if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION){
	    this.setRowSelection(rowId, !this.isInSelection (rowId));
	}
	else if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){
	    this.setCellSelection(rowId, columnId, !this.isInSelection ([rowId, columnId]));
	}
	else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
		if (shift) {
			if (this.firstShiftSelection == null){ 
				this.firstShiftSelection = this.lastSelectionAdded;
			}
			
			//  we unselect old bloc
			this.selectRowBloc (this.lastSelectionAdded, this.firstShiftSelection, false);
			
			// we select the new bloc
			this.selectRowBloc (rowId, this.firstShiftSelection, true);

			this.lastSelectionAdded = rowId;
		}
		else {
			this.firstShiftSelection = null;
			
			if(ctrl != true) {
				this.clearSelection ();
				this.setRowSelection(rowId, true);
			}
			else {
			    this.setRowSelection(rowId, !this.isInSelection (rowId));
			}
		}
	}
	else if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
		if (shift) {
			if (this.firstShiftSelection == null){ 
				this.firstShiftSelection = this.lastSelectionAdded;
			}
			//  we unselect old bloc
			this.selectCellBloc (this.lastSelectionAdded, this.firstShiftSelection, false);
			
			// we select the new bloc
			this.selectCellBloc ([rowId, columnId], this.firstShiftSelection, true );

			this.lastSelectionAdded = [rowId, columnId];
		}
		else {
			this.firstShiftSelection = null;
			
			if(ctrl != true) {
				this.clearSelection ();
				this.setCellSelection (rowId, columnId, true);
			}
			else {
			    this.setCellSelection(rowId, columnId, !this.isInSelection ([rowId, columnId]));
			}
		}
	}
	SweetDevRia.$(this.id + "Menu").hide();
	
	//TT 534 : Allow the inner cell link clic
	//SweetDevRia.EventHelper.stopPropagation(evt);
	//SweetDevRia.EventHelper.preventDefault(evt);
	SweetDevRia.DomHelper.clearSelection();
};

/**
 * Test if a cell or a row is selected or not
 * @param {String | String[2]} obj rowId for a row test and [rowId, columnId] for a cell test
 * @return true if the cell or the row is selected, else false
 * @type boolean
 */
SweetDevRia.Grid.prototype.isInSelection = function(obj){
	if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION){
		return obj == this.selection;
	}
	else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
		return this.selection.contains (obj);
	}
	if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){
		return ((this.selection!==null)&&(obj[0] == this.selection[0])&&(obj[1] == this.selection[1]));
	}
	else if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
	    for(var i=0;i<this.selection.length;i++){
	        if((this.selection[i][0] == obj[0])&&(this.selection[i][1] == obj[1])){
	            return true;
	        }
	    }
		return false;
	}
	return null;
};

/**
 * Select a row 
 * @param {String} rowId Row identfiant to select
 * @param {boolean} test Test if the row is alread in the selection
 * @private
 */
SweetDevRia.Grid.prototype.addRowSelection = function(rowId, test){
	if (test == null){
		test = true;
	}
	if (!test || ! this.isInSelection (rowId)) {
		if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION){
		    if(this.selection !== null){
				this.removeRowSelection (this.selection);
		    }

		    this.selection = rowId;
		    var rowNode = document.getElementById (this.id+"_tr_"+this.selection);
			YAHOO.util.Dom.addClass(rowNode,"ideo-ndg-selection");

			this.lastSelectionAdded = rowId;
		}
		else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
			if (! this.selection.contains (rowId)) {
			    this.selection.add(rowId);
			}
		    var rowNode = document.getElementById (this.id+"_tr_"+rowId);
			YAHOO.util.Dom.addClass(rowNode,"ideo-ndg-selection");

			this.lastSelectionAdded = rowId;
		}
	}
};

/**
 * Unselect a row 
 * @param {String} rowId Row identfiant to unselect
 * @private
 */
SweetDevRia.Grid.prototype.removeRowSelection = function(rowId){
	if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION){
	    this.selection = null;
		var rowNode = document.getElementById (this.id+"_tr_"+rowId);
		YAHOO.util.Dom.removeClass(rowNode,"ideo-ndg-selection");
	}
	else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
	    this.selection.remove(rowId);
		var rowNode = document.getElementById (this.id+"_tr_"+rowId);
		YAHOO.util.Dom.removeClass(rowNode,"ideo-ndg-selection");
	}
};

/**
 * Select a cell 
 * @param {String} rowId Row identifiant of cell to select
 * @param {String} columnId Column Id of the cell to select
 * @param {boolean} test Test if the cell is alread in the selection
 * @private
 */
SweetDevRia.Grid.prototype.addCellSelection = function(rowId, columnId, test){
	if (test == null){
		test = true;
	}
	
	if (! test || ! this.isInSelection ([rowId, columnId])) {
		if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){

		    if(this.selection !== null){
				this.removeCellSelection (this.selection[0], this.selection[1]);
		    }

		    this.selection = [rowId, columnId];
			var cellNode = document.getElementById (this.id+"_cell_"+rowId+"_"+columnId);
			YAHOO.util.Dom.addClass(cellNode,"ideo-ndg-selection");

			this.lastSelectionAdded = this.selection;
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
			if (! this.isInSelection ([rowId, columnId])) {
		   		this.selection.add([rowId, columnId]);
			}
			var cellNode = document.getElementById (this.id+"_cell_"+rowId+"_"+columnId);
			YAHOO.util.Dom.addClass(cellNode,"ideo-ndg-selection");

			this.lastSelectionAdded = [rowId, columnId];
		}
	}
};

/**
 * Unselect a cell 
 * @param {String} rowId Row identifiant of cell to unselect
 * @param {String} columnId Column Id of the cell to unselect
 * @private
 */
SweetDevRia.Grid.prototype.removeCellSelection = function(rowId, columnId){
	if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){
	    this.selection = null;
		var cellNode = document.getElementById (this.id+"_cell_"+rowId+"_"+columnId);
		YAHOO.util.Dom.removeClass(cellNode,"ideo-ndg-selection");
	}
	else if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
	    for(var i=0;i<this.selection.length;i++){
	        if((this.selection[i][0] == rowId)&&(this.selection[i][1] == columnId)){
			    this.selection.remove(this.selection[i]);
	            break;
	        }
	    }

		var cellNode = document.getElementById (this.id+"_cell_"+rowId+"_"+columnId);
		YAHOO.util.Dom.removeClass(cellNode,"ideo-ndg-selection");
	}
};

/**
 * Clear all table selection
 */
SweetDevRia.Grid.prototype.clearSelection = function(){
	if (this.beforeClearSelection ()) {
		if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION){
			if(this.selection !== null){
			    var rowNode = document.getElementById (this.id+"_tr_"+this.selection);
				YAHOO.util.Dom.removeClass(rowNode,"ideo-ndg-selection");
				this.selection = null;			
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
			if(this.selection && this.selection.length !== 0){
				for(var i=0;i<this.selection.length;i++){
				    var rowNode = document.getElementById (this.id+"_tr_"+this.selection[i]);
					YAHOO.util.Dom.removeClass(rowNode,"ideo-ndg-selection");
				}			
				this.selection = [];			
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){
			if(this.selection && this.selection.length !== 0){
				var cellNode = document.getElementById (this.id+"_cell_"+this.selection[0]+"_"+this.selection[1]);
				YAHOO.util.Dom.removeClass(cellNode,"ideo-ndg-selection");			
				this.selection = null;			
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
			if(this.selection && this.selection.length !== 0){
				for(var i=0;i<this.selection.length;i++){
					var cellNode = document.getElementById (this.id+"_cell_"+this.selection[i][0]+"_"+this.selection[i][1]);
					YAHOO.util.Dom.removeClass(cellNode,"ideo-ndg-selection");
				}			
				this.selection = [];			
			}
		}
		
		this.afterClearSelection ();
	}
};

/**
 * Return the table selection
 * @return table selection, rowId for row selection, [rowId, columnId] for cell selection
 * @type String | Array
 */
SweetDevRia.Grid.prototype.getSelection = function(){
	return this.selection;
};

/**
 * Set the resizable column property
 * @param {String} colId Column identifiant to set
 * @param {boolean} resizable New value of te resizable property. If true, te use will be able to resize this column, else not
 */
SweetDevRia.Grid.prototype.setColumnResizable = function(colId, resizable){
	if (this.beforeSetColumnResizable (colId, resizable)) {
		var column = this.getColumn (colId);
	
		if (column) {
			column.resizable = resizable;
	
			var spliterId = this.spliterPrefix + column.id;
		   	var spliter = SweetDevRia.$ (spliterId);
			var spliterElem = SweetDevRia.DomHelper.get (spliterId);
			
			if (spliter) {		
				if (! resizable) {
					spliter.lock ();
					SweetDevRia.DomHelper.addClassName (spliterElem, "ideo-ndg-headSeparatorNoResize");
					SweetDevRia.DomHelper.removeClassName (spliterElem, "ideo-ndg-headSeparator");
				}
				else {
					spliter.unlock ();
					
					SweetDevRia.DomHelper.addClassName (spliterElem, "ideo-ndg-headSeparator");
					SweetDevRia.DomHelper.removeClassName (spliterElem, "ideo-ndg-headSeparatorNoResize");
				}
			}
		}
		
		this.afterSetColumnResizable (colId, resizable);
	}
};

/**
 * Indicate if the user can drag columns or not
 * @return true if the user can drag columns, else false
 * @type boolean
 */
SweetDevRia.Grid.prototype.getDraggableColumns = function(){
	return this.draggableColumns;
};

/**
 * Set the draggableColumns property. This property indicate if the user can drag columns or not
 * @param {boolean} draggable If true, the user can drag columns, else false
 */
SweetDevRia.Grid.prototype.setDraggableColumns = function(draggable){
	if (this.beforeSetDraggableColumns (draggable)) {
		this.draggableColumns = draggable;
		
		var colNum = this.getColumnNumber ();
	
		for(var i = 0; i < colNum - 1; i ++){
			var column = this.getColumnAtPosition (i);
	
			if (column) {
				var headerDD = this.headerDDs[column.id];
				if (headerDD) {
					if (! this.draggableColumns) {
						headerDD.lock ();
					}
					else {
						headerDD.unlock ();
					}
				}
			}
		}
		
		this.afterSetDraggableColumns (draggable);
	}
};

/**
 * Set the sortable column property, This property indicate if the user can sort this column or not
 * @param {String} colId Column to set
 * @param {boolean} sortable True if the user can sort this column, false if can't
 */
SweetDevRia.Grid.prototype.setColumnSortable = function(colId, sortable){
	if (this.beforeSetColumnSortable (colId, sortable)) {
		var column = this.getColumn (colId);
		if (column) {
			column.sortable = sortable;
	
			var header = SweetDevRia.DomHelper.get (this.headPrefix + column.id);
			if (header) {
				if (sortable) {
					var table = this;
					header.onclick = function () {
						table.sortColumn (column.id, column.ascendant ? false : true);
					};
				}
				else {
					header.onclick = null;
				}
			}
		}
		
		this.afterSetColumnSortable (colId, sortable);
	}
};

/**
 * Return the next column of this Grid. Be carefull, this method don't take into account the visibility column property. 
 * @see getNextVisibleColumn
 * @param {Column} col Reference Column which we search the next one
 * @return next column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getNextColumn = function(col){
	return this.getColumnAtPosition (col.position + 1);
};

/**
 * Return the previous column of this Grid. Be carefull, this method don't take into account the visibility column property. 
 * @see getPreviousVisibleColumn
 * @param {Column} col Reference Column which we search the previous one
 * @return previous column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getPreviousColumn = function(col){
	return this.getColumnAtPosition (col.position - 1);
};

/**
 * Return the next visible column of this Grid. Be carefull, this method take into account the visibility column property. 
 * @see getNextColumn
 * @param {Column} col Reference Column which we search the next one
 * @return next visible column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getNextVisibleColumn = function(col){
	var nextCol = null;
	var min = this.columnNumber;
    for (var colId in this.columns) {
		var column =this.columns [colId];
		if (column && column.visible && column.position > col.position && column.position < min) {
			min = column.position;
			nextCol = column;
		}
	}
	
	return nextCol;
};

/**
 * Return the previous visible column of this Grid. Be carefull, this method take into account the visibility column property. 
 * @see getPreviousColumn
 * @param {Column} col Reference Column which we search the previous one
 * @return previous visible column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getPreviousVisibleColumn = function(col){
	var previousCol = null;
	var max = -1;
    for (var colId in this.columns) {
		var column =this.columns [colId];
		if (column && column.visible && column.position < col.position && column.position > max) {
			max = column.position;
			previousCol = column;
		}
	}
	
	return previousCol;
};

/**
 * Return the last  column 
 * @return last  column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getLastColumn = function(){
	var lastCol = null;
	var max = -1;
    for (var colId in this.columns) {
		var column =this.columns [colId];
		if (column && column.position > max) {
			max = column.position;
			lastCol = column;
		}
	}
	
	return lastCol;
};

/**
 * Return the first  column 
 * @return first  column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getFirstColumn = function(){
	var firstCol = null;
	var min = this.columnNumber;
    for (var colId in this.columns) {
		var column =this.columns [colId];
		if (column && column.position < min) {
			min = column.position;
			firstCol = column;
		}
	}
	
	return firstCol;
};

/**
 * Return the last visible column 
 * @return last visible column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getLastVisibleColumn = function(){
	var lastCol = null;
	var max = -1;
    for (var colId in this.columns) {
		var column =this.columns [colId];
		if (column && column.visible && column.position > max) {
			max = column.position;
			lastCol = column;
		}
	}
	
	return lastCol;
};

/**
 * Return the first visible column 
 * @return first visible column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getFirstVisibleColumn = function(){
	var firstCol = null;
	var min = this.columnNumber;
    for (var colId in this.columns) {
		var column =this.columns [colId];
		if (column && column.visible && column.position < min) {
			min = column.position;
			firstCol = column;
		}
	}
	
	return firstCol;
};


/**
 * Return true if the table contains some data TT 458
 * @return true if the table contains some data
 * @type boolean
 */
SweetDevRia.Grid.prototype.containsData = function(){
	return this.tableBody.rows[0] != null;
};

/**
 * This method adjust the last column width. If the column with sum is smaller than the table width, we increase the last column siz to complete the difference.
 * @private
 */
SweetDevRia.Grid.prototype.adjustLastColumnSize = function(){

	var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
	var scrollerWidth = SweetDevRia.DomHelper.getScrollerWidth (divBody);

	if (this.width && (this.columnSizeSum <= (this.width - scrollerWidth))) { 
		if (this.keepColumnWidth) { 
			var lastCol = this.getLastVisibleColumn ();

			// If we had adjusted an other column, we resize it
			if (this.adjustedColumnId != null && lastCol.id != this.adjustedColumnId) {
				var adjustedCol = this.columns [this.adjustedColumnId ];
				var index = this.getCellIndexFromPosition (adjustedCol.position);
		
				if(this.containsData()){
			    	this.tableBody.rows[0].cells[index].style.width = adjustedCol.size + "px";
			    }
				this.tableHead.rows[0].cells[index].style.width = adjustedCol.size + "px";
	
			}
	
			this.adjustedColumnId = lastCol.id;
			var index = this.getCellIndexFromPosition (lastCol.position);
			
			var newSize = lastCol.size + this.width - this.columnSizeSum - scrollerWidth;

			if(this.containsData()){
		    	this.tableBody.rows[0].cells[index].style.width = newSize + "px";
		    }
			this.tableHead.rows[0].cells[index].style.width = newSize + "px";
		}	
	}
	else {
		if (this.adjustedColumnId != null) {
			var adjustedCol = this.columns [this.adjustedColumnId ];
			var index = this.getCellIndexFromPosition (adjustedCol.position);
	
			if(this.containsData()){
		    	this.tableBody.rows[0].cells[index].style.width = adjustedCol.size + "px";
		    }
			this.tableHead.rows[0].cells[index].style.width = adjustedCol.size + "px";

		}
	}
};

/**
 * Set a colum width
 * @param {Stirng} colId Identifiant of the column to resize
 * @param {int} size New width of the column
 */
SweetDevRia.Grid.prototype.setColumnSize = function(colId, size){
	if (this.beforeSetColumnSize (colId, size)) {
		var column = this.getColumn (colId);
		if (column) {

			this.columnSizeSum = this.columnSizeSum - column.size + size; 

			column.size = SweetDevRia.DomHelper.parsePx (size);

			var index = 2 * column.position + 1; // RAG

			if( this.displayCheckbox){
				index += 2;
			}
			
			if(this.containsData()){//if we have some data TT 458
		    	this.tableBody.rows[0].cells[index].style.width = column.size + "px";
		    }
			this.tableHead.rows[0].cells[index].style.width = column.size + "px";
			//TT 458
			//this.tableHead.rows[0].cells[index].style.width = this.tableBody.rows[0].cells[index].style.width;
			
			this.adjustLastColumnSize ();
		}
		
		this.afterSetColumnSize (colId, size);
	}
};

/**
 * Rename a spliter. Used when the user move a column.
 * @param {String} colBeforeId Identifiant of the associated column before rename
 * @param {String} colId Identifiant of the associated column after rename
 * @private
 */
SweetDevRia.Grid.prototype.renameSeparator = function(colBeforeId, colId){
	var spliterId = this.spliterPrefix + colBeforeId;
	var spliter = SweetDevRia.$ (spliterId);

	// modify header spliter id
	var separator = SweetDevRia.DomHelper.get (spliterId);
	separator.setAttribute ("id", this.spliterPrefix + colId); 

	// modify rows spliter id
	for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
		var rowId =  this.getRowIdByIndex (i);

        var oldSeparatorId = this.id+"_cell_spliter_"+rowId+"_"+colBeforeId;
        var rowSeparator = document.getElementById (oldSeparatorId); 

        var newSeparatorId = this.id+"_cell_spliter_"+rowId+"_"+colId;
		rowSeparator.setAttribute ("id", newSeparatorId); 
	}

	// If it s the last column, we must replace the spliter  component
//	if (this.getLastColumn().id == colId) {
	if (colBeforeId != colId) {
		// delete old spliter component
		if (spliter) {
			this.spliters.remove (spliter);
			// we unregister the old spliter dragdrop object
			spliter.unreg ();
			SweetDevRia.unregister (spliter);
		}
		
		// create a new spliter component
		this.createSpliter (colId);
	}


	this.resetSpliters ();
	
	return separator;
};



/**
 * Set a column position 
 * @param {String} colId Identifiant of the column to move
 * @param {int} position New position of the column
 */
SweetDevRia.Grid.prototype.setColumnPosition = function(colId, position){
	if (this.beforeSetColumnPosition (colId, position)) {
		var column = this.getColumn (colId);
		var targetCol = this.getColumnAtPosition (position);
		var lastCol = this.getLastColumn ();
		var lastVisibleCol = this.getLastVisibleColumn ();
	
		var targetId = null;
		
		var oldPosition = column.position;
		var oldPositionIndex = this.getCellIndexOfColumn (column);
		var separatorId = column.id;
		var positionIndex = this.getCellIndexFromPosition (position);

		var isLastPosition = false;
		// If we drop the column at the last position
		if (position == lastCol.position + 1) {
			isLastPosition = true;
		}
		else {
			targetId = targetCol.id;
		}

		// if we drag the last column
		if (column == lastCol) {
			// we search the previous column
			var colBefore = this.getPreviousColumn (column);
	
			//rename separator
			this.renameSeparator (colBefore.id, colId);

			separatorId = colId;

		}

		// update all column positions
		if (oldPosition < position) { 
			for (var i = oldPosition; i <= position-1; i++) {
				var col = this.getColumnAtPosition (i);
				col.position --;
			}
			column.position = position - 1;
		}
		else if (oldPosition > position){
			for (var i = oldPosition; i >= position; i--) {
				var col = this.getColumnAtPosition (i);
				col.position ++;
			}
	
			column.position = position;
		}

		// swap Data
    	this.dropDataColumn(this.id+"_bodyTable", colId, separatorId, targetId, isLastPosition);                

		// Swap header et spliter
		var node = SweetDevRia.DomHelper.get (this.headPrefix + colId);
		var separator = SweetDevRia.DomHelper.get (this.spliterPrefix + colId);
	    if(! isLastPosition){

			var targetNode = SweetDevRia.DomHelper.get (this.headPrefix + targetCol.id);

	      	targetNode.parentNode.insertBefore(node.parentNode.removeChild(node),targetNode);
	        targetNode.parentNode.insertBefore(separator.parentNode.removeChild(separator),targetNode);
	    }
	    else{
			var parentNode = separator.parentNode; 

			//rename separator
			var sep = this.renameSeparator (colId, lastVisibleCol.id);
	
	        parentNode.appendChild(sep);
	        node.parentNode.appendChild(node.parentNode.removeChild(node));
	    }

		// hide hidden columns and show visible columns
		this.refreshColumnVisibilities ();

		this.adjustLastColumnSize ();
		
		this.afterSetColumnPosition (colId, position);
	}

};


/**
 * Excel Export of rows 
 * @param {int} exportMode Define if we export in wysiwyg mode or model mode. Possible values are SweetDevRia.Grid.WYSIWYG_EXPORT and SweetDevRia.Grid.MODEL_EXPORT
 * @param {Array} exportdRowIds Array containing all exported row ids. If null, all rows will be exported.
 * @param {String} exportId String representing the id of the export being processed.
 */
SweetDevRia.Grid.prototype.excelExport = function(exportMode, exportRowIds, exportId){
	if (this.beforeExcelExport (exportMode, exportRowIds, exportId)) {

		this.updateServerModel ();

		SweetDevRia_exportExcel(exportId, exportMode, exportRowIds);

		this.afterExcelExport (exportMode, exportRowIds, exportId);
	}
};


/**
 * Execute a multiple column sort
 * @param {Array} columnsOrder Contains all columns order to sort.Each value is an array with the column id and the ascendant property. 
 * exemple : [["col4", true], ["col1", false], ["col3", true]]
 */
SweetDevRia.Grid.prototype.multipleColumnSort = function(columnsOrder){
	if (this.beforeMultipleColumnSort (columnsOrder)) {
		this.resetAllColumnSortClass ();

		var orders = [];

		if(columnsOrder.length == 0){
			SweetDevRia.log.error('No columns have been selected for multiple sort.');
			return;
		}

		for (var i = 0 ; i < columnsOrder.length; i++) {
			var colArr = columnsOrder [i];
			var colId = colArr [0]; 			
			var ascendant = colArr [1]; 	

			var col = this.getColumn (colId);
			this.setColumnSortClass (colId, ascendant);		
			col.ascendant = ascendant;
			col.sortOrder = i;
			var cellIndex = col.initialPosition;

			orders.add ([cellIndex, ascendant]);
		}

		if (this.loadAllData) {
			function compareFunction (a, b) {
				for (var i = 0; i < orders.length; i++){
					var index = orders [i][0];
					var ascendant = orders [i][1];

					var compare = b[index] - a[index];
					if (ascendant) {
						compare = a[index] - b[index];
					}
					
					if (compare != 0) {
						return compare;
					}
				}

				if (compare == 0) {
					for (var i = 1; i < a.length; i++) {
						if (a[i] != b[i]) {
							if (ascendant) {
								return a[i] - b[i];
							}
							else {
								return b[i] - a[i];
							}
						}
					}
				}

				return compare;
			}

			this.data = this.data.sort (compareFunction);
		}
		else {
			SweetDevRia.showWaitingMessage (this.getMessage("multipleSortWaiting"), "ideo-ndg-waitingMessage");
			SweetDevRia.centerWaitingMessage(SweetDevRia.DomHelper.get(this.id));
			
			this.updateServerModel ();
			
			var params = {"gridId" : this.id, "orders" : columnsOrder};
			SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("sort", this.id, params));
		}

		this.setData(this.data);

		this.afterMultipleColumnSort (columnsOrder);
	}
};


/**
 * Reset All header column style
 * @private
 */
SweetDevRia.Grid.prototype.resetAllColumnSortClass = function(){
    for (var colId in this.columns) {
		var column = this.getColumn (colId);
		if (column) {		
			this.setColumnSortClass (colId, null);
			column.ascendant = null;
			column.sortOrder = null;
		}
	}
};

/**
 * Refresh the header column style
 * @param {String} colId The column id to refresh
 * @param {boolean} ascendant True is the column must be ascendant sorted, false for descendant sorting 
 * @private
 */
SweetDevRia.Grid.prototype.setColumnSortClass = function(colId, ascendant){
	var column = this.getColumn (colId);
	
	var headerSort = SweetDevRia.DomHelper.get (this.headPrefix + colId+"_sort");
	if (ascendant == true) {
		SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortDesc");
		SweetDevRia.DomHelper.addClassName (headerSort,"ideo-ndg-headerSortAsc");
	}
	else if (ascendant == false) {
		SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortAsc");
		SweetDevRia.DomHelper.addClassName (headerSort,"ideo-ndg-headerSortDesc");
	}
	else if (ascendant == null) {
		SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortAsc");
		SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortDesc");
	}
};

/**
 * Refresh all checbox state. This method is called after a sort or a pagination.
 * @private
 */
SweetDevRia.Grid.prototype.refreshCheckboxes = function() {
	if (! this.displayCheckbox){
		return;
	}

	for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
		var rowId =  this.getRowIdByIndex (i);
		var checkbox =  SweetDevRia.DomHelper.get (this.id+"_col_"+rowId+"_checkbox");

		if (checkbox && this.checkedRows.contains (rowId)) {
			this.setCheckbox (rowId, true, i == this.getLastVisibleIndex());
		}
	}
};

/**
 * Refresh all selection. This method is called after a sort or a pagination.
 * @private
 */
SweetDevRia.Grid.prototype.refreshSelection = function() {
	for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
		var rowId =  this.getRowIdByIndex (i);

		if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION || this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
		    if(this.isInSelection (rowId)){
				this.addRowSelection (rowId, false);
				this.lastSelectionAdded = rowId;
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION || this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
		    for (var colId in this.columns) {
				var column = this.getColumn (colId);
				if (column) {		
				    if(this.isInSelection ([rowId, colId])){
						this.addCellSelection (rowId, colId, false);
						this.lastSelectionAdded = [rowId, colId];
					}
				}
			}
		}
		
		this.firstShiftSelection = null;
	}
};

/**
 * Sort a column 
 * @param {String} colId Identifiant of the column to sort
 * @param {boolean} ascendant True is the column must be ascendant sorted, false for descendant sorting 
 */
SweetDevRia.Grid.prototype.sortColumn = function(colId, ascendant){
	if (this.beforeSortColumn (colId, ascendant)) {
		if (ascendant == null){
			ascendant = true;
		}
		
		var column = this.getColumn (colId);
		if (column) {
			this.resetAllColumnSortClass ();
			
			// we update the sort image
			this.setColumnSortClass (colId, ascendant);
			column.ascendant = ascendant;
			column.sortOrder = 0;
			
			if (this.loadAllData) {
				var index = column.position;

				function compareFunction (a, b) {
					var compare = b[index] - a[index];
					if (ascendant) {
						compare = a[index] - b[index];
					}
					
					if (compare == 0) {
						for (var i = 1; i < a.length; i++) {
							if (a[i] != b[i]) {
								if (ascendant) {
									return a[i] - b[i];
								}
								else {
									return b[i] - a[i];
								}
							}
						}
					}
					
					return compare;
				}

				this.data = this.data.sort (compareFunction);
				this.setData(this.data);
			}
			else {
				SweetDevRia.showWaitingMessage (this.getMessage("sortWaiting"), "ideo-ndg-waitingMessage");
				SweetDevRia.centerWaitingMessage(SweetDevRia.DomHelper.get(this.id));
				
				this.updateServerModel ();

				var params = {"gridId" : this.id, "orders" : [[colId, ascendant, 0]]};
				
				SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("sort", this.id, params));
			
			}
		}
		
		this.afterSortColumn (colId, ascendant);
	}
};


/**
 * This method is called on server sort callback
 * @param {RiaEvent} evt Event containing data to displayed
 * @private
 */

SweetDevRia.Grid.prototype.onSort = function(evt) {
	this.setData( evt.data );

	this.refreshCheckboxes();

	this.refreshSelection ();
	
	SweetDevRia.hideWaitingMessage ();

	return true;
};

/**
 * Send all client grid information to the server to update the server model.
 * Be careful, this is a synchrone ajax call.
 * This method is called before call server side pagination, sort or excel export.  
 */
SweetDevRia.Grid.prototype.updateServerModel = function(){
	var params = {};
	params ["synchroCall"] = true;
	
	params ["gridId"] = this.id;
	params ["columns"] = this.columns;
	params ["width"] = this.width;
	params ["height"] = this.height;
	params ["draggableColumns"] = this.draggableColumns;
	params ["resizable"] = this.resizable;
	params ["selectionMode"] = this.selectionMode;
	params ["selection"] = this.selection;
	params ["checkedRows"] = this.checkedRows;
	params ["actualPage"] = this.actualPage;

	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("updateModel", this.id, params));
};


/**
 * Change the displayed page into table pagination
 * @param {int} actualPage New displayed page number
 * @see SweetDevRia.PageBar.prototype.goToPage
 */
SweetDevRia.Grid.prototype.goToPage = function(actualPage){
	if (this.beforeGoToPage (actualPage)) {
		this.actualPage = actualPage;
	
		if (this.loadAllData) {
			this.setData (this.data);
		}
		else {
			SweetDevRia.showWaitingMessage (this.getMessage("paginationWaiting"), "ideo-ndg-waitingMessage");
			SweetDevRia.centerWaitingMessage(SweetDevRia.DomHelper.get(this.id));
			
			this.updateServerModel ();

			var params = {};
			params ["gridId"] =  this.id;
			params ["actualPage"] = this.actualPage;
			SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("pagin", this.id, params));
		}

		this.afterGoToPage (actualPage);
	}

};

/**
 * This method is called on server pagination callback
 * @param {RiaEvent} evt Event containing data to displayed
 * @private
 */
SweetDevRia.Grid.prototype.onPagin = function(evt) {
	this.setData( evt.data );

	this.refreshCheckboxes();

	this.refreshSelection ();

	SweetDevRia.hideWaitingMessage ();

	return true;
};



/**
 * Return the header height
 * @return header height
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getHeightHeader = function (){
	return this.heightHeader;
};

/**
 * Set the header height
 * @param {int} heightHeader The new header height
 * @private
 */
SweetDevRia.Grid.prototype.setHeightHeader = function (heightHeader){
	this.heightHeader = heightHeader;
};

/**
 * Return the default row height
 * @return row height
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getHeightRow = function (){
	return this.heightRow;
};

/**
 * Set the default row 
 * @param {int} heightRow The new default row height
 * @private
 */
SweetDevRia.Grid.prototype.setHeightRow = function (heightRow){
	this.heightRow = heightRow;
};


/**
 * Indicate if all data are loaded or if we will call server.
 * @param {boolean} loadAllData If true, that s indicate that all data ara loaded, so don't make ajax call when change page or sort. Default value is false.
 * @private
 */
SweetDevRia.Grid.prototype.setLoadAllData = function (loadAllData){
	this.loadAllData = loadAllData;
};


/**
 * Set the row number per page
 * @param {int} rowPerPage Row number per page. Default is 50.
 * @private
 */
SweetDevRia.Grid.prototype.setRowPerPage = function (rowPerPage){
	this.rowPerPage = rowPerPage;
};



/**
 * Indicate if the table is resizable or not.
 * @return true if the user can resize table, else false
 * @type boolean
 */
SweetDevRia.Grid.prototype.getResizable = function (){
	return this.resizable;
};

/**
 * Set the resizable property. This method hide or show the resizer
 * @param {boolean} resizable True if the ser can resize the table, else false
 */
SweetDevRia.Grid.prototype.setResizable = function (resizable){
	if (this.beforeSetResizable (resizable)) {
		this.resizable = resizable;

		var resizerId = this.id+"_"+SweetDevRia.Grid.RESIZER;
		var resizer = SweetDevRia.DomHelper.get (resizerId);
		if (this.resizer == null) {
		    this.resizer = new YAHOO.util.DD(resizerId);
		    this.resizer.onMouseUp = this.resizerOnMouseUp(this);
		    this.resizer.onMouseDown = this.resizerOnMouseDown(this);
		}

		if (this.resizable) {

			this.resizer.unlock ();

			if (resizer) {
				resizer.style.display =  "";

				var resizer = document.getElementById(this.resizerId);
	//			resizer.style.bottom = "auto";
				resizer.style.top = "";
				resizer.style.right = "0px";

				resizer.style.left = "auto";


				this.resizer.resetConstraints ();
			}
		}
		else {
			this.resizer.lock ();

			if (resizer) {
				resizer.style.display = "none";
			}
		}
				
		this.afterSetResizable (resizable);
	}
};


/**
 * Create the pagination bar. 
 * @private
 */
SweetDevRia.Grid.prototype.createPageBar = function(){
	
	var pageBar = new SweetDevRia.PageBar (this.pageBarId);	

	pageBar.setPageNumber (this.pageNumber);
	pageBar.setActualPage (this.actualPage);
	pageBar.setLinkedId (this.id);

	var container = document.getElementById (pageBar.id+"_container");
	container.style.display = "";
	
	// create pageBar !
	pageBar.render ();
};

/**
 * Call the excel export
 * @private
 */
SweetDevRia.Grid.prototype.callExcelExport = function(){

	var radios = document.getElementsByName (this.id+"_excelExport_mode");
	var radio = radios[0]; 
	if (radios[1].checked) {
		radio = radios[1]; 
	}

	var exportMode = SweetDevRia.Grid.MODEL_EXPORT;
	if (radio.id == this.id+"_excelExport_wysiwyg") {
		exportMode = SweetDevRia.Grid.WYSIWYG_EXPORT;
	}

	var check = document.getElementById (this.id+"_excelExport_check");	
	var rowIds = null;
	if (check && check.checked) {
		rowIds = this.getCheckedRows ();
	}

	this.excelExport (exportMode, rowIds, this.currentExportProcessing);

	var win = SweetDevRia.$ (this.excelPropertiesWindowId);
	win.close ();
};


/**
 * Call the Multiple Column Sort method with parameters of the multiple column sort Window
 * @private
 */
SweetDevRia.Grid.prototype.callMultipleColumnSort = function(){
	var columnsOrder = [];
	
	for (var i = 0; i < this.sortPropertiesDeep.length; i ++) {
		var select = document.getElementById (this.id+"_sort"+i);
		
		var colId = select.options[select.selectedIndex].value;
		if (colId != "") {
			var radios = document.getElementsByName (this.id+"_sort"+i+"_order");
			var radio = radios[0]; 
			if (radios[1].checked) {
				radio = radios[1]; 
			}

			var asc = null;
			if (radio.id == this.id+"_sort"+i+"_asc") {
				asc = true;
			}
			else {
				asc = false;
			}
	
			columnsOrder.add ([colId, asc, i]);
		}
	}


	this.multipleColumnSort (columnsOrder);

	var win = SweetDevRia.$ (this.sortPropertiesWindowId);
	win.close ();
};


/**
 * Create the excel Window
 * @private
 */
SweetDevRia.Grid.prototype.createExcelProperties = function(){
	new SweetDevRia.Window(this.excelPropertiesWindowId,-1, -1,500,200,200,100,2000,2000,null ,true, false, true);

	var win = SweetDevRia.$ (this.excelPropertiesWindowId);
	win.title = this.getMessage("exportExcelProperties");
	win.message = null;
	win.showTitleIcon = false;
	win.showCorner = false;
	win.isResizable = false;
	win.canMaximize = false;
	win.canMinimize = false;

	win.content = this.getRenderString (this.templateExcelProperties);

	win.render ();
	win.initialize ();
	
	var winElem = win.getView ();
	document.body.appendChild (winElem);
};

/**
 * Show  the Excel Window
 * @private
 */

SweetDevRia.Grid.prototype.showExcelProperties = function(exportId){
	// set the export being processed
	this.currentExportProcessing = exportId;

	if (SweetDevRia.$ (this.excelPropertiesWindowId) == null) {
		this.createExcelProperties ();
	}

	// refresh selected values
	var radioWysiwyg = document.getElementById (this.id+"_excelExport_wysiwyg");
	var radioModel = document.getElementById (this.id+"_excelExport_model");
	radioWysiwyg.checked = true;
	radioModel.checked = false;

	var check = document.getElementById (this.id+"_excelExport_check");
	if (check) {
		if (this.checkedRows.length > 0) {
			check.checked = true;
			check.disabled = false;
		}
		else {
			check.checked = false;
			check.disabled = true;
		}
	}

	SweetDevRia.$ (this.excelPropertiesWindowId).open ();
};


/**
 * Create the multiple column sort Window
 * @private
 */
SweetDevRia.Grid.prototype.createSortProperties = function(){
	new SweetDevRia.Window(this.sortPropertiesWindowId,-1, -1,500,300,200,100,2000,2000,null ,true, false, true);
	
	var win = SweetDevRia.$ (this.sortPropertiesWindowId);
	win.title = this.getMessage("multipleSortProperties");
	win.message = null;
	win.canMaximize = false;
	win.canMinimize = false;
	win.showTitleIcon = false;
	win.showCorner = false;
	win.isResizable = false;

	// transform an in to an array for the template
	var index = this.sortPropertiesDeep;
	this.sortPropertiesDeep = [];
	for (var i = 0; i < index; i ++) {
		this.sortPropertiesDeep.add (i);
	} 
	
	win.content = this.getRenderString (this.templateSortProperties);

	win.render ();
	win.initialize ();
	
	var winElem = win.getView ();
	document.body.appendChild (winElem);
};

/**
 * Show  the multiple column sort Window
 * @private
 */

SweetDevRia.Grid.prototype.showSortProperties = function(){
	if (SweetDevRia.$ (this.sortPropertiesWindowId) == null) {
		this.createSortProperties ();
	}

	// refresh selected values
	for (var i = 0; i < this.sortPropertiesDeep.length; i ++) {
		var select = document.getElementById (this.id+"_sort"+i);

		select.options.length = 0;
		if(i != 0){
			var anOption = document.createElement("OPTION");
			select.options.add(anOption);
			anOption.text = " ";
			anOption.value = "";
		}
		var isSelected = false;
		radioAscValue = true;
	    for (var colId in this.columns) {
			var col = this.getColumn (colId);
			if (col && col.visible) {
				var anOption = document.createElement("OPTION");
				select.options.add(anOption);
				anOption.text = this.getHeaderText (col.id);
				anOption.value = colId;
				if (col.ascendant != null && (col.sortOrder == null || col.sortOrder == i)) {
					anOption.selected = true;
					isSelected = true;
					radioAscValue = col.ascendant != null ? col.ascendant : true; 
				}
			}
		}

		if (! isSelected) {
			var options = select.options; 
			if (i == 0)  {
				for (var j = 0; j < options.length; j++) {
					var id = options[j].value;
					if (id != "") {
						var col = this.getColumn (id);
						if (col == this.getFirstVisibleColumn()) {
							options [j].selected = true;
							break;
						}
					}
				}
			}
			else {
				options [0].selected = true;
			}
		}
		
		var radioAsc = document.getElementById (this.id+"_sort"+i+"_asc");
		var radioDsc = document.getElementById (this.id+"_sort"+i+"_dsc");
		radioAsc.checked = radioAscValue;
		radioDsc.checked = ! radioAscValue;
	} 

	SweetDevRia.$ (this.sortPropertiesWindowId).open ();
};



/**
 * Create the context menu. This menu is plugged on right click.
 * @private
 */
SweetDevRia.Grid.prototype.createContextMenu = function(){

	var menu = new SweetDevRia.ContextMenu (this.id + "Menu");
	menu.targetId = this.id+"_bodyDiv"; 
	
	var table = this;
	
	var menuItemSort = new SweetDevRia.MenuItem(this.id + "MenuItemSort");
	menuItemSort.label = this.getMessage('sortMenu');
	menuItemSort.checkbox = false;
	menuItemSort.checked = false;
	menuItemSort.disabled = false;
	menuItemSort.image = null ;
	menuItemSort.onclick = function(){table.showSortProperties();};
	menuItemSort.oncheck = function(){};
	menuItemSort.onuncheck = function(){};

	menu.addItem(menuItemSort);

	if(this.innerExportId){
		var menuItemExport = new SweetDevRia.MenuItem(this.id + "MenuItemExport");
		menuItemExport.label = this.getMessage('excelMenu');
		menuItemExport.checkbox = false;
		menuItemExport.checked = false;
		menuItemExport.disabled = false;
		menuItemExport.image = null ;
		menuItemExport.onclick = function(){table.showExcelProperties(table.innerExportId);};
		menuItemExport.oncheck = function(){};
		menuItemExport.onuncheck = function(){};
		menu.addItem(menuItemExport);
	}


	var menuItemVisibility = new SweetDevRia.MenuItem(this.id + "MenuItemVisibility");		
	menuItemVisibility.label = this.getMessage('visibilityMenu');
	menuItemVisibility.checkbox = false;
	menuItemVisibility.checked = false;
	menuItemVisibility.disabled = false;
	menuItemVisibility.image = null ;
	menuItemVisibility.onclick = function(){};
	menuItemVisibility.oncheck = function(){};
	menuItemVisibility.onuncheck = function(){};

	menu.addItem(menuItemVisibility);

	var table = this;
    for (var colId in this.columns) {
		var column = this.getColumn (colId);
		if (column != null) {		

			var menuItem = new SweetDevRia.MenuItem(this.id + "MenuItem"+colId);
			menuItem.label = this.getHeaderText (column.id);
			menuItem.checkbox = column ["hideable"];
			menuItem.checked = column ["visible"];
			menuItem.disabled = !column ["hideable"];
			menuItem.image = null ;
			
			menuItem.onclick = function(){};
			menuItem.oncheck = menuItemCheck (table, colId);
			menuItem.onuncheck = menuItemUncheck (table, colId);
			
			menuItemVisibility.addItem(menuItem);
		}	
	}

	// We plug the context menu on all headers right click
    for (var colId in this.columns) {
		var column = this.getColumn (colId);
		if (column) {		
			document.getElementById(this.headPrefix + colId).oncontextmenu = function(e){return menu.show(e); };
		}
	}

	// create menu !
	menu.render ();

	menu.initialize ();

	
	function menuItemCheck (table, colId){
		return function(){table.setColumnVisibility (colId, true);};
	}		
	function menuItemUncheck (table, colId){
		return function(){table.setColumnVisibility (colId, false);};
	}
};


/**
 * Set all column elements visiblity
 * @param {String} colId Identifiant of the column to show or hide
 * @param {boolean} visibility The new visibility of the column
 * @private
 */
SweetDevRia.Grid.prototype.setColumnElementsVisibility = function(colId, visibility){
	var spliterVisibility = visibility;
	
	var column = this.getColumn (colId);
	
	var position = column.position;

	var spliterPosition = column.position;
	var cellIndex = this.getCellIndexFromPosition (position);
	
	var lastColumn = this.getLastColumn ();
	var lastCellIndex = this.getCellIndexOfColumn (lastColumn);
	var lastVisibleColumn = this.getLastVisibleColumn ();
	var lastVisibleCellIndex = this.getCellIndexOfColumn (lastVisibleColumn);

	// If we hide the last column, we change the spliter position to hide (we take the previous, not next)
	if ( cellIndex >= lastCellIndex) {
		spliterPosition = position - 1;
		var col = SweetDevRia.DomHelper.get (this.id+"_col_"+position); 
		
		// If we hide a column , we must hide the last previous visible spliter.
		if (this.testElementVisibility (col) && ! visibility) {
			while (! this.testElementVisibility(SweetDevRia.DomHelper.get (this.id+"_head_spliter_"+spliterPosition))) {
				spliterPosition = spliterPosition - 1;
			}
		}
	}
	else if ( cellIndex == lastVisibleCellIndex) {
		spliterVisibility = false;
	}

	var col = SweetDevRia.DomHelper.get (this.id+"_col_"+position); 
	this.setElementVisibility (col, visibility);

	var spliter = SweetDevRia.DomHelper.get (this.id+"_spliter_"+spliterPosition); 
	this.setElementVisibility (spliter, spliterVisibility);

	var header = SweetDevRia.DomHelper.get (this.id+"_head_col_"+position); 
	this.setElementVisibility (header, visibility);

	var headerSpliter = SweetDevRia.DomHelper.get (this.id+"_head_spliter_"+spliterPosition); 
	this.setElementVisibility (headerSpliter, spliterVisibility);

	this.resetSpliters ();

	this.tableBody.style.tableLayout = "fixed";
	this.tableHead.style.tableLayout = "fixed";

	this.adjustLastColumnSize ();
};

/**
 * Set an element visiblity
 * @param {HtmlElement} elem Html elmenent to show or hide
 * @param {boolean} visibility The new visibility of the element
 * @private
 */
SweetDevRia.Grid.prototype.setElementVisibility = function(elem, visibility){
	if (elem) {
		if (typeof ActiveXObject != "undefined") { // if  IE
			if (visibility) {
				elem.style.width = "auto";
				elem.style.display = "block";
			}
			else {
				elem.style.width = "0px";
				elem.style.display = "none";
			}
		}
		else {
			if (visibility) {
				elem.style.width = "auto";
				elem.style.visibility = "visible";
			}
			else {
				elem.style.width = "0px";
				elem.style.visibility = "collapse";
			}
		}
	}
};

/**
 * Test an element visiblity
 * @param {HtmlElement} elem Html elmenent to test
 * @return true if elem is visible, false if not, null if elem doesn t exist
 * @type boolean
 * @private
 */
SweetDevRia.Grid.prototype.testElementVisibility = function(elem){
	if (elem) {
		if (typeof ActiveXObject != "undefined") { // if  IE
			return (elem.style.display != "none");
		}
		else {
			return (elem.style.visibility == "visible" || elem.style.visibility == "");
		}
	}
	
	return null;
};

/**
 * Swap an element visiblity. Show it if it's hide, or hide if it's visible.
 * @param {HtmlElement} elem Html elmenent to swap
 * @private
 */
function swapVisibility (elem) {
	if (! elem){
		return;
	}
	if (elem.style.display == "none"){
		elem.style.display = "";
	}
	else{ 
		elem.style.display = "none";
	}
}

/**
 * Find the next selection with a keycode (left, up, rigth, bottom arrow) from a selection. 
 * @param {String} lastSelection Start selection (rowId)
 * @param {Event} evt Key event
 * @return the next row id selection 
 * @type String
 * @private
 */
SweetDevRia.Grid.prototype.getNextRowSelection =  function (lastSelection, evt) {
	var nextSelectionNode = null;
	var keyCode = evt.keyCode;
	var ctrl = evt.ctrl;

	var rowNode = document.getElementById (this.id+"_tr_"+lastSelection);
	var rows = rowNode.parentNode;

	if (keyCode == SweetDevRia.KeyListener.ARROW_DOWN_KEY) {
		if (ctrl) {
			nextSelectionNode = rows.rows [rows.rows.length - 2];
		}
		else {		
			if (rowNode.rowIndex < rows.rows.length - 2) { 
				nextSelectionNode = rows.rows [rowNode.rowIndex + 2];
			}
			else {
				nextSelectionNode = rowNode;
			}
		}
	}
	else if (keyCode == SweetDevRia.KeyListener.ARROW_UP_KEY) {
		if (ctrl) {
			nextSelectionNode = rows.rows [0];
		}
		else {		
			if (rowNode.rowIndex > 0) { 
				nextSelectionNode = rows.rows [rowNode.rowIndex - 2];
			}
			else {
				nextSelectionNode = rowNode;
			}
		}
	}

	if (nextSelectionNode != null) {
		var nextSelection =  nextSelectionNode.id.substring ((this.id+"_tr_").length);
		return nextSelection;
	}
	
	return null;
};


/**
 * Find the next selection with a keycode (left, up, rigth, bottom arrow) from a selection. 
 * @param {Array} lastSelection Start selection ( [rowId, columnId] )
 * @param {Event} evt Key event
 * @param {boolean} swapRow If true, when you search the next cell of the last cell of a row, this method return the first cell of the next row. Default is true
 * @return the next cell ids selection, [rowId, columnId] 
 * @type Array
 * @private
 */
SweetDevRia.Grid.prototype.getNextCellSelection =  function (lastSelection, evt, swapRow) {
	if (swapRow == null){
		swapRow = true;
	}
	var keyCode = evt.keyCode;
	var ctrl = evt.ctrl;
	
	var column = this.getColumn (lastSelection[1]);
	var nextColumn = null; 
	
	var rowNode = document.getElementById (this.id+"_tr_"+lastSelection[0]);
	var rows = rowNode.parentNode;
	
	if (keyCode == SweetDevRia.KeyListener.ARROW_LEFT_KEY) {
		if (ctrl) {
			nextColumn = this.getFirstVisibleColumn ();
		}
		else {		
			nextColumn = this.getPreviousVisibleColumn (column);
			if (nextColumn == null && swapRow) {
				if (rowNode.rowIndex > 0) { 
					rowNode = rows.rows [rowNode.rowIndex - 2];
					
					nextColumn = this.getLastVisibleColumn ();
				}
				else {
					nextColumn = column; 
				}
			} 
		}
	}
	else if (keyCode == SweetDevRia.KeyListener.ARROW_RIGHT_KEY) {
		if (ctrl) {
			nextColumn = this.getLastVisibleColumn ();
		}
		else {		
			nextColumn = this.getNextVisibleColumn (column);
			if (nextColumn == null && swapRow) {
				if (rowNode.rowIndex < rows.rows.length - 2) { 
					rowNode = rows.rows [rowNode.rowIndex + 2];
					
					nextColumn = this.getFirstVisibleColumn ();
				}
				else {
					nextColumn = column; 
				}
			} 
		}
	}
	else if (keyCode == SweetDevRia.KeyListener.ARROW_DOWN_KEY) {
		if (ctrl) {
			nextColumn = column;
			rowNode = rows.rows [rows.rows.length - 2];
		}
		else {		
			nextColumn = column; 
			if (rowNode.rowIndex < rows.rows.length - 2) { 
				rowNode = rows.rows [rowNode.rowIndex + 2];
			}
		}
	}
	else if (keyCode == SweetDevRia.KeyListener.ARROW_UP_KEY) {
		if (ctrl) {
			nextColumn = column;
			rowNode = rows.rows [0];
		}
		else {		
			nextColumn = column; 
			if (rowNode.rowIndex > 0) { 
				rowNode = rows.rows [rowNode.rowIndex - 2];
			}
		}
	}

	if (nextColumn && rowNode) {
		var nextRowId =  rowNode.id.substring ((this.id+"_tr_").length);
		return [nextRowId, nextColumn.id];
	}
	
	return null;
};


/**
 * Synchronize table scrollers to follow the selection 
 * @param {rowId | [rowId, colunId]} selection Selected row or cell ids 
 * @private
 */
SweetDevRia.Grid.prototype.synchronizeScrollers =  function (selection) {

	var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");

	var top = selection.offsetTop;
	var tdHeight = selection.offsetHeight;
	var height = SweetDevRia.DomHelper.parsePx (divBody.style.height);
	var scrollerHeight = SweetDevRia.DomHelper.getScrollerHeight (divBody);

	if (divBody.scrollTop + height - scrollerHeight < top + tdHeight) {
		divBody.scrollTop = top + tdHeight - height + scrollerHeight;
	}
	if (divBody.scrollTop > top) {
		divBody.scrollTop = top;
	}			


	var left = selection.offsetLeft;
	var tdWidth = selection.offsetWidth;
	var width = SweetDevRia.DomHelper.parsePx (divBody.style.width);
	
	if (divBody.scrollLeft + width < left + tdWidth) {
		divBody.scrollLeft = left + tdWidth - width;
	}
	if (divBody.scrollLeft > left) {
		divBody.scrollLeft = left;
	}	
};

/**
 * Check all checkboxes asscoiated with all selected rows. Be careful, this method do nothing in cell selection mode.
 */
SweetDevRia.Grid.prototype.checkSelection =  function () {
	var selection = this.getSelection ();

	if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION) {
		var rowId =  selection;
		this.setCheckbox (rowId, ! this.getCheckbox (rowId));
	}
	else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION) {
		for (var i = 0; i < selection.length; i ++) {
			var rowId =  selection [i];
			this.setCheckbox (rowId, ! this.getCheckbox (rowId));
		}
	}
};


/**
 * Select all rows or cells if multiple selection is ok.
 */
SweetDevRia.Grid.prototype.selectAll =  function () {
	var cells = this.tableBody.rows[0].cells;

	if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
		var firstCell = this.tableBody.rows[0].cells [0];
		var lastCell = this.tableBody.rows[this.tableBody.rows.length - 2].cells [this.tableBody.rows[this.tableBody.rows.length - 2].cells.length - 1];


		var firstRow = firstCell.parentNode;
		var firstRowId =  firstRow.id.substring ((this.id+"_tr_").length);
		var firstColumnId =  this.getFirstVisibleColumn().id;

		var lastRow = lastCell.parentNode;
		var lastRowId =  lastRow.id.substring ((this.id+"_tr_").length);
		var lastColumnId =  this.getLastVisibleColumn().id;

		this.selectCellBloc ([firstRowId, firstColumnId], [lastRowId, lastColumnId], true);
	}
	else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
		var firstRow = this.tableBody.rows[0];
		var lastRow = this.tableBody.rows[this.tableBody.rows.length - 2];

		var firstRowId =  firstRow.id.substring ((this.id+"_tr_").length);
		var lastRowId =  lastRow.id.substring ((this.id+"_tr_").length);

		this.selectRowBloc (firstRowId, lastRowId, true);
	}
};


/**
 * Manage the key selection (simple or multiple)
 * @param {Event} evt Key event
 * @private
 */
SweetDevRia.Grid.prototype.keySelection =  function (evt) {
	var keyCode = evt.keyCode;
	var shift = evt.shift;
	var nextSelection = null;

	if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION || this.selectionMode == SweetDevRia.Grid.CELL_SELECTION || ! shift){
		// Simple selection mode

		if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION || this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION) {
			this.clearSelection ();
		}

		if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION || this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
			nextSelection = this.getNextRowSelection (this.lastSelectionAdded, evt);
			if (nextSelection != null){
				this.setRowSelection (nextSelection, true);
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION || this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
			nextSelection = this.getNextCellSelection (this.lastSelectionAdded, evt);

			if (nextSelection != null){
				this.setCellSelection (nextSelection[0], nextSelection[1], true);
			}
		}
		
		this.firstShiftSelection = null;
	}
	else {
		// multiple selection mode

		if (this.firstShiftSelection == null){ 
			this.firstShiftSelection = this.lastSelectionAdded;
		}
		
		if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
			nextSelection = this.getNextCellSelection (this.lastSelectionAdded, evt, false);

			if (nextSelection != null) {
				//  we unselect old bloc
				this.selectCellBloc (this.lastSelectionAdded, this.firstShiftSelection, false);
	
				// we select the new bloc
				this.selectCellBloc (nextSelection, this.firstShiftSelection, true);

				this.lastSelectionAdded = nextSelection;
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
			nextSelection = this.getNextRowSelection (this.lastSelectionAdded, evt);
			if (nextSelection != null) {
				//  we unselect old bloc
				this.selectRowBloc (this.lastSelectionAdded, this.firstShiftSelection, false);
				
				// we select the new bloc
				this.selectRowBloc (nextSelection, this.firstShiftSelection, true);
				
				this.lastSelectionAdded = nextSelection;
			}
		}
	}
	
	
	if (nextSelection != null) {
		this.synchronizeScrollers (nextSelection);		
	}

};

/**
 * Allow you to select a rows bloc in one shot ! that's select all rows between row1 and row2.
 * @param {String} rowId1 First identifiant row of the bloc 
 * @param {String} rowId2 Last identifiant row of the bloc 
 * @param {boolean} select True if you want select the bloc, false else
 */
SweetDevRia.Grid.prototype.selectRowBloc =  function (rowId1, rowId2, select) {
	var row1 = document.getElementById (this.id+"_tr_"+rowId1);
	var row2 = document.getElementById (this.id+"_tr_"+rowId2);

	if (row1 != null && row2 != null) {
		var rowIndex1 = row1.rowIndex;
		var rowIndex2 = row2.rowIndex;
		if (rowIndex1 != null && rowIndex1 >=0 && rowIndex2 != null && rowIndex2 >= 0) {
			if (rowIndex2 < rowIndex1) {
				var temp = rowIndex1;
				rowIndex1 = rowIndex2;
				rowIndex2 = temp;
			}
	
			for (var i = rowIndex1; i <= rowIndex2; i++) {
				var row = this.tableBody.rows[i];
				if (row == null){
					break;
				}
				if (! YAHOO.util.Dom.hasClass(row,"ideo-ndg-detail")) {
	
					rowId =  row.id.substring ((this.id+"_tr_").length);
				
					this.setRowSelection(rowId, select);
				}				
			}
		}
	}
};

/**
 * Allow you to select a cells bloc in one shot ! that's select all cell between cell1 and cell2.
 * @param {[rowId, columnId]} cellIds1 First bloc cell identifiants 
 * @param {[rowId, columnId]} cellIds2 Last bloc cell identifiants 
 * @param {boolean} select True if you want select the bloc, false else
 */
SweetDevRia.Grid.prototype.selectCellBloc =  function (cellIds1, cellIds2, select) {

	var cell1 = document.getElementById (this.id+"_cell_"+cellIds1[0]+"_"+cellIds1[1]);
	var cell2 = document.getElementById (this.id+"_cell_"+cellIds2[0]+"_"+cellIds2[1]);

	if (cell1 != null && cell2 != null ) { 
		var row1 = cell1.parentNode;
		var row2 = cell2.parentNode;
	
		var cellIndex1 = cell1.cellIndex;
		var cellIndex2 = cell2.cellIndex;
	
		if (row1 != null && row2 != null ) { 
			var rowIndex1 = row1.rowIndex;
			var rowIndex2 = row2.rowIndex;
		
			if (cellIndex1 >= 0 && cellIndex2 >=0 && rowIndex1 >=0 && rowIndex2 >= 0) {
				var temp;
				if (rowIndex2 < rowIndex1) {
					temp = rowIndex1;
					rowIndex1 = rowIndex2;
					rowIndex2 = temp;
				}
				if (cellIndex2 < cellIndex1) {
					temp = cellIndex1;
					cellIndex1 = cellIndex2;
					cellIndex2 = temp;
				}
						
				for (var i = rowIndex1; i <= rowIndex2; i++) {
					var row = this.tableBody.rows[i];
					if (row == null){ 
						break;
					}

					// If it's not a detail row
					if (! YAHOO.util.Dom.hasClass(row,"ideo-ndg-detail")) {
						for (var j = cellIndex1; j <= cellIndex2; j++) {
							var cell = row.cells[j];
							if (! YAHOO.util.Dom.hasClass(cell,"ideo-ndg-bodySeparator")) {

								row = cell.parentNode;
								var rowId =  row.id.substring ((this.id+"_tr_").length);
								var columnId =  cell.id.substring ((this.id+"_cell_"+rowId+"_").length);

								this.setCellSelection(rowId, columnId, select);
							}
						}
					}
				}
			}
		}
	}
};

/**
 * Return the cell value
 * @param {int} cellIndex Cell index of the searched value
 * @param {int} rowIndex Row index of the searched value
 * @return  the cell value, null if the cell doesn't exist
 * @type Object
 * @private
 */
SweetDevRia.Grid.prototype.getCellValue =  function (cellIndex, rowIndex) {
	if (rowIndex < this.data.length && cellIndex < this.data [rowIndex].length-1) {
		return this.data [rowIndex] [cellIndex+1];
	} 

	return null;
};

/**
 * Handle key events to modify  selection
 * @param {Event} evt Key event
 * @private
 */
SweetDevRia.Grid.prototype.handleEvent =  function (evt) {
	if (this.isActive ()) {
		if (evt.type == SweetDevRia.RiaEvent.KEYBOARD_TYPE) {
			var keyCode = evt.keyCode;
			switch(keyCode) {
				case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
				case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
				case SweetDevRia.KeyListener.ARROW_UP_KEY:
				case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
					this.keySelection (evt);

					SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
					SweetDevRia.EventHelper.preventDefault(evt.srcEvent);

					break;
				case SweetDevRia.KeyListener.SPACE_KEY:

					this.checkSelection ();

					SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
					SweetDevRia.EventHelper.preventDefault(evt.srcEvent);

					break;
				default:
					break;
			}
		}
		if (evt.type == SweetDevRia.RiaEvent.SELECT_ALL) {

			this.selectAll ();

			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
		}
	}
};



SweetDevRia.Grid.prototype.templateExcelProperties = 
"\
<fieldset style=\"margin:5px\" class=\"ideo-ndg-winFieldSet\"><legend>${getMessage('exportMode')}</legend>\
	<input type=\"radio\" id=\"${id}_excelExport_wysiwyg\" name=\"${id}_excelExport_mode\" style=\"border:0px;\" value=\""+SweetDevRia.Grid.WYSIWYG_EXPORT+"\"/><label for=\"${id}_excelExport_wysiwyg\">${getMessage('wysiwygMode')}</label><br/>\
	<input type=\"radio\" id=\"${id}_excelExport_model\" name=\"${id}_excelExport_mode\" style=\"border:0px;\" value=\""+SweetDevRia.Grid.MODEL_EXPORT+"\"/><label for=\"${id}_excelExport_model\">${getMessage('modelMode')}</label><br/>\
</fieldset>\
{if displayCheckbox}\
<fieldset style=\"margin:5px\" class=\"ideo-ndg-winFieldSet\"><legend>${getMessage('rowExportMode')}</legend>\
	<input type=\"checkbox\" id=\"${id}_excelExport_check\" checked style=\"border:0px;\"/><label for=\"${id}_excelExport_check\">${getMessage('exportOnlyChecked')}</label><br/>\
</fieldset>\
{/if}\
<center>\
	<button onclick=\"SweetDevRia.$('${id}').callExcelExport();event.cancelBubble = true;\" class=\"ideo-exp-validateButton\">${getMessage('excelExport')}</button>\
	<button onclick=\"SweetDevRia.$('${excelPropertiesWindowId}').close(); event.cancelBubble = true;\" class=\"ideo-exp-cancelButton\">${getMessage('cancel')}</button>\
</center>\
";


SweetDevRia.Grid.prototype.templateSortProperties = 
"\
{for i in sortPropertiesDeep}\
	<fieldset style=\"margin:5px\" class=\"ideo-ndg-winFieldSet\">\
	{if i == 0}\
		<legend><b><font size=\"+2\">${getMessage('sortBy')}</font></b></legend>\
	{else}\
		<legend><b><font size=\"+1\">${getMessage('sortAndBy')}</font></b></legend>\
	{/if}\
	<select id=\"${id}_sort${i}\" size=\"1\">\
	</select>\
	<input type=\"radio\" id=\"${id}_sort${i}_asc\" name=\"${id}_sort${i}_order\" value=\"ascendant\" style=\"border:0px;\"></input><label for=\"${id}_sort${i}_asc\">${getMessage('ascendant')}</label>\
	<input type=\"radio\" id=\"${id}_sort${i}_dsc\" name=\"${id}_sort${i}_order\" value=\"descendant\" style=\"border:0px;\"></input><label for=\"${id}_sort${i}_dsc\">${getMessage('descendant')}</label>\
	</fieldset>\
{/for}\
<br/>\
<center>\
	<button onclick=\"SweetDevRia.$('${id}').callMultipleColumnSort();event.cancelBubble = true;\" class=\"ideo-exp-validateButton\">${getMessage('sort')}</button>\
	<button onclick=\"SweetDevRia.$('${sortPropertiesWindowId}').close();event.cancelBubble = true;\" class=\"ideo-exp-cancelButton\">${getMessage('cancel')}</button>\
</center>\
";


SweetDevRia.Grid.prototype.template = 
"<div id=\"${id}\" class=\"ideo-ndg-table\" style=\"width : ${width}px;\">\
    <div class=\"ideo-ndg-divHeader\" id=\"${id}_headDiv\" >\
        <div id=\"${ddArrowId}\" class=\"ideo-ndg-arrow\"></div>\
        <table id=\"${id}_headTable\"  class=\"ideo-ndg-head\" cellpadding=\"0px\" cellspacing=\"0px\" >\
            <tbody id=\"${theadId}\">\
				<col id=\"${id}_head_spliter_first\" style=\"width:0px;\">\
				{if displayCheckbox == true}\
					<col id=\"${id}_head_col_checkbox\" style=\"width:${checkboxColWidth}px;\" >\
					<col id=\"${id}_head_spliter_checkbox\" style=\"\">\
				{/if}\
				{var cpt = 0;}\
				{for col in columns}\
					{var column = getColumnAtPosition(''+cpt)}\
					<col id=\"${id}_head_col_${column.position}\" style=\"{if column.visible==false} visibility:collapse;width:0px;{/if}\" >\
					{if column != getLastColumn()}\
						<col id=\"${id}_head_spliter_${column.position}\" style=\"{if column.visible==false} visibility:collapse;width:0px;{/if}\">\
					{/if}\
					{var cpt = cpt + 1;}\
 				{/for}\
	           <tr style=\"white-space: nowrap;\">\
                <td id=\"${spliterPrefix}start\" class=\"ideo-ndg-headSeparator\" style=\"width:0px;{if heightHeader!==null}height : ${heightHeader}px;{/if}\">&nbsp;</td>\
				{if displayCheckbox == true}\
                    <td id=\"${headPrefix}checkbox\" class=\"ideo-ndg-header\" {if heightHeader!==null}style=\"height : ${heightHeader}px\"{/if}><input type=\"checkbox\" id=\"${id}_col_checkboxAll\" onclick=\"SweetDevRia.$('${id}').setCheckboxAll(this.checked);\"/></td>\
                   <td id=\"${spliterPrefix}checkbox\" class=\"ideo-ndg-headSeparator\" {if heightHeader!==null}style=\"height : ${heightHeader}px\"{/if}>&nbsp;</td>\
				{/if}\
				{var cpt = 0;}\
				{for col in columns}\
					{var column = getColumnAtPosition(''+cpt)}\
                    <td id=\"${headPrefix}${column.id}\" class=\"ideo-ndg-header\" {if heightHeader!==null}style=\"height : ${heightHeader}px\"{/if}><nobr>${column.header}\
						<div id=\"${headPrefix}${column.id}_sort\" class=\"ideo-ndg-headerSort {if column.ascendant == true} ideo-ndg-headerSortAsc{/if} {if column.ascendant == false} ideo-ndg-headerSortDesc{/if}\" >&nbsp;&nbsp;&nbsp; </div>  </nobr></td>\
					{if column != getLastColumn()}\
	                   <td id=\"${spliterPrefix}${column.id}\" class=\"ideo-ndg-headSeparator\" {if heightHeader!==null}style=\"height : ${heightHeader}px\"{/if}>&nbsp;</td>\
					{/if}\
					{var cpt = cpt + 1;}\
 				{/for}\
                </tr>\
            </tbody>\
        </table>\
     </div>\
    <div class=\"ideo-ndg-divBody\" id=\"${id}_bodyDiv\"   onscroll=\"SweetDevRia.$('${id}').synchronizeHeader()\" {if height!==null}style=\"height : ${height}px\"{/if}>\
		${getDataStr()}\
    </div>\
  	<div id=\"${pageBarId}_container\" style=\"display:{if pageNumber > 1}block{else}none{/if};\"\ class=\"ideo-pgb-pagebar\">&nbsp;</div>\
	{if resizable}\
	 <div id=\"${resizerId}\" class=\"ideo-ndg-resizer\">&nbsp;</div>\
	{/if}\
    <div id=\"${id}Menu_container\" >&nbsp;</div>\
    <div id=\"${sortPropertiesWindowId}_container\" style=\"display:none\">&nbsp;</div>\
    <div id=\"${excelPropertiesWindowId}_container\"  style=\"display:none\">&nbsp;</div>\
</div>\
\
";


SweetDevRia.Grid.prototype.templateData = 
"\
    <table id=\"${id}_bodyTable\" class=\"ideo-ndg-body\" cellpadding=\"0px\" cellspacing=\"0px\">\
		<col id=\"${id}_head_spliter_first\" style=\"width:0px;\">\
	{if displayCheckbox == true}\
		<col id=\"${id}_col_checkbox\" style=\"width:${checkboxColWidth}px;\" >\
		<col id=\"${id}_spliter_checkbox\" style=\"\">\
	{/if}\
	{var cpt = 0;}\
	{for col in columns}\
		{var column = getColumnAtPosition(''+cpt)}\
		<col id=\"${id}_col_${cpt}\"  style=\"{if column.visible==false} visibility:collapse;width:0px;{/if}\">\
		{if column != getLastColumn()}\
			<col id=\"${id}_spliter_${cpt}\" style=\"{if column.visible==false || column == getLastVisibleColumn()} visibility:collapse;width:0px;{/if}\">\
		{/if}\
		{var cpt = cpt + 1;}\
	{/for}\
    <tbody id=\"${tbodyId}\">\
	{for row in data}\
		{var rowId = row[0]}\
		{if row_index >= getFirstVisibleIndex() && row_index <= getLastVisibleIndex()}\
    	    <tr id=\"${id}_tr_${rowId}\" class=\"${(row_index%2 == 0)?\"ideo-ndg-parRow\":\"ideo-ndg-oddRow\"}\" {if heightRow!==null}style=\"height : ${heightRow}px;overflow : hidden;\"{/if}>\
		    <td id=\"${id}_cell_spliter_${rowId}\" class=\"ideo-ndg-bodySeparator\" style=\"width:0px;\"></td>\
			{if displayCheckbox == true}\
                <td><input type=\"checkbox\" id=\"${id}_col_${rowId}_checkbox\" onclick=\"SweetDevRia.$('${id}').onCheckRow('${rowId}', this.checked);SweetDevRia.$('${id}').setCheckbox('${rowId}', this.checked);\"/></td>\
	            <td class=\"ideo-ndg-bodySeparator\"></td>\
			{/if}\
			{for cell in row}\
				{var columnId = getColumnIdAtPosition(''+(parseInt(cell_index, 10)-1))}\
				{if cell_index > 0}\
	 				{if cell_index!=(row.length-1)}\
	                    <td id=\"${id}_cell_${rowId}_${columnId}\" onclick=\"SweetDevRia.$('${id}').onSelectCell (event, '${rowId}', '${columnId}');\"   >\
								{if rowWrap == false}<nobr>{/if}${getCellValue (getColumnAtPosition(''+(parseInt(cell_index, 10)-1)).initialPosition, row_index)}{if rowWrap == false}</nobr>{/if}\
	                    </td>\
						{if cell_index!=(row.length-2)}\
		                    <td id=\"${id}_cell_spliter_${rowId}_${columnId}\" class=\"ideo-ndg-bodySeparator\"></td>\
						{/if}\
					{else}\
	                	</tr>\
						<tr class=\"ideo-ndg-detail ${(row_index%2 == 0)?\"ideo-ndg-parRow\":\"ideo-ndg-oddRow\"}\">\
							<td colspan=\"{if displayCheckbox == true} ${(((row.length-2) * 2)+2)} {else}${(((row.length-2) * 2))}{/if}\"  >\
							{if cell!=null}\
								<a href=\"#\" onclick=\"swapVisibility(document.getElementById('${id}_detail_${rowId}')); return false;\">${getMessage('detailLinkLabel')}</a>\
								<div id=\"${id}_detail_${rowId}\" style=\"display:none;\">\
								${cell}\
								</div>\
							{/if}\
						</td>\
						</tr>\
					{/if}\
				{/if}\
			{/for}\
		{/if}\
	{/for}\
	</tbody>\
    </table>\
";


