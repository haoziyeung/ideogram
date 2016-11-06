/**
 * @public
 * @class
 * @param {Object} config
 * @param {Ideogram} ideo
 */
function HorizontalLayout(config, ideo) {
    /*
     * 
     */
    Layout.call(this, config, ideo);
    /**
     * @private
     * @member {String}
     */
    this._class = 'HorizontalLayout';
    /**
     * Layout margins.
     * @private
     * @member {Object}
     */
    this._margin = {
        left : 35,
        top : 30
    };
}


HorizontalLayout.prototype = Object.create(Layout.prototype);


/**
 * @override
 */
HorizontalLayout.prototype.rotateForward = function(setNumber, chrNumber, chrElement, callback) {

    var xOffset = 20;

    var ideoBox = d3.select("#_ideogram").node().getBoundingClientRect();
    var chrBox = chrElement.getBoundingClientRect();

    var scaleX = (ideoBox.height / (chrBox.width + xOffset / 2)) * 0.97;
    var scaleY = this._getYScale();

    var yOffset = (chrNumber + 1) * ((this._config.chrWidth * 2) * scaleY);

    var transform = 'rotate(90) translate(' + xOffset + ', -' + yOffset + ') scale(' + scaleX + ', ' + scaleY + ')';

    d3.select(chrElement.parentNode)
        .transition()
        .attr("transform", transform)
        .on('end', callback);
};


/**
 * @override
 */
HorizontalLayout.prototype.rotateBack = function(setNumber, chrNumber, chrElement, callback) {

    var translate = this.getChromosomeSetTranslate(setNumber);

    d3.select(chrElement.parentNode)
        .transition()
        .attr("transform", translate)
        .on('end', callback);
};


/**
 * @override
 */
HorizontalLayout.prototype.getHeight = function(taxId) {
    /*
     * Get last chromosome set offset.
     */
    var lastSetOffset = this.getChromosomeSetYTranslate(this._config.chromosomes[taxId].length - 1);
    /*
     * Get last chromosome set size.
     */
    var lastSetSize = this._getChromosomeSetSize(this._config.chromosomes[taxId].length - 1);
    /*
     * Increase offset by last chromosome set size.
     */
    lastSetOffset += lastSetSize;

    return lastSetOffset + this._getAdditionalOffset() * 2;
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeSetLabelAnchor = function() {

    return 'end';
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeBandLabelAnchor = function(chrNumber) {

    return null;
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeBandTickY1 = function(chrNumber) {

    return 2;
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeBandTickY2 = function(chrNumber) {

    return 10;
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeBandLabelTranslate = function(band) {

    var x = this._ideo.round(- this._tickSize + band.px.start + band.px.width / 2);
    var y = -10;

    return {
        x : x,
        y : y,
        translate : 'translate(' + x + ',' + y + ')'
    };
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeSetLabelTranslate = function() {

    return null;
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeSetTranslate = function(setNumber) {

    return "translate(" + this._margin.left + ", " + this.getChromosomeSetYTranslate(setNumber) + ")";
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeSetYTranslate = function(setNumber) {
    /*
     * If no detailed description provided just use one formula for all cases.
     */
    if (! this._config.ploidyDesc) {
        return this._config.chrMargin * (setNumber + 1);
    }
    /*
     * Id detailed description provided start to calculate offsets
     * for each chromosome set separately. This should be done only once.
     */
    if (! this._translate) {
        /*
         * First offset equals to zero.
         */
        this._translate = [1];
        /*
         * Loop through description set.
         */
        for (var i = 1; i < this._config.ploidyDesc.length; i ++) {
            this._translate[i] = this._translate[i - 1] + this._getChromosomeSetSize(i - 1);
        };
    }

    return this._translate[setNumber];
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeSetLabelXPosition = function(i) {

    if (this._config.ploidy === 1) {
        return this.getChromosomeLabelXPosition(i);
    } else {
        return -20;
    }
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeSetLabelYPosition = function(i) {

    if (this._config.ploidy === 1) {
        return (this._description.getSetSize(i) * this._config.chrWidth) / 2 + 3;
    } else {
        return this._description.getSetSize(i) * this._config.chrWidth;
    }
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeLabelXPosition = function(i) {

    return -8;
};


/**
 * @override
 */
HorizontalLayout.prototype.getChromosomeLabelYPosition = function(i) {

    return this._config.chrWidth;
};