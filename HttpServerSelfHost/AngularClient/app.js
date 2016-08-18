'use strict';

var app = angular.module('signalRIntegrationApp', []);

// Specify SignalR server URL here for supporting CORS
app.value('signalRServer', 'http://localhost:8080');