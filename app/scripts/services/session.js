'use strict';
/*
 * Service Session
 */

app.service('Session', function () {

    this.create = function (userId, username, userRole, userAvatar) {
        this.userId = userId;
        this.username = username;
        this.userRole = userRole;
        this.userAvatar = userAvatar;
    };
    
    this.addUserLocation = function(latLng){
        this.userLocation = latLng;
    };

    this.destroy = function () {
        this.userId = null;
        this.userName = null;
        this.userRole = null;
        this.userAvatar = null;
        this.userLocation = null;
    };
    return this;
});