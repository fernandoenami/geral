var Datafeeds = {};


Datafeeds.JSApiCompatibleDataFeed = function(symbolInfo) {
    this._configuration = this.defaultConfiguration();

    this._symbolInfo = symbolInfo;
	this._protocolVersion = 2;

	this._enableLogging = true;
	this._initializationFinished = false;
	this._callbacks = {};
	this._bar = new Bar();
	
},
Datafeeds.JSApiCompatibleDataFeed.prototype.onReady = function(callback) {
	var that = this;
	if (this._configuration) {
		setTimeout(function() {
			callback(that._configuration);
		}, 0);
	} else {
		this.on('configuration_ready', function() {
			callback(that._configuration);
		});
	}
};
Datafeeds.JSApiCompatibleDataFeed.prototype.resolveSymbol = function(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {

	var that = this;

	var resolveRequestStartTime = Date.now();
	that._logMessage('Resolve requested');

	function onResultReady(data) {
		var postProcessedData = data;
		if (that.postProcessSymbolInfo) {
			postProcessedData = that.postProcessSymbolInfo(postProcessedData);
		}

		that._logMessage('Symbol resolved: ' + (Date.now() - resolveRequestStartTime));

		onSymbolResolvedCallback(postProcessedData);
	}


	//var data = JSON.parse('{"name":"AA","exchange-traded":"NYSE","exchange-listed":"NYSE","timezone":"America/New_York","minmov":1,"minmov2":0,"pricescale":10,"pointvalue":1,"session":"0930-1630","has_intraday":false,"has_no_volume":false,"ticker":"AA","description":"Alcoa Inc.","type":"stock","supported_resolutions":["D","2D","3D","W","3W","M","6M"]}');
	//var data = JSON.parse('{"s":"ok"}');
	var data = that._symbolInfo;
	//if (data.s && data.s != 'ok') {
	//	onResolveErrorCallback('unknown_symbol');
	//} else {
		onResultReady(data);
	//}


};
Datafeeds.JSApiCompatibleDataFeed.prototype.getBars = function(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {

	//	timestamp sample: 1399939200
	if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
		throw ['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate];
	}

	var that = this;

	var requestStartTime = Date.now();

	    //var response = '{"s":"no_data"}';
		//var response = '{"t":[1475452800,1475539200,1475625600,1475712000,1475798400,1476057600,1476144000,1476230400],"c":[10.11999,10.199989,10.4,31.780001,31.370001,31.51,27.91,27.110001],"o":[10.139989,10.05999,10.249999,31.07,32.02,31.57,29.73,27.52],"h":[10.159989,10.209989,10.41,32.02,32.099998,31.959999,29.73,27.52],"l":[9.959989,9.989989,10.17,31.07,31.030001,31.370001,27.889999,27.02],"v":[5460900,10663500,29736800,10026500,7858600,9119000,32668200,19056200],"s":"ok"}';
    //var response = '{"t":[0],"c":[0],"o":[0],"h":[0],"l":[0],"v":[0],"s":"ok"}';
    //var data = JSON.parse(response);
    var data = JSON.parse('{"s":"no_data"}');;
		var nodata = data.s == 'no_data';

		if (data.s != 'ok' && !nodata) {
			if (!!onErrorCallback) {
				onErrorCallback(data.s);
			}

			return;
		}

		var bars = [];

		//	data is JSON having format {s: "status" (ok, no_data, error),
		//  v: [volumes], t: [times], o: [opens], h: [highs], l: [lows], c:[closes], nb: "optional_unixtime_if_no_data"}
		var barsCount = nodata ? 0 : data.t.length;

		var volumePresent = typeof data.v != 'undefined';
		var ohlPresent = typeof data.o != 'undefined';

		for (var i = 0; i < barsCount; ++i) {

			var barValue = {
				time: data.t[i] * 1000,
				close: data.c[i]
			};

			if (ohlPresent) {
				barValue.open = data.o[i];
				barValue.high = data.h[i];
				barValue.low = data.l[i];
			} else {
				barValue.open = barValue.high = barValue.low = barValue.close;
			}

			if (volumePresent) {
				barValue.volume = data.v[i];
			}

			bars.push(barValue);
		}

		onDataCallback(bars, {version: that._protocolVersion, noData: nodata, nextTime: data.nb || data.nextTime});
	// })
	// .fail(function (arg) {
	// 	console.warn(['getBars(): HTTP error', arg]);

	// 	if (!!onErrorCallback) {
	// 		onErrorCallback('network error: ' + JSON.stringify(arg));
	// 	}
	// });
};
Datafeeds.JSApiCompatibleDataFeed.prototype.subscribeBars = function(symbolInfo, resolution, onRealtimeCallback, listenerGUID, bar) {
    this._bar.addCallback(onRealtimeCallback);

};
Datafeeds.JSApiCompatibleDataFeed.prototype.unsubscribeBars = function(listenerGUID) {
    // this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
};
Datafeeds.JSApiCompatibleDataFeed.prototype.getServerTime = function(callback) {
			callback(+1476320489);
};
Datafeeds.JSApiCompatibleDataFeed.prototype.defaultConfiguration = function() {
	return {
		supports_search: true,
		supports_group_request: false,
	    //supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
		supported_resolutions: ['1', '1D', '2D'],
		supports_marks: false,
		supports_timescale_marks: false
	};
};

Datafeeds.JSApiCompatibleDataFeed.prototype._logMessage = function(message) {
	if (this._enableLogging) {
		var now = new Date();
		console.log(now.toLocaleTimeString() + '.' + now.getMilliseconds() + '> ' + message);
	}
};

Bar = function()
{
    this.listeners = [];
},
Bar.prototype.addCallback = function (_callback)
{
        this.listeners.push(_callback);
},
Bar.prototype.addData = function (data){
        for (var i = 0; i < this.listeners.length; i++)
        {
            this.listeners[i](data);
        }
}
