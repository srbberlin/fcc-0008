(function () { 
  var app = angular.module('mainApp', []), res;

  app.factory("arts", ["$window", function ($window) {
    
    if ($window.localStorage.pomTypes === undefined) {
      $window.localStorage.setItem("pomTypes", JSON.stringify( [
        {
          name: "Insert new Name", cnt: 25, ps: 5, des: "Insert new description", en: true 
        },
        {
          name: "Basic", cnt: 25, ps: 5, des: "Every day's work"
        },
        {
          name: "Sad", cnt: 55, ps: 5, des: "Later that day"
        },
        {
          name: "Quick", cnt: 15, ps: 25, des: "On sunday afternoon"
        }
      ]));
    }

    if ($window.localStorage.pomEntries === undefined) {
      $window.localStorage.setItem("pomEntries", JSON.stringify( [
        {
          name: "Insert new name", type: "", des: "Insert new description", en: true
        },
        {
          name: "From 9 to 5", type: "Basic", des: "Getting the dishes clean"
        },
        {
          name: "Very last chance", type: "Sad", des: "Input please"
        },
        {
          name: "Easy al least", type: "Sad", des: "Input please"
        },
        {
          name: "Eventally", type: "Quick", des: "Input please"
        },
        {
          name: "Allmost never", type: "Quick", des: "Input please"
        },
      ]));
    }
    
    res = {
      entryTypes: JSON.parse($window.localStorage.pomTypes),
      entries: JSON.parse($window.localStorage.pomEntries),

      typeName: "",
      typeIndex: 1,
      typeDuration: "",
      typePause: "",
      typeDes: "",
      typeDisabled: true,

      entryName: "",
      entryType: "",
      entryIndex: 1,
      entryDes: "",
      entryDisabled: true,
      
      storeType: function() {
        let t = this.entryTypes;
        t.push({ name: this.typeName, cnt: parseInt(this.typeDuration), ps: parseInt(this.typePause), des: this.typeDes });
        this.typeIndex = t.length - 1;
        this.typeDisabled = true;
        $window.localStorage.setItem("pomTypes", JSON.stringify(t));
      },
      
      getType: function(name) {
        let i = this.entryTypes.length, t;
        while(i--) {
          t = this.entryTypes[i];
          if (t.name === name) {
            t.index = i;
            //console.log("getType:", t.name);
            return t;
          }
        }
        return null;
      },
      
      storeEntry: function() {
        let e = this.entries;
        e.push({ name: this.entryName, type: this.entryType, des: this.entryDes });
        this.entryIndex = e.length - 1;
        this.entryDisabled = true;
        $window.localStorage.setItem("pomEntries", JSON.stringify(e));
      },
      
      getEntry: function(name) {
        let i = this.entries.length, e;
        while (i--) {
          e = this.entries[i];
          if (name === e.name) {
            e.index = i;
            //console.log("getEntry:", e.name);
            return e;
            break;
          }
        }
        return null;
      },
      
      getTypes: function() {
        let res = [], i = 0, l = this.entryTypes.length;
        while (i < l) {
          let t = this.entryTypes[i];
          t.index = i;
          res.push(t);
          //console.log("getTypes:", t.name);
          i++;
        }
        return res;
      },
      
      getEntries: function(type) {
        let res = [], i = 0, l = this.entries.length;
        while (i < l) {
          let e = this.entries[i];
          if (! type || i === 0 || type === e.type) {
            //console.log("getEntries:", e.name);
            e.index = i;
            res.push(e);
          }
          i++;
        }
        if (! res.length) {
          res.push(this.entries[0]);
        }
        return res;
      },
      
      initMasks: function(type, entry) {
        //console.log("initMasks:", type, entry);
        let lType = type ? this.getType(type) : this.entryTypes[1];
        let lIndex = lType.index === 0 ? 0 : 1;
        let lEntry = entry ? this.getEntry(entry) : this.getEntries(lIndex ? lType.name : null)[lIndex];
        this.typeName = lType.name;
        this.typeIndex = lType.index;
        this.typeDuration = lType.cnt;
        this.typePause = lType.ps;
        this.typeDes = lType.des;
        this.typeDisabled = lType.index != 0;//!(lType.en);
        this.entryName = lEntry.name;
        this.entryIndex = lEntry.index;
        this.entryType = lEntry.index != 0 ? lEntry.type : lType.name;
        this.entryDes = lEntry.des;
        this.entryDisabled = lEntry.index != 0;//!(lEntry.en);
        //console.log("initMasks: DONE !!");
        return [!this.typeDisabled, !this.entryDisabled];
      }
    };
    
    res.initMasks();
    //console.log("--------\narts: controller DONE !!");
    return res;
  }]);

  app.controller('editController', ["$scope", "arts", function ($scope, arts) {
  }]);

  app.controller('mainController', function($scope) {
  });

  app.controller('footerController', function($scope) {
  });

  app.directive('pomEdit', ["arts", function (arts) {
    return {
      replace: true,
      restrict: "E",
      template:
      '<div id="msk">' +
        '<svg id="show" ng-click="showMask()">' +
          '<line y1="10" x1="10" y2="10" x2="50"/>' +
          '<line y1="20" x1="10" y2="20" x2="50"/>' +
          '<line y1="30" x1="10" y2="30" x2="50"/>' +
          '<line y1="40" x1="10" y2="40" x2="50"/>' +
          '<line y1="50" x1="10" y2="50" x2="50"/>' +
        '</svg>' +
        '<svg id="hide" ng-click="hideMask()">' +
          '<line y1="5" x1="5" y2="15" x2="15"/>' +
          '<line y1="5" x1="15" y2="15" x2="5"/>' +
        '</svg><br><br>' +
        '<div id="typeInMask">' +
          '<select ng-change="selectType()" ng-model="arts.typeName">' +
            '<option ng-repeat="t in arts.getTypes() track by $index">{{t.name}}</option>' +
          '</select>' +
          '<button id="typeSave" ng-click="storeType()">save</button>' +
          '<input type="text" value="{{arts.typeName}}" ng-model="arts.typeName" ng-change="setTypeName($event)" ng-disabled="arts.typeDisabled"/>' +
          '<input type="text" value="{{arts.typeDuration}}" ng-model="arts.typeDuration" ng-keypress="numbers($event)" ng-disabled="arts.typeDisabled"/>' +
          '<input type="text" value="{{arts.typePause}}" ng-model="arts.typePause" ng-keypress="numbers($event)" ng-disabled="arts.typeDisabled"/>' +
          '<input type="text" value="{{arts.typeDes}}" ng-model="arts.typeDes" ng-disabled="arts.typeDisabled"/>' +
        '</div><br>' +
        '<div id="entryInMask">' +
          '<select ng-change="selectEntry()" ng-model="arts.entryName">' +
             '<option ng-repeat="e in arts.getEntries(arts.typeName) track by $index">{{e.name}}</option>' +
          '</select>' +
          '<button id="entrySave" ng-click="storeEntry()">save</button>' +
          '<input type="text" value="{{arts.entryName}}" ng-model="arts.entryName" ng-disabled="arts.entryDisabled"/>' +
          '<input type="text" value="{{arts.entryType}}" ng-model="arts.entryType" ng-disabled="arts.entryDisabled || arts.entryIndex === 0"/>' +
          '<input type="text" value="{{arts.entryDes}}" ng-model="arts.entryDes" ng-disabled="arts.entryDisabled"/>' +
        '</div>' +
      '</div>',

      controller: ["$scope", "arts", function ($scope, arts) {
        $scope.arts = arts;
        $scope.show = angular.element("#show");
        $scope.hide = angular.element("#hide");
        $scope.fot = angular.element("#fot");
        $scope.clo = angular.element("#clock");
        $scope.typeInMask = angular.element("#typeInMask");
        $scope.entryInMask = angular.element("#entryInMask");
        $scope.typeSave = angular.element("#typeSave");
        $scope.entrySave = angular.element("#entrySave");

        $scope.showMask = function () {
          $scope.show.css('visibility', 'hidden');
          $scope.hide.css('visibility', 'visible');
          $scope.fot.css('visibility', 'hidden');
          $scope.clo.css('visibility', 'hidden');
          $scope.typeInMask.css('visibility', 'visible');
          $scope.entryInMask.css('visibility', 'visible');
        };

        $scope.hideMask = function () {
          $scope.show.css('visibility', 'visible');
          $scope.hide.css('visibility', 'hidden');
          $scope.fot.css('visibility', 'visible');
          $scope.clo.css('visibility', 'visible');
          $scope.typeInMask.css('visibility', 'hidden');
          $scope.entryInMask.css('visibility', 'hidden');
        };

        $scope.selectType = function () {
          //console.log("--------\nselectType:", arts.typeName);
          let a = arts.initMasks(arts.typeName);
          if (a[0]) {
            $scope.typeSave.css('visibility', 'visible');
          }
          else {
            $scope.typeSave.css('visibility', 'hidden');
          }
          if (a[1]) {
            $scope.entrySave.css('visibility', 'visible');
          }
          else {
            $scope.entrySave.css('visibility', 'hidden');
          }
          //console.log("--------");
        };

        $scope.selectEntry = function () {
          //console.log("--------\nselectEntry:", arts.typeName, arts.entryName);
          if (arts.initMasks(arts.typeName, arts.entryName)[1]) {
            $scope.entrySave.css('visibility', 'visible');
          }
          else {
            $scope.entrySave.css('visibility', 'hidden');
          }
          //console.log("--------");
        };
        
        $scope.setTypeName = function () {
          let t = $scope.arts.typeName;
          $scope.arts.entryType = t;
        };
        
        $scope.storeType = function () {
          arts.storeType();
        };

        $scope.storeEntry = function () {
          arts.storeEntry();
        };

        $scope.numbers = function (e) {
          let c = e.charCode;
          if (c >= 32 && c < 48 ||  c > 57) {
            e.preventDefault();
          }
        };
      }],

      link: function(scope, iElement, iAttributes){
      },
    };
  }]);
  
  app.directive('pomFooter', ["arts", function (arts) {
    return {
      replace: true,
      restrict: "E",
      template:
      '<div id="fot" class="">' +
        '<button class="btn" ng-click="pomoStart();">Start</button>' +
        '<button class="btn" ng-click="pomoStop();">Stop</button>' +
        '<button class="btn" ng-click="pomoReStart();">Restart</button>' +
      '</div>',
      controller: ["$scope", "arts", "$interval", "$window", function ($scope, arts, $interval, $window) {
        const IDLE = 0, WORK = 1, PAUSE = 2;
        let tId, tCnt = 1, tClock, tRotate, tStep, tPause, tState = IDLE,
            pomoMain = $("#main"),
            pomoMainWidth,
            pomoMainHeight,
            pomo = $("#main img"),
            pomoOrigRatio = pomo[0].naturalWidth / pomo[0].naturalHeight,
            pomoFact = 1,
            pomoClock = $("#clock");
        
        function calcAttr(secs) {
          var hr = Math.floor(secs / 3600);
          var min = Math.floor((secs - (hr * 3600))/60);
          var sec = secs - (hr * 3600) - (min * 60);

          if (hr < 10) {hr = "0" + hr; }
          if (min < 10) {min = "0" + min;}
          if (sec < 10) {sec = "0" + sec;}
          if (hr) {hr = "00";}
          
          tClock = (tState === IDLE) ? "Pomodoro<br>Clock" :
                   (tState === PAUSE ? "Pause<br>" : "Work<br>") + hr + ':' + min + ':' + sec;
          tRotate = "rotate(" + Math.floor((360 / tCnt) * secs) + "deg)";
        }
        
        function pomoResize () {
          let pomoMainWidth = pomoMain[0].clientWidth,
              pomoMainHeight = pomoMain[0].clientHeight,
              mainRatio = pomoMainWidth / pomoMainHeight, 
              w, h, m;

          if (mainRatio > pomoOrigRatio) {
            w = pomoMainHeight * pomoOrigRatio * pomoFact;
          }
          else {
            w = pomoMainWidth * pomoFact;
          }
          
          h = w / pomoOrigRatio;
          m = pomoMainHeight - h;
          if (m > 0) {
            m /= 2;
          }
          else {
            m = 0;
          }

          pomo.css({
            'width': w + 'px',
            'margin-top': m + 'px',
            'transform': tRotate
          });
          
          pomoClock.html(tClock);
          pomoClock.css({
            'font-size': pomoMainHeight / 8,
            'color': "yellow"
          });
        }
  
        function pomoTimer(cnt) {
          //console.log("pomTimer", cnt, tCnt, tPause);
          if (cnt == tCnt) {
            if (tState === PAUSE) {
              pomoStop();
            }
            else {
              tState = PAUSE;
              calcAttr(0);
              tCnt = arts.typePause;
              tStep = 0.75 / tCnt;
              pomoFact = 0.25;
              pomoResize();
              $interval.cancel(tId);
              tId = $interval(pomoTimer, 1000, tCnt);
            }
          }
          else {
            //console.log("pomTimer", cnt);
            calcAttr(cnt);
            pomoFact += tStep; 
            pomoResize();
          }
        };

        function pomoStart () {
          if (!tId) {
            //console.log("pomStart");
            tState = WORK;
            calcAttr(0);
            tCnt = arts.typeDuration;
            tStep = 0.75 / tCnt;
            pomoFact = 0.25;
            pomoResize();
            tId = $interval(pomoTimer, 1000, tCnt);
          }
        };

        function pomoStop () {
          if (tId) {
            //console.log("pomStop");
            tState = IDLE;
            calcAttr(0);
            $interval.cancel(tId);
            pomoFact = 1;
            pomoResize();
            tId = undefined;
          }
        };

        function pomoReStart () {
          pomoStop();
          pomoStart();
        };

        $scope.pomoStart = pomoStart;
        $scope.pomoStop = pomoStop;
        $scope.pomoReStart = pomoReStart;
        $scope.pomoResize = pomoResize;
        
        $window.onresize = pomoResize;
        calcAttr(0);
        pomoResize();
      }],
      link: function(scope){
      },
    };
  }]);
})();