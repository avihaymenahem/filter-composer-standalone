
import filterComposer from './filterComposer';
import basicFilter from './basicFilter';
import appIdFilter from './appIDFilter';
import booleanFilter from './booleanFilter';
import csvFilter from './csvFilter';
import numericFilter from './numericFilter';
import percentageFilter from './percentageFilter';
import secondsFilter from './secondsFilter';
import locationFilter from './locationFilter';
import listFilter from './listFilter';
import setFilter from './setFilter';

export default [
    appIdFilter,
    booleanFilter,
    csvFilter,
    listFilter,
    setFilter,
    numericFilter,
    percentageFilter,
    secondsFilter,
    locationFilter,
    filterComposer,
    basicFilter
]
