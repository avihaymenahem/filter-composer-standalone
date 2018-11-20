export default class CtTagsController {
    constructor($scope, $element) {
        this.scope = $scope;
        this.element = $element;
        
        const self = this;
        this.optionsLoaded = false;
        
        const unwatchOptions = this.scope.$watch('options', (newOptions) => {
            if (!self.optionsLoaded && !self.options && newOptions) {
                self.optionsLoaded = true; 
                if (!newOptions.length) {
                    self.canShowNoResults = true;
                }     
                unwatchOptions();
            }
        });
        
        this.onSearchDebounce = _.debounce(self.onSearchBounce, 1000, { trailing: true });
    }
    
    onOpenClose(isOpen){
        if(!isOpen) {
            this.canShowNoResults = false;
        }
    }

    onSelect(item, $select) {
        $select.activeIndex = -1;
        this.scope.onSelect({ item });        
        this.canShowNoResults = !$select.items || $select.items && $select.items.length;
    }
    
    onRemove(item, $select) {
        $select.activeIndex = -1;
        this.scope.onRemove({ item });
    }

    onSearch(term, $select) {
        $select.activeIndex = -1;

        if (this.scope.useLocalFilter || !$select.open) {
            return;
        }

        if (!this.didRefreshOnce) {
            this.didRefreshOnce = true;
            return;
        }

        this.canShowNoResults = false;
        this.scope.isSearching = true;
	    this.scope.options = [];

        return this.onSearchDebounce(term, $select);
    }
    
    onSearchBounce(term, $select) {
        const self = this;
        
        return this.scope.doSearch({ term })
        .then(() => { 
            $select.activeIndex = -1; 
        })
        .finally(() => { 
            self.canShowNoResults = true; 
            setTimeout(() => {
                $select.$element.querySelectorAll('ul.ui-select-choices')[0].scrollTop = 0;            
            });
        });
    }    
    
    // We don't want the local filter to fire
    // in case the filter is in the server side
    getLocalFilter(searchString) {
        if (!this.scope.useLocalFilter) {
            return;
        }

        const self = this;
        return (item) => searchString ?
         !!(~item.value.toLowerCase().indexOf(searchString.toLowerCase())) : 
         true            
    }
    
    encodeHTMLEntities(str) {
        return str.replace(/[\u00A0-\u9999<>\&]/gim, (i) => {
            return '&#'+i.charCodeAt(0)+';';
        });
    }

    $postLink() {
        const self = this;
        setTimeout(function testDOM () {
            if (self.element.children().length) {
                self.scope.$emit('tagsPostLink')
            } else {
                setTimeout(testDOM, 100);
            }
        }, 100);        
    }
}

