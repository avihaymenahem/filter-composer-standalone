import * as _ from 'lodash';
import { UrlPatternTypes } from './FilterConfiguration.consts';

export const createUrlFilter = (type = 'location', value = '', patternType = UrlPatternTypes.URL_TYPE_STARTS_WITH.value) => ({
    type,
    "values": [{
        value,
        patternType,
        "type": "resource",
        "ignoreQueryString": true
    }]
});

export const emptyEvent = () => ({ value: null });

export const stringToUrlSuggestionFilter = (text) => ({
    type: "AND",
    "values": [{
        "values": [{
            "value": "http",
            "type": "scheme"
        }, {
            "value": text,
            "type": "resource",
            "patternType": "containing",
            "ignoreQueryString": true
        }],
        "type": "location"
    }]
});

// recursively gets all the 'location' objects in the filter object tree
export const getInnerFilterObjects = (item, key, value, holderArr) => {
    if (!holderArr) holderArr = [];

    if (item instanceof Array) {
        item.forEach(subItem => {
            holderArr.concat(getInnerFilterObjects(subItem, key, value, holderArr));
        });
    } else if (item instanceof Object) {
        if ('values' in item) {
            if (item[key] === value) holderArr.push(item);
            else holderArr.concat(getInnerFilterObjects(item.values, key, value, holderArr));
            return holderArr;
        }
    }
    return holderArr;
};