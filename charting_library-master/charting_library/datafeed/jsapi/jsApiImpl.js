'use strict';
var Datafeeds = {};

Datafeeds.JSApiCompatibleDataFeed = function() {

	//this._datafeedURL = datafeedURL;
	this._configuration = this.siteConfiguration();

	this._symbolSearch = null;
	this._symbolsStorage = null;
	//this._barsPulseUpdater = new Datafeeds.DataPulseUpdater(this, updateFrequency || 10 * 1000);
	//this._quotesPulseUpdater = new Datafeeds.QuotesPulseUpdater(this);
	this._protocolVersion = 2;

	this._enableLogging = false;
	this._initializationFinished = false;
	this._callbacks = {};

	//this._initialize();
};

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

//	===============================================================================================================================
//	The functions set below is the implementation of JavaScript API.

Datafeeds.JSApiCompatibleDataFeed.prototype.getMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
	if (this._configuration.supports_marks) {
		// this._send(this._datafeedURL + '/marks', {
		// 		symbol: symbolInfo.ticker.toUpperCase(),
		// 		from: rangeStart,
		// 		to: rangeEnd,
		// 		resolution: resolution
		// 	})
		// 	.done(function (response) {
			var response = '{"id":[0,1,2,3,4,5],"time":[1476489600,1476144000,1475884800,1475884800,1475193600,1473897600],"color":["red","blue","green","red","blue","green"],"text":["Today","4 days back","7 days back + Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","7 days back once again","15 days back","30 days back"],"label":["A","B","CORE","D","EURO","F"],"labelFontColor":["white","white","red","#FFFFFF","white","#000"],"minSize":[14,28,7,40,7,14]}';
				onDataCallback(JSON.parse(response));
			// })
			// .fail(function() {
			// 	onDataCallback([]);
			// });
	}
};

Datafeeds.JSApiCompatibleDataFeed.prototype.getTimescaleMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
	if (this._configuration.supports_timescale_marks) {
		// this._send(this._datafeedURL + '/timescale_marks', {
		// 	symbol: symbolInfo.ticker.toUpperCase(),
		// 	from: rangeStart,
		// 	to: rangeEnd,
		// 	resolution: resolution
		// })
		// 	.done(function (response) {
			var response = '[{"id":"tsm1","time":1476489600,"color":"red","label":"A","tooltip":""},{"id":"tsm2","time":1476144000,"color":"blue","label":"D","tooltip":["Dividends: $0.56","Date: Tue Oct 11 2016"]},{"id":"tsm3","time":1475884800,"color":"green","label":"D","tooltip":["Dividends: $3.46","Date: Sat Oct 08 2016"]},{"id":"tsm4","time":1475193600,"color":"#999999","label":"E","tooltip":["Earnings: $3.44","Estimate: $3.60"]},{"id":"tsm7","time":1473897600,"color":"red","label":"E","tooltip":["Earnings: $5.40","Estimate: $5.00"]}]';
				onDataCallback(JSON.parse(response));
			// })
			// .fail(function() {
			// 	onDataCallback([]);
			// });
	}
};

Datafeeds.JSApiCompatibleDataFeed.prototype.searchSymbols = function(searchString, exchange, type, onResultReadyCallback) {
	var MAX_SEARCH_RESULTS = 30;
	if (!this._configuration) {
		onResultReadyCallback([]);
		return;
	}

	if (this._configuration.supports_search) {

		// this._send(this._datafeedURL + '/search', {
		// 		limit: MAX_SEARCH_RESULTS,
		// 		query: searchString.toUpperCase(),
		// 		type: type,
		// 		exchange: exchange
		// 	})
		// 	.done(function (response) {
			var response = '[{"symbol":"AA","full_name":"AA","description":"Alcoa Inc.","exchange":"NYSE","type":"stock"},{"symbol":"AAL","full_name":"AAL","description":"American Airlines Group Inc.","exchange":"NasdaqNM","type":"stock"},{"symbol":"AAPL","full_name":"AAPL","description":"Apple Inc.","exchange":"NasdaqNM","type":"stock"}]';
				var data = JSON.parse(response);

				for (var i = 0; i < data.length; ++i) {
					if (!data[i].params) {
						data[i].params = [];
					}
				}

				if (typeof data.s == 'undefined' || data.s != 'error') {
					onResultReadyCallback(data);
				} else {
					onResultReadyCallback([]);
				}

	// 		})
	// 		.fail(function(reason) {
	// 			onResultReadyCallback([]);
	// 		});
	// } else {

		if (!this._symbolSearch) {
			throw 'Datafeed error: inconsistent configuration (symbol search)';
		}

		var searchArgument = {
			searchString: searchString,
			exchange: exchange,
			type: type,
			onResultReadyCallback: onResultReadyCallback
		};

		if (this._initializationFinished) {
			this._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
		} else {

			var that = this;

			this.on('initialized', function() {
				that._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
			});
		}
	}
};

Datafeeds.JSApiCompatibleDataFeed.prototype._symbolResolveURL = '/symbols';

//	BEWARE: this function does not consider symbol's exchange
Datafeeds.JSApiCompatibleDataFeed.prototype.resolveSymbol = function(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {

	var that = this;

	// if (!this._initializationFinished) {
	// 	this.on('initialized', function() {
	// 		that.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
	// 	});

	// 	return;
	// }

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

	if (!this._configuration.supports_group_request) {
		// this._send(this._datafeedURL + this._symbolResolveURL, {
		// 		symbol: symbolName ? symbolName.toUpperCase() : ''
		// 	})
		// 	.done(function (response) {
				var data = JSON.parse('{"name":"AA","exchange-traded":"NYSE","exchange-listed":"NYSE","timezone":"America/New_York","minmov":1,"minmov2":0,"pricescale":10,"pointvalue":1,"session":"0930-1630","has_intraday":false,"has_no_volume":false,"ticker":"AA","description":"Alcoa Inc.","type":"stock","supported_resolutions":["D","2D","3D","W","3W","M","6M"]}');

				if (data.s && data.s != 'ok') {
					onResolveErrorCallback('unknown_symbol');
				} else {
					onResultReady(data);
				}
			// })
			// .fail(function(reason) {
			// 	that._logMessage('Error resolving symbol: ' + JSON.stringify([reason]));
			// 	onResolveErrorCallback('unknown_symbol');
			// });
	} else {
		if (this._initializationFinished) {
			this._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
		} else {
			this.on('initialized', function() {
				that._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
			});
		}
	}
};

Datafeeds.JSApiCompatibleDataFeed.prototype.getBars = function(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {

	//	timestamp sample: 1399939200
	if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
		throw ['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate];
	}

	var that = this;

	var requestStartTime = Date.now();

	// this._send(this._datafeedURL + this._historyURL, {
	// 	symbol: symbolInfo.ticker.toUpperCase(),
	// 	resolution: resolution,
	// 	from: rangeStartDate,
	// 	to: rangeEndDate
	// })
	// .done(function (response) {

		var response = '{"t":[1475452800,1475539200,1475625600,1475712000,1475798400,1476057600,1476144000,1476230400],"c":[10.11999,10.199989,10.4,31.780001,31.370001,31.51,27.91,27.110001],"o":[10.139989,10.05999,10.249999,31.07,32.02,31.57,29.73,27.52],"h":[10.159989,10.209989,10.41,32.02,32.099998,31.959999,29.73,27.52],"l":[9.959989,9.989989,10.17,31.07,31.030001,31.370001,27.889999,27.02],"v":[5460900,10663500,29736800,10026500,7858600,9119000,32668200,19056200],"s":"ok"}';
		var data = JSON.parse(response);

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

Datafeeds.JSApiCompatibleDataFeed.prototype.subscribeBars = function(symbolInfo, resolution, onRealtimeCallback, listenerGUID) {
	// this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID);
};

Datafeeds.JSApiCompatibleDataFeed.prototype.unsubscribeBars = function(listenerGUID) {
	// this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
};

Datafeeds.JSApiCompatibleDataFeed.prototype.calculateHistoryDepth = function(period, resolutionBack, intervalBack) {
};


//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

Datafeeds.JSApiCompatibleDataFeed.prototype.getServerTime = function(callback) {
				callback(+1476320489);
};


Datafeeds.JSApiCompatibleDataFeed.prototype.defaultConfiguration = function() {
	return {
		supports_search: false,
		supports_group_request: true,
		supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
		supports_marks: false,
		supports_timescale_marks: false
	};
};

Datafeeds.JSApiCompatibleDataFeed.prototype.siteConfiguration = function() {
	 var jsonCfg = '{"supports_search":true,"supports_group_request":false,"supports_marks":false,"supports_timescale_marks":false,"supports_time":true,"exchanges":[{"value":"","name":"All Exchanges","desc":""},{"value":"BVMF","name":"BVMF","desc":"BmfBovespa"}],"symbolsTypes":[{"name":"All types","value":""},{"name":"Stock","value":"stock"},{"name":"Index","value":"index"}],"supportedResolutions":["1"]}';

	// data = {
	// 	supports_search: true,
	// 	supports_group_request: false,
	// 	supports_marks: false,
	// 	supports_timescale_marks: false,
	// 	supports_time: true,
	// 	exchanges: [
	// 		{
	// 			value: "",
	// 			name: "All Exchanges",
	// 			desc: ""
	// 		},
	// 		{
	// 			value: "BVMF",
	// 			name: "BVMF",
	// 			desc: "BmfBovespa"
	// 		}
	// 	],
	// 	symbolsTypes: [
	// 		{
	// 			name: "All types",
	// 			value: ""
	// 		},
	// 		{
	// 			name: "Stock",
	// 			value: "stock"
	// 		},
	// 		{
	// 			name: "Index",
	// 			value: "index"
	// 		}
	// 	],
	// 	supportedResolutions: [
	// 		"1"
	// 	]
	// }

	var data = JSON.parse(jsonCfg);
	return data;
};

Datafeeds.JSApiCompatibleDataFeed.prototype._logMessage = function(message) {
	if (this._enableLogging) {
		var now = new Date();
		console.log(now.toLocaleTimeString() + '.' + now.getMilliseconds() + '> ' + message);
	}
};