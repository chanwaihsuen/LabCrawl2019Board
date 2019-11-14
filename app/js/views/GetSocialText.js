'use strict';
import axios from 'axios'

export default class GetSocialText {
    constructor() {
        this.cardsArray = [];
        this.submittedData;
        this.counter = 0;
        this.lastDataLength = 0;
        this.refreshJson();
        // this.getNewData();
        this.timeoutID;
    }

    refreshJson() {
        console.log('refreshJson: GETTING DATA FROM SERVER');
        if (this.timeoutID) {
            console.log('refreshJson: CLEAR TIMEOUT');
            clearTimeout(this.timeoutID);
        }

        let _this = this;

        axios.get('http://localhost:3000/getData')
            .then(function (response) {
                // handle success
                console.log('refreshJson: CALLING GETNEWDATA()');
                _this.getNewData();
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
                _this.timeoutID = setTimeout(() => {
                    console.log('refreshJson: SETTIMEOUT IS CALLED');
                    _this.refreshJson();
                }, 5 * 60 * 1000);
            });
    }

    getNewData() {
        console.log('getNewData: GETTING DATA LOCAL FILE JSON');
        let _this = this;

        axios.get('http://localhost:9006/labcrawlResponse.json')
            .then(function (response) {
                // handle success
                console.log('getNewData: SUCCESS');
                console.log(response.data);
                
                // JUST FORCE UPDATE
                _this.submittedData = response.data.reverse();
                
                // if (_this.lastDataLength >= response.data.length) {
                //     console.log('getNewData: NO CHANGE IN DATA');
                // } else {
                //     console.log('getNewData: NEW DATA ADDED');
                //     _this.submittedData = response.data.reverse();
                // }
                // _this.lastDataLength = response.data.length;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });

        // setTimeout(() => {
        //     console.log('SET TIMEOUT');
        //     _this.getNewData();
        // }, 5000);
    }

    changeText(whichGroup) {
        let _this = this;
        for (let i = 0; i < whichGroup.length; i++) {
            // console.log('_this.counter', _this.counter);
            let theTextToDisplay = _this.submittedData[_this.counter].answer;
            whichGroup[i].updateMyTextureWithNewInformation(theTextToDisplay);
            if (_this.counter >= this.submittedData.length - 1) {
                console.log('changeText: RESET COUNTER');
                _this.counter = 0;
                _this.refreshJson();
            } else {
                _this.counter++;
            }
        }
    }

}
