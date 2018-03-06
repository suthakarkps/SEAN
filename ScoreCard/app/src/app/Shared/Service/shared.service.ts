import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SharedService {   
    noDataAvailable: string = 'No Data Available';
    serverErrorMsg = 'Error loading widget';
    gridHeights = { 'grid-lg': 470, 'grid-lg-filter': 400 };
    public   practiceId: any;
    public providerId: any;
    public rowCount: any = '1000'; 
    varNamesValues = [];
    resetFilter = false;
    visibleColumns = [];
    GridData = []; 
    D3Data = {};

    /**/
    varSelectedColumns = [];
    varSelectedFilters = [];
    varMetricsValues = [];
    varSelectFilters = [];
      selectedMetricsObj = {};
    /**/
    
       
    getValue() {
        return this.noDataAvailable;
     }
    getGridValue() {
        return this.gridHeights; 
    }


    /*code for get and set the var names & its values */
      
        setNameValue(setName: string, setValue: any) {  

        if (this.varNamesValues.length > 0) {
            for (var j = 0; j < this.varNamesValues.length; j++) {

                       if (this.varNamesValues[j].name == setName) {
                           this.varNamesValues[j].value = setValue;
                       }
                       else {
                           this.varNamesValues.push({
                               name: setName,
                               value: setValue
                           })      
                       }
            }
            

        }
        else {
                             this.varNamesValues.push({
                    name: setName,
                    value: setValue
                })      
        }

      
       
     }

        getNameValue(getName: string) {

            function remove_duplicates(objectsArray) {
                var usedObjects = {};
                for (var i = objectsArray.length - 1; i >= 0; i--) {
                    var so = JSON.stringify(objectsArray[i]);
                    if (usedObjects[so]) {
                        objectsArray.splice(i, 1);
                    } else {
                        usedObjects[so] = true;
                    }
                }
                return objectsArray;
            }
                     this.varNamesValues = remove_duplicates(this.varNamesValues);          
                  

         
        for (var i = 0; i < this.varNamesValues.length; i++) {
            if (this.varNamesValues[i].name == getName) {
            return    this.varNamesValues[i].value
            }
        }
                   
     }
        
     /**/

    getServerError() { 
        return this.serverErrorMsg;
        }    





    /*----------------------------------------------------Code for Query Builder-------------------------------------------------*/

    
 

    setMetricsColumnsValues(data) {             
        this.varMetricsValues.push(data)       
    }
    getMetricsColumnsValues() {
        return this.varMetricsValues;
    }

    /**/

  

    /*COMPONENT*/

    setSelectedColumns(obj, flag) { 

        this.varSelectedColumns.push(obj);
   
    }
    getSelectedColumns() { return this.varSelectedColumns }


    /*FILTERS*/
    setSelectedFilters(array) {      
        this.varSelectedFilters = array;               
    }
    getSelectedFilters() { return this.varSelectedFilters }


    /*COMP AND FILTERS FOR GRID*/
     
    getSelectedComponentFitlers() {
     let  finalObj = {};

     finalObj = {

         'Components': this.varSelectedColumns,
         'Filters': this.varSelectedFilters

     }
     return finalObj;
    }

    /*code for storing obj from metrics selection*/

    setSelectedMetrics(metricsObj) {
        this.selectedMetricsObj = metricsObj;   
     
             
    }
    getSelectedMetrics() { return this.selectedMetricsObj; }



    removeDuplicates(objectsArray) {
        
    let usedObjects = {};
    for (let i = objectsArray.length - 1; i >= 0; i--) {
        let  so = JSON.stringify(objectsArray[i]);
        if (usedObjects[so]) {
            objectsArray.splice(i, 1);
        } else {
            usedObjects[so] = true;
        }
    } 
    return objectsArray;
    }
      // 
        // check for key value exits in array of objects
    filterIDExits(filterArray, filterID) {
        return filterArray.some(function (el) {
            return el.FilterID === filterID;
        });
    }

//update row count    
    setrowcount(newValue) { this.rowCount = newValue;}
    getrowcount() { return this.rowCount; }

    //reset filter    
    setresetFilter(newValue) { this.resetFilter = newValue; }
    getresetFilter() { return this.resetFilter; } 

    //visibleColumns
    setvisibleColumns(array) { this.visibleColumns = array; }
    getvisibleColumns() { return this.visibleColumns; }  

    
    setGridData(arr) {
       // console.log(arr)
    this.GridData = arr;    
    }
    getGridData() {
        //console.log(this.GridData);
        return this.GridData;
    } 
    setD3Data(obj) {
      //  console.log(obj);
        this.D3Data = obj;
    }
    getD3Data() {
       // console.log(this.D3Data);
        return this.D3Data;
    }  
    
}

