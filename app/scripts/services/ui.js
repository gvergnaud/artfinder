'use strict';

/**
 * @ngdoc service
 * @name artFinderApp.UI
 * @description
 * # UI
 * Service in the artFinderApp.
 */
app.factory('UI', function UI() {
    //tout ce qui est pareil pour toutes les pages
    var loginContainer = angular.element(document.querySelector('#login')),
        viewcontainer = angular.element(document.querySelector('#viewcontainer'));

    function mainStyle(){

        loginContainer.css({
            width: window.innerWidth + 'px',
            height: window.innerHeight + 'px'
        });

        //on redefini lelement vu car il change a chaque chagement de page
        viewcontainer.css({
            width: window.innerWidth - 80 + 'px'
        });
    }

    mainStyle();
    window.addEventListener('resize', mainStyle, false);



    //Public fonctions
    var ui = {
        
        menuWidth: 80,

        showViewcontainer: function(){
            viewcontainer.removeClass('hidden');
        },

        hideViewcontainer: function(){
            viewcontainer.addClass('hidden');
        },

        toggleLoginOverlay: function(){
            loginContainer.toggleClass('show');
        },

        closeLoginOverlay: function(){
            loginContainer.removeClass('show');
        },

        toggleMenu: function(){
            var viewcontainer = angular.element(document.querySelector('#viewcontainer')),
                notifications = angular.element(document.querySelector('#notifications')),
                menu = angular.element(document.querySelector('header.menu')),
                menuLinks = angular.element(document.querySelectorAll('a.menu_link'));

            if(!ui.menuOpen){

                ui.menuOpen = true;

                notifications.css({
                    width: window.innerWidth - 200 + 'px',
                    left: '200px'
                });

                viewcontainer.css({
                    left: '200px',
                    opacity: '.5'
                });				


                if(ui.menuOpen){
                    menuLinks.removeClass('hidden');
                }


                menu.addClass('opened');

            }else{

                ui.menuOpen = false;


                notifications.css({
                    width: window.innerWidth - ui.menuWidth + 'px',
                    left: '80px'
                });

                viewcontainer.css({
                    left: '80px',
                    opacity: '1'
                });

                menuLinks.addClass('hidden');
                menu.removeClass('opened');

            }
        },

        currentNotifications: [], //tableau qui contient toutes les notifications en cours

        notification: function(type, msg){
            //Si le message n'est pas déjà dans la liste d'attente
            if(ui.currentNotifications.indexOf(msg) === -1){

                //si il n'y a rien dans la liste d'attente, on affiche la notif
                if(ui.currentNotifications.length === 0){
                    //on met le messsage en liste d'attente
                    ui.currentNotifications.push(msg);


                    var notifContainer = angular.element(document.querySelector('aside#notifications'));
                    var newNotif = document.createElement('p');

                    newNotif.innerHTML = msg;

                    newNotif.classList.add('notification');
                    if(type){
                        newNotif.classList.add(type);
                    }

                    notifContainer[0].innerHTML = '';
                    notifContainer[0].style.display = 'block';
                    notifContainer.prepend(newNotif);

                    setTimeout(function(){	
                        newNotif.classList.add('show');
                    }, 100);

                    setTimeout(function(){
                        //on cache la notif 
                        newNotif.classList.remove('show');

                        setTimeout(function(){

                            notifContainer[0].style.display = 'none';
                            angular.element(newNotif).remove();
                            //on retire le message de la liste d'attente
                            ui.currentNotifications.splice(ui.currentNotifications.indexOf(msg), 1);
                        }, 650);


                    }, 4000);

                    newNotif.addEventListener('click', function(){
                        notifContainer[0].style.display = 'none';
                        angular.element(newNotif).remove();
                        //on retire le message de la liste d'attente
                        ui.currentNotifications.splice(ui.currentNotifications.indexOf(msg), 1);
                    });

                }else{
                    setTimeout(function(){
                        ui.notification(type, msg);
                    }, 1000);
                }
            }
        },

        home: {

            init: function(){

                ui.home.setMapView();
                
                //remove event listeners
                window.removeEventListener('resize', ui.addpost.style, false);
                window.removeEventListener('resize', ui.singlepost.style, false);
                window.removeEventListener('resize', ui.singlepost.tagStyles, false);

                //addeventListener
                window.addEventListener('resize', ui.home.resizeMozMap, false);
            },

            resizeMozMap: function(){
                if(!ui.home.view){
                    ui.home.setMapView();
                }else{
                    if(ui.home.view === 'map'){
                        ui.home.setMapView();
                    }else{
                        ui.home.setMozView();
                    }   
                }
            },

            switchMozMap: function(){
                if(!ui.home.view){
                    ui.home.setMapView();
                }else{
                    if(ui.home.view === 'moz'){
                        ui.home.setMapView();
                    }else{
                        ui.home.setMozView();
                    }	
                }
            },

            setMozView: function(){
                var switcher = angular.element(document.querySelectorAll('div#switcher')),
                    mosaic = angular.element(document.querySelectorAll('#mosaic')),
                    map = angular.element(document.querySelectorAll('section.map')),
                    thumbnail = angular.element(document.querySelectorAll('div.post'));

                switcher.css({
                    width: window.innerWidth - ui.menuWidth + 'px',
                    height: '20%',
                    position: 'absolute',
                    top: 0,
                    bottom: '',
                    zIndex: 250
                });

                map.css({
                    width: window.innerWidth - ui.menuWidth + 'px',
                    height: '20%'
                });

                mosaic.css({
                    width: window.innerWidth - ui.menuWidth + 'px',
                    height: '80%'
                });

                thumbnail.removeClass('reduced');


                ui.home.view = 'moz';
            },

            setMapView: function(){
                var switcher = angular.element(document.querySelectorAll('div#switcher')),
                    mosaic = angular.element(document.querySelectorAll('#mosaic')),
                    map = angular.element(document.querySelectorAll('section.map')),
                    thumbnail = angular.element(document.querySelectorAll('div.post'));

                switcher.css({
                    width: window.innerWidth - ui.menuWidth + 'px',
                    height: '20%',
                    position: 'absolute',
                    bottom: 0,
                    top: '',
                    zIndex: 100
                });

                map.css({
                    width: window.innerWidth - ui.menuWidth + 'px',
                    height: '80%'
                });

                mosaic.css({
                    width: window.innerWidth - ui.menuWidth + 'px',
                    height: '20%'
                });

                thumbnail.addClass('reduced');

                ui.home.view = 'map';
            }

        },

        singlepost: {

            selection: false,

            init:function(){
                ui.singlepost.player = angular.element(document.querySelectorAll('#player'));
                ui.singlepost.img = angular.element(document.querySelectorAll('section#player img.mainImage'));
                ui.singlepost.arrows = [angular.element(document.querySelectorAll('nav#prev')), angular.element(document.querySelectorAll('nav#next'))];

                ui.singlepost.style();

                //remove event listeners
                window.removeEventListener('resize', ui.home.resizeMozMap, false);
                window.removeEventListener('resize', ui.addpost.style, false);

                //addeventListener
                window.addEventListener('resize', ui.singlepost.style, false);
                window.addEventListener('resize', ui.singlepost.tagStyles, false);
            },

            style: function(){

                ui.singlepost.player.css({
                    height: window.innerHeight - 100 + 'px'
                });
                
                angular.forEach(ui.singlepost.arrows, function(value, key) {
                    value.css({
                        top: (window.innerHeight - 200)/2 + 'px',
                    });
                });

                if(window.innerWidth > 680){
                    ui.singlepost.img.css({
                        maxHeight: window.innerHeight - 100 + 'px',
                        maxWidth: window.innerWidth - ui.menuWidth - 40 + 'px',
                    }); 
                }else{
                    ui.singlepost.img.css({
                        maxHeight: window.innerHeight - 100 + 'px',
                        maxWidth: window.innerWidth - 40 + 'px',
                    }); 
                }
                
            },

            tagStyles: function(){
                var tagWrapper = angular.element(document.querySelectorAll('.tagWrapper')),
                    img = document.querySelectorAll('section#player img.mainImage');

                if(!!img){
                    tagWrapper.css({
                        height: img[img.length-1].clientHeight + 'px',
                        width:  img[img.length-1].clientWidth + 'px',
                        top: img[img.length-1].offsetTop + 'px'
                    });	
                }
            },

            startIdentification: function(){
                var tagWrapper = angular.element(document.querySelector('.tagWrapper'));
                var tagBoxs = document.querySelectorAll('.tagBox');

                tagWrapper.css({
                    background: 'url(images/tag_wrapper_bg.png)',
                    backgroundSize: '100% 100%',
                    cursor: 'crosshair'
                });
                for(var i = 0 ; i < tagBoxs.length ; i++){
                    tagBoxs[i].classList.add('selection');
                }
            },

            stopIdentification: function(){
                ui.singlepost.tagWrapper = angular.element(document.querySelector('.tagWrapper'));
                var tagBoxs = document.querySelectorAll('.tagBox');

                ui.singlepost.tagWrapper.css({
                    background: '',
                    cursor: ''
                });

                for(var i = 0 ; i < tagBoxs.length ; i++){
                    tagBoxs[i].classList.remove('selection');
                }  		

                if(!!document.getElementById('newArtistId')){
                    angular.element(document.getElementById('newArtistId')).remove();
                } 


            },

            startSelection: function(left, top){
                ui.singlepost.newTag = angular.element('<div />');
                ui.singlepost.tagWrapper = angular.element(document.querySelector('.tagWrapper'));

                if(!!document.getElementById('newArtistId')){
                    angular.element(document.getElementById('newArtistId')).remove();
                }

                ui.singlepost.newTag.addClass('tagBox');
                ui.singlepost.newTag.addClass('selection');
                ui.singlepost.newTag.attr('id', 'newArtistId');
                ui.singlepost.newTag.css({
                    top: top + '%',
                    left: left + '%'
                });

                ui.singlepost.tagWrapper.append(ui.singlepost.newTag);

                console.log('startselection');

                ui.singlepost.selection = true;
            },

            doSelection: function(width, height){
                if(ui.singlepost.selection){
                    ui.singlepost.newTag.css({
                        width: width -1 + '%',
                        height: height -1 + '%'
                    });	
                }
            },

            stopSelection: function(callback){
                ui.singlepost.selection = false;

                var artistNameInput = angular.element('<input />');
                artistNameInput
                .attr('type', 'text')
                .attr('autofocus', '')
                .attr('placeholder', 'nom de l\'artiste')
                .addClass('tagName')
                .css({
                    background: '#fff',
                    color: '#000',
                    textAlign: 'center'
                })
                .on('mousedown', function(e){
                    e.stopPropagation();
                })
                .on('mouseup', function(e){
                    e.stopPropagation();
                })
                .on('click', function(e){
                    e.stopPropagation();
                })
                .on('change', function(){
                    callback.call(this, this);
                });

                ui.singlepost.newTag.append(artistNameInput);

                console.log('stopselection');
            },

            toggleMap: function(callback){
                var map = angular.element(document.querySelector('section.map')),
                    player = angular.element(document.querySelector('section#player')),
                    img = angular.element(document.querySelector('section#player img.mainImage')),
                    arrows = angular.element(document.querySelectorAll('.arrows')),
                    miniatures = angular.element(document.querySelectorAll('.miniatures'));

                map.toggleClass('show');
                player.toggleClass('up');
                img.toggleClass('up');
                arrows.toggleClass('up');
                miniatures.toggleClass('up');

                if(!!callback){
                    setTimeout(function(){
                        callback.call(this);
                    }, 650);
                }
            },

            togglePlayerArrows: function(scope){

                if(typeof scope.post.photos[scope.currentPhotoId - 1] === 'undefined'){
                    scope.arrows[0].css({display: 'none'});
                }else{
                    scope.arrows[0].css({display: 'block'});
                }
                if(typeof scope.post.photos[scope.currentPhotoId + 1] === 'undefined'){
                    scope.arrows[1].css({display: 'none'});
                }else{
                    scope.arrows[1].css({display: 'block'});
                }
            }
        },


        addpost: {
            init: function(){

                ui.addpost.style();
                ui.addpost.dragDropStyle();

                //remove event listeners
                window.removeEventListener('resize', ui.home.resizeMozMap, false);
                window.removeEventListener('resize', ui.singlepost.style, false);
                window.removeEventListener('resize', ui.singlepost.tagStyles, false);

                //addeventListener
                window.addEventListener('resize', ui.addpost.style, false);

            },

            style: function(){
                var dropSection = angular.element(document.querySelector('section#drop')),
                    locateSection = angular.element(document.querySelector('section#locate')),
                    infosSection = angular.element(document.querySelector('section#newPostInfos')),
                    formSections = angular.element(document.querySelectorAll('section.formSection')),
                    formProgress = angular.element(document.querySelector('#formProgress'));

                formSections.css({
                    height: window.innerHeight + 'px'
                });
                
                formProgress.css({
                    width: window.innerWidth - ui.menuWidth - 15 + 'px'
                });
            },

            dragDropStyle: function(){

                window.ondragover = window.ondrop = function(e){ e.preventDefault(); }; // evite le comportement par default du drag and drop

                var el = document.querySelector('#drop');

                el.ondragover = function(){
                    this.className = 'hover';
                    this.innerHTML = 'Drop This !';
                    return false;
                };

                el.ondragleave = function(){
                    this.className = '';
                    this.innerHTML = 'Drop ta photo ici !';
                    return false;
                };

                el.ondrop = function(e) {
                    e.preventDefault();

                    this.className = '';
                    this.innerHTML = '';
                };
            },

            proposePosts: function(){
                var addressInputContainer = angular.element(document.querySelector('span#addressInputContainer'));
                addressInputContainer.addClass('up');
            },

            removeProposedPosts: function(){
                var addressInputContainer = angular.element(document.querySelector('span#addressInputContainer'));
                addressInputContainer.removeClass('up');
            },

            selectedPost: function(post){
                //locate section
                var addressPin = angular.element(document.querySelectorAll('#addressPin')),
                    addressInput = angular.element(document.querySelectorAll('#addressInput')),
                    posts = angular.element(document.querySelectorAll('div.post.col')),
                    thePost = angular.element(document.querySelector('div.post.col.postN' + post.id));

                posts.css({
                    display: 'none'
                });

                thePost.css({
                    display: '',
                    border: '2px solid #B59E5C'
                });

                addressInput.css({
                    display: 'none'
                });

                addressPin.css({
                    display: 'none'
                });

                //infos section
                var addPhotoForm = angular.element(document.querySelector('form#addPhotoForm'));
                var addPostForm = angular.element(document.querySelector('form#addPostForm'));

                addPhotoForm.css({
                    display: 'block'
                });

                addPostForm.css({
                    display: 'none'
                });
            },
            
            removeSelectedPost: function(post){
                //locate section
                var addressPin = angular.element(document.querySelectorAll('#addressPin')),
                    addressInput = angular.element(document.querySelectorAll('#addressInput')),
                    posts = angular.element(document.querySelectorAll('div.post')),
                    thePost = angular.element(document.querySelectorAll('div.post.col.postN' + post.id));

                posts.css({
                    display: ''
                });

                thePost.css({
                    display: '',
                    border: ''
                });

                addressInput.css({
                    display: ''
                });

                addressPin.css({
                    display: ''
                });


                //infos section
                var addPhotoForm = angular.element(document.querySelector('form#addPhotoForm'));
                var addPostForm = angular.element(document.querySelector('form#addPostForm'));

                addPhotoForm.css({
                    display: 'none'
                });

                addPostForm.css({
                    display: 'block'
                });
            }
        }
    };
    return ui;
});