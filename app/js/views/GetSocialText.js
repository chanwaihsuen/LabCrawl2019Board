'use strict';
import axios from 'axios'

export default class GetSocialText {
    constructor() {
        this.cardsArray = [];
        this.data;
        this.counter = 0;

        let _this = this;

        axios.get('http://localhost:9006/labcrawlResponse.json')
            .then(function (response) {
                // handle success
                console.log(response);
                _this.data = response;
                _this.changeText();
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }

    changeText(whichGroup) {
        let _this = this;
        for (let i = 0; i < whichGroup.length; i++) {
            whichGroup[i].updateMyTextureWithNewInformation(_this.data.data[_this.counter].answer);
            if (_this.counter >= this.data.data.length-1) {
                _this.counter = 0;
            } else {
                _this.counter++;
            }
        }

        // setInterval(() => {
        //     for (let i = 0; i < _this.cardsArray.length; i++) {
        //         _this.cardsArray[i].updateMyTextureWithNewInformation(_this.data.data[_this.counter].answer);
        //     }
        //     if (_this.counter >= this.data.data.length-1) {
        //         _this.counter = 0;
        //     } else {
        //         _this.counter++;
        //     }
        // }, 1000);
    }
    
}
