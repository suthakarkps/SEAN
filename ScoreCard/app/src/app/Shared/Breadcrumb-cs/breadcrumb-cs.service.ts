
declare var $: any

export class BreadcrumbCSService {  
    private levels: any = [];
    private names: any = {};
    private persistance: any = {};

    addFriendlyNameBreadcrumb(level, name) {        
        this.levels.push(level);       
        this.names[level] = name;               
    }  

    breadcrumbLevel() {       
        if (this.levels.length <= 1)
            $('.InstanceDropdown').show();
        else 
            $('.InstanceDropdown').hide();
        return this.levels;
    }

    breadcrumbName(level) {
        return this.names[level];
    }
    resetBreadcrumb(level) {        
        let currentLevel = this.levels;        
        let levels = currentLevel.slice(0, level+1);
        this.levels = levels;        
    }
}
