import {Pipe, PipeTransform, Injectable} from '@angular/core';

@Pipe({
    name: 'dropdownSearchFilter'    
})

@Injectable()
export class DropdownSearchFilterPipe implements PipeTransform {   
    transform(dropdownOptions: any, searchkey: any, displayname:any): any {        
        searchkey = searchkey.toLowerCase();        
        return dropdownOptions.filter(option => option[displayname].toLowerCase().indexOf(searchkey) !== -1);                
    }
}