'use strict';

function ServerTimeController($scope, signalRHubProxy) {
    var clientPushHubProxy = signalRHubProxy(signalRHubProxy.defaultServer, 'MyHub', { logging: true });
    var serverTimeHubProxy = signalRHubProxy(signalRHubProxy.defaultServer, 'MyHub');

    clientPushHubProxy.on('addMessage', function (data) {
        $scope.currentServerTime = data;
        var x = clientPushHubProxy.connection.id;
    });
    
    $scope.getServerTime = function () {
        serverTimeHubProxy.invoke('addMessage', function (data) {
            $scope.currentServerTimeManually = data;
        });
    };
};

//function PerformanceDataController($scope, signalRHubProxy) {
//    var performanceDataHub = signalRHubProxy(signalRHubProxy.defaultServer, 'performanceDataHub');
    
//    performanceDataHub.on('newCpuDataValue', function (data) {
//        $scope.cpuData = data;
//    });
//};