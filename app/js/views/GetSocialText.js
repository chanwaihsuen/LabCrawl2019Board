'use strict';
import axios from 'axios'

export default class GetSocialText {
    constructor() {
        this.cardsArray = [];
        this.submittedData;
        this.counter = 0;
        this.lastDataLength = 0;
        // this.refreshJson();
        this.getNewData();
    }

    refreshJson() {
        console.log('refreshJson');
        let _this = this;

        // axios.get('http://localhost:3000/getData')
        //     .then(function (response) {
        //         // handle success
        //     })
        //     .catch(function (error) {
        //         // handle error
        //         console.log(error);
        //     })
        //     .finally(function () {
        //         // always executed
        //         setTimeout(() => {
        //             console.log('refreshJson SETTIMEOUT');
        //             _this.refreshJson();
        //         }, 100 * 1000);
        //     });
    }

    getNewData() {
        console.log('getNewData');
        let _this = this;

        axios.get('http://localhost:9006/labcrawlResponse.json')
            .then(function (response) {
                // handle success
                console.log(response.data);

                if (_this.lastDataLength >= response.data.length) {
                    console.log('NO CHANGE IN DATA');
                } else {
                    console.log('NEW DATA ADDED');
                    _this.submittedData = response.data.reverse();
                }
                _this.lastDataLength = response.data.length;
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
                _this.counter = 0;
                _this.getNewData();
            } else {
                _this.counter++;
            }
        }
    }

}
