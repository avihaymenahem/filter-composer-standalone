import singleSpaAngularJS from 'single-spa-angularjs';
import angular from 'angular';
import './app';

export const testParcel = singleSpaAngularJS({
    angular,
    domElementGetter: () => document.getElementById("parcel"),
    mainAngularModule: 'CT',
    template: "<filter-composer></filter-composer>"
});

export const bootstrap = [
    testParcel.bootstrap
];

export const mount = [
    testParcel.mount
];

export const unmount = [
    testParcel.unmount
];