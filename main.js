$(document).ready(function() {
    Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

        return a;
    };

    var totalMines = 10;
    var gridSize = 9;
    var mine = [];
    var mineIndexes = [];

    mine = makeArray(gridSize, gridSize, null);

    createMines();
    placeMines();

    console.log(mine);

    function makeArray(w, h, val) {
        var arr = [];
        for (i = 0; i < h; i++) {
            arr[i] = [];
            for (j = 0; j < w; j++) {
                arr[i][j] = val;
            }
        }
        return arr;
    }

    function createMines() {

        while (totalMines > 0) {
            var gridNumber = randomNumber(10, 89);

            /* Populate mine locations */
            /* Location should not be power of 10 */
            if (gridNumber % 10 === 0) {
                // do nothing 
            } else if (mineIndexes.indexOf(gridNumber) === -1) {
                mineIndexes.push(gridNumber)
                totalMines -= 1;
                // Do logics here
            }
        }
        window.mineIndexes = mineIndexes;
    }

    function randomNumber(low, high) {
        return Math.floor((Math.random() * high) + low);
    }

    /*2D array*/

    function placeMines() {
        for (var i = 0; i < mineIndexes.length; i++) {
            var grid = mineIndexes[i].toString();
            //console.log(grid);

            var x = parseInt(grid.substring(0, 1)) - 1;
            var y = parseInt(grid.substring(1, 2)) - 1;
            /*console.log("x: " + x + "; y: " + y)*/

            mine[x][y] = 'bomb';

            //console.log("x: "+x+"; y: "+y)
        }
    }


    /* Click function */
    /* Extract grid position of dom element on click (and check location) */
    $('.column').click(function() {
        var column = parseInt($(this).attr('class').substring(7,8));
        var row = parseInt($(this).parent().attr('class').substring(4,5));
        /*console.log("row: "+row+"; column:"+column)*/
        checkForBomb(row, column);
    });


    /* Check clicked location for bomb or not*/
    function checkForBomb(row,column) {
    	if (mine[row][column] === "bomb") {
            gameOver(row,column);
    	} else {
    		isSafe(row,column)
    	}
    }


    /* Add classes to dom grid to visualise game */
    /* If bomb add .fail to dom element */
    function addBomb(row,column) {
        $(getRow(row) + ' ' +getColumn(column)).addClass('fail');
    }
    /* If safe add .safe class to dom element */
    function addSafe(row, column, proximity) {
        $(getRow(row) + ' ' +getColumn(column)).addClass('safe');
        if (proximity != null) {
            $(getRow(row) + ' ' +getColumn(column)).html('<p>'+proximity+'</p>');
        }
    }


    /* Return String for location to select the divs in the dom*/
    /* Return row location */
    function getRow(row) {
        return ".row-"+row;
    }
    /* Return column location*/
    function getColumn(column) {
        return ".column-"+column;
    }


    /* If clicked on a bomb, reveal all bombs */
    /* Cycle through array and tag safe and bomb locations*/
    function gameOver(row,column) {
        for (var i = mine.length - 1; i >= 0; i--) {
            for (var j = mine[i].length - 1; j >= 0; j--) {
                if (mine[i][j] === "bomb") {
                    addBomb(i,j);
                } else {
                    isSafe(i,j);
                }
            };
        };
    }

    function isSafe(row, column) {
        var proximity = bombCount(row, column);
        if (proximity === 0) {
            var fieldsToClear = clearFields(row, column, []);
            fieldsToClear.forEach(function(tile){
                addSafe(tile[0],tile[1])
            })
            debugger
        }
        mine[row][column] = proximity;     
        addSafe(row, column, proximity);
    }

    function neighbours(rowClicked, columnClicked) {
        var neighbours = []
        for (var i = 1; i >= -1; i--) {
            for (var j = 1; j >= -1; j--) {
                console.log[i +" " + j]

                var rowClickedOffset = rowClicked+i;
                var columnClickedOffset = columnClicked+j;
                if ( rowClickedOffset >= 0 && rowClickedOffset <= gridSize-1 ) {
                    if (columnClickedOffset >= 0 && columnClickedOffset <= gridSize-1 ) {
                        if (i === 0 &&  j === 0) {
                            continue;
                        } else {
                            neighbours.push([rowClickedOffset,columnClickedOffset]);
                        }
                    };
                };
                
            };
        };
        return neighbours;
    }

    function bombCount(row, column) {
        
        row = parseInt(row);
        column = parseInt(column);
        var closest = neighbours(row, column);
        var count = closest.reduce(function(bomb, coordinates){
            var row = coordinates[0]
            var column = coordinates[1]
            if (mine[row][column] === "bomb") {
                return bomb += 1;
            } else {
                return bomb;
            };
        }, 0)
        
        return count;
    }

    

    function clearFields(row, column, workqueue) {
        var initialItem = [row, column];
         /*toReveal = [initialItem],*/
        if (workqueue.length === 0) {
            workqueue.push(initialItem);
        }

        if (bombCount(initialItem[0], initialItem[1]) === 0){
            var tileNeighbours = neighbours(initialItem[0], initialItem[1]);
            var tempArray = [];
            tileNeighbours.forEach(function(tile) {
                var any = workqueue.some(function(t) {
                    return t[0] === tile[0] && t[1] === tile[1]
                });

                if(!any) {
                    tempArray.push(tile);
                    workqueue.push(tile);
                }
            });

            tempArray.forEach(function(tile) {
                clearFields(tile[0], tile[1], workqueue);
            })
        };

        return workqueue;

        

        /*while(workQueue.length){
            var tile = workQueue.pop();
            if(bombCount(tile[0], tile[1]) === 0){
                var tileNeighbours = neighbours(tile[0], tile[1]);
                workQueue = workQueue.concat(tileNeighbours);
                toReveal = toReveal.concat(tileNeighbours);
            }
            
            for (var i = workQueue.length - 1; i >= 0; i--) {
                
                console.log("toReveal " + toReveal)
                console.log("workQueue " + workQueue)

                if (workQueue[i].indexOf(toReveal)){
                    console.log(workQueue[i] + 'duplicate with' + toReveal)
                    workQueue[i].pop();

                }
            };
            
        }*/

        /*for (var i = toReveal.length - 1; i >= 0; i--) {
            toReveal[i]
        };*/
        debugger
    }

   
    window.mineArray = mine;
});
