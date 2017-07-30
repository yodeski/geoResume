var resumeApp = angular.module('resumeApp', ['duScroll'])
    .directive('anchorScrollYOffset', anchorScrollYOffsetDirective);;

resumeApp.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeStart', function (e, next, current) {
        console.log('Se comenzará a cambiar la ruta hacia' + next.originalPath);
    })
}]);

function anchorScrollYOffsetDirective($anchorScroll) {
  // DDO
  return {
    restrict: 'A',
    link: anchorScrollYOffsetPostLink
  };
  
  // Functions - Definitions
  function anchorScrollYOffsetPostLink(scope, elem) {
    $anchorScroll.yOffset = elem;
  }
}

/*resumeApp.directive('scrollIf', function () {
  return function (scope, element, attributes) {
    setTimeout(function () {
      if (scope.$eval(attributes.scrollIf)) {
        window.scrollTo(0, element[0].offsetTop - 100)
      }
    });
  }
});*/

resumeApp.controller('CtrlResume', function ($scope, $http, $sce, $location, $document) {
    $scope.sections = [];

    $http.get('history/yodeski/resume').then(function (response) {
        $scope.history = response.data.history;
        var sections = response.data.sections;
        $scope.currSectionid = sections[0].sectionid;
        $scope.lastSectionid = sections[sections.length - 1].sectionid;
        for (var i = 0; i < sections.length; i++) {
            sections[i].sectionimage = $sce.trustAsHtml(sections[i].sectionimage);
            sections[i].sectiontext = $sce.trustAsHtml(sections[i].sectiontext);
            for (var j = 0; j < sections[i].places.length; j++) {
                sections[i].places[j].placetext = $sce.trustAsHtml(sections[i].places[j].placetext);
            }
        };
        $scope.sections = sections;
    });

    $scope.doUp = function (sectionid) {
        if ($scope.currSectionid > 1) {
            $scope.currSectionid = sectionid - 1;
            var idsect = 'sect' + String($scope.currSectionid);
            angular.element(document.getElementById(idsect)).removeClass('hide');
            angular.element(document.getElementsByClassName('active')).removeClass('active');
            angular.element(document.getElementById(idsect)).addClass('active');
            var someElement = angular.element(document.getElementById(idsect));
            $document.scrollToElement(someElement, 0, 500);
            //$anchorScroll(idsect);
            //window.scroll(0,findPos(document.getElementById(idsect)));
        }
    };

    $scope.doDown = function (sectionid) {
        if ($scope.currSectionid < $scope.lastSectionid) {
            $scope.currSectionid = sectionid + 1;
            var idsect = 'sect' + String($scope.currSectionid);
            angular.element(document.getElementById('sect' + sectionid)).addClass('hide');
            angular.element(document.getElementById('sect' + sectionid)).removeClass('active');
            angular.element(document.getElementById(idsect)).addClass('active');
            var someElement = angular.element(document.getElementById(idsect));
            $document.scrollToElement(someElement, 0, 500);
            //$anchorScroll(idsect);
            //window.scroll(0,findPos(document.getElementById(idsect)));
        }
    };

    function findPos(obj) {
        var curtop = 0;
        if (obj.offsetParent) {
            do {
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return [curtop];
        }
    }

});