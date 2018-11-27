import filterComposer from './filterComposer';
import basicFilter from './basicFilter';

import booleanFilter from './booleanFilter';
import csvFilter from './csvFilter';
import numericFilter from './numericFilter';
import percentageFilter from './percentageFilter';
import secondsFilter from './secondsFilter';
import locationFilter from './locationFilter';


export default [
    booleanFilter,
    csvFilter,
    numericFilter,
    percentageFilter,
    secondsFilter,
    locationFilter,
    filterComposer,
    basicFilter
]
