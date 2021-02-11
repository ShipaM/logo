'use strict'
document.addEventListener("DOMContentLoaded", function() {

    // Custom JS
    //гамбургер меню
    const iconMenu = document.querySelector(".icon-menu");
    const menuBody = document.querySelector(".menu__body");
    const body = document.querySelector('body');


    iconMenu.addEventListener("click", (e) => {
        iconMenu.classList.toggle("active");
        menuBody.classList.toggle("active");
        body.classList.toggle("lock");
    });


    //Функция проверяет поддерживает ли браузер webp
    function testWebP(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function() {
            callback(webP.height == 2);
        };
        webP.src =
            "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    testWebP(function(support) {
        if (support == true) {
            document.querySelector("body").classList.add("webp");
        } else {
            document.querySelector("body").classList.add("no-webp");
        }
    });


    ///////////////////////////////////////////////////////////////////////
    // Применение класса "ibg"//////////////////////////////////////////
    function ibg() {

        let ibg = document.querySelectorAll(".ibg"); // Получаем блок склассом .ibg в переменную ibg
        console.log(ibg);
        for (let i = 0; i < ibg.length; i++) {
            console.log(ibg[i]);
            console.log(ibg[i].querySelector('img'))
            if (ibg[i].querySelector('img')) {
                ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
            }
        }
    }

    ibg();
    ////////////////////////////////////////////////////////////////////////////

    // Dynamic Adapt v.1
    // HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
    // e.x. data-da=".item,992,2"
    // Andrikanych Yevhen 2020
    // https://www.youtube.com/c/freelancerlifestyle



    function DynamicAdapt(type) {
        this.type = type;
    }

    DynamicAdapt.prototype.init = function() {
        const _this = this;
        // массив объектов
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        // массив DOM-элементов
        this.nodes = document.querySelectorAll("[data-da]");

        // наполнение оbjects объктами
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }

        this.arraySort(this.оbjects);

        // массив уникальных медиа-запросов
        this.mediaQueries = Array.prototype.map.call(this.оbjects, function(item) {
            return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }, this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        });

        // навешивание слушателя на медиа-запрос
        // и вызов обработчика при первом запуске
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ',');
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];

            // массив объектов с подходящим брейкпоинтом
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function(item) {
                return item.breakpoint === mediaBreakpoint;
            });
            matchMedia.addListener(function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            });
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };

    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) {
            for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            }
        } else {
            for (let i = 0; i < оbjects.length; i++) {
                const оbject = оbjects[i];
                if (оbject.element.classList.contains(this.daClassname)) {
                    this.moveBack(оbject.parent, оbject.element, оbject.index);
                }
            }
        }
    };

    // Функция перемещения
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if (place === 'last' || place >= destination.children.length) {
            destination.insertAdjacentElement('beforeend', element);
            return;
        }
        if (place === 'first') {
            destination.insertAdjacentElement('afterbegin', element);
            return;
        }
        destination.children[place].insertAdjacentElement('beforebegin', element);
    }

    // Функция возврата
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== undefined) {
            parent.children[index].insertAdjacentElement('beforebegin', element);
        } else {
            parent.insertAdjacentElement('beforeend', element);
        }
    }

    // Функция получения индекса внутри родителя
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };

    // Функция сортировки массива по breakpoint и place 
    // по возрастанию для this.type = min
    // по убыванию для this.type = max
    DynamicAdapt.prototype.arraySort = function(arr) {
        if (this.type === "min") {
            Array.prototype.sort.call(arr, function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }

                    if (a.place === "first" || b.place === "last") {
                        return -1;
                    }

                    if (a.place === "last" || b.place === "first") {
                        return 1;
                    }

                    return a.place - b.place;
                }

                return a.breakpoint - b.breakpoint;
            });
        } else {
            Array.prototype.sort.call(arr, function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0;
                    }

                    if (a.place === "first" || b.place === "last") {
                        return 1;
                    }

                    if (a.place === "last" || b.place === "first") {
                        return -1;
                    }

                    return b.place - a.place;
                }

                return b.breakpoint - a.breakpoint;
            });
            return;
        }
    };

    const da = new DynamicAdapt("max");
    da.init();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////




    //     class DynamicAdapt {
    //         constructor(type) {
    //             this.type = type;
    //         }

    //         init() {
    //             // массив объектов
    //             this.оbjects = [];
    //             this.daClassname = '_dynamic_adapt_';
    //             // массив DOM-элементов
    //             this.nodes = [...document.querySelectorAll('[data-da]')];

    //             // наполнение оbjects объктами
    //             this.nodes.forEach((node) => {
    //                 const data = node.dataset.da.trim();
    //                 const dataArray = data.split(',');
    //                 const оbject = {};
    //                 оbject.element = node;
    //                 оbject.parent = node.parentNode;
    //                 оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
    //                 оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
    //                 оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
    //                 оbject.index = this.indexInParent(оbject.parent, оbject.element);
    //                 this.оbjects.push(оbject);
    //             });

    //             this.arraySort(this.оbjects);

    //             // массив уникальных медиа-запросов
    //             this.mediaQueries = this.оbjects
    //                 .map(({
    //                     breakpoint
    //                 }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
    //                 .filter((item, index, self) => self.indexOf(item) === index);

    //             // навешивание слушателя на медиа-запрос
    //             // и вызов обработчика при первом запуске
    //             this.mediaQueries.forEach((media) => {
    //                 const mediaSplit = media.split(',');
    //                 const matchMedia = window.matchMedia(mediaSplit[0]);
    //                 const mediaBreakpoint = mediaSplit[1];

    //                 // массив объектов с подходящим брейкпоинтом
    //                 const оbjectsFilter = this.оbjects.filter(
    //                     ({
    //                         breakpoint
    //                     }) => breakpoint === mediaBreakpoint
    //                 );
    //                 matchMedia.addEventListener('change', () => {
    //                     this.mediaHandler(matchMedia, оbjectsFilter);
    //                 });
    //                 this.mediaHandler(matchMedia, оbjectsFilter);
    //             });
    //         }

    //         // Основная функция
    //         mediaHandler(matchMedia, оbjects) {
    //             if (matchMedia.matches) {
    //                 оbjects.forEach((оbject) => {
    //                     оbject.index = this.indexInParent(оbject.parent, оbject.element);
    //                     this.moveTo(оbject.place, оbject.element, оbject.destination);
    //                 });
    //             } else {
    //                 оbjects.forEach(
    //                     ({ parent, element, index }) => {
    //                         if (element.classList.contains(this.daClassname)) {
    //                             this.moveBack(parent, element, index);
    //                         }
    //                     }
    //                 );
    //             }
    //         }

    //         // Функция перемещения
    //         moveTo(place, element, destination) {
    //             element.classList.add(this.daClassname);
    //             if (place === 'last' || place >= destination.children.length) {
    //                 destination.append(element);
    //                 return;
    //             }
    //             if (place === 'first') {
    //                 destination.prepend(element);
    //                 return;
    //             }
    //             destination.children[place].before(element);
    //         }

    //         // Функция возврата
    //         moveBack(parent, element, index) {
    //             element.classList.remove(this.daClassname);
    //             if (parent.children[index] !== undefined) {
    //                 parent.children[index].before(element);
    //             } else {
    //                 parent.append(element);
    //             }
    //         }

    //         // Функция получения индекса внутри родителя
    //         indexInParent(parent, element) {
    //             return [...parent.children].indexOf(element);
    //         }

    //         // Функция сортировки массива по breakpoint и place 
    //         // по возрастанию для this.type = min
    //         // по убыванию для this.type = max
    //         arraySort(arr) {
    //             if (this.type === 'min') {
    //                 arr.sort((a, b) => {
    //                     if (a.breakpoint === b.breakpoint) {
    //                         if (a.place === b.place) {
    //                             return 0;
    //                         }
    //                         if (a.place === 'first' || b.place === 'last') {
    //                             return -1;
    //                         }
    //                         if (a.place === 'last' || b.place === 'first') {
    //                             return 1;
    //                         }
    //                         return a.place - b.place;
    //                     }
    //                     return a.breakpoint - b.breakpoint;
    //                 });
    //             } else {
    //                 arr.sort((a, b) => {
    //                     if (a.breakpoint === b.breakpoint) {
    //                         if (a.place === b.place) {
    //                             return 0;
    //                         }
    //                         if (a.place === 'first' || b.place === 'last') {
    //                             return 1;
    //                         }
    //                         if (a.place === 'last' || b.place === 'first') {
    //                             return -1;
    //                         }
    //                         return b.place - a.place;
    //                     }
    //                     return b.breakpoint - a.breakpoint;
    //                 });
    //                 return;
    //             }
    //         }
    //     }

});







// $(function() {
//     $(".wrapper").addClass("loaded");

//     $(".icon-menu").click(function(event) {
//         $(this).toggleClass("active");
//         $(".menu__body").toggleClass("active");
//         $("body").toggleClass("lock");
//     });

//     function ibg() {
//         $.each($(".ibg"), function(index, val) {
//             if ($(this).find("img").length > 0) {
//                 $(this).css(
//                     "background-image",
//                     'url("' + $(this).find("img").attr("src") + '")'
//                 );
//             }
//         });
//     }
//     ibg();

//     if ($(".slider__body").length > 0) {
//         $(".slider__body").slick({
//             //autoplay: true,
//             //infinite: false,
//             dots: true,
//             arrows: false,
//             slidesToShow: 1,
//             autoplaySpeed: 3000,
//             adaptiveHeight: true,
//             nextArrow: '<button type="button" class="slick-next"></button>',

//             prevArrow: '<button type="button" class="slick-prev"></button>',
//             responsive: [{
//                 breakpoint: 768,
//                 settings: {},
//             }, ],
//         });
//     }
// });


// document.addEventListener("DOMContentLoaded", function() {
//             // Custom JS
//             $(".wrapper").addClass("loaded");

//             function ibg() {
//                 $.each($(".ibg"), function(index, val) {
//                     if ($(this).find("img").length > 0) {
//                         $(this).css(
//                             "background-image",
//                             'url("' + $(this).find("img").attr("src") + '")'
//                         );
//                     }
//                 });
//             }
//             ibg();

//             //.user-header__icon выпадающее меню
//             const userHeaderIcon = document.querySelector(".user-header__icon");

//             userHeaderIcon.addEventListener("click", function(e) {
//                 const userHeaderMenu = document.querySelector(".user-header__menu");

//                 userHeaderMenu.classList.toggle("_active");

//                 document.documentElement.addEventListener("click", function(e) {
//                     if (!e.target.closest(".user-header")) {
//                         const userHeaderMenu = document.querySelector(".user-header__menu");
//                         userHeaderMenu.classList.remove("_active");
//                     }
//                 });
//             });

// //menu
// const iconMenu = document.querySelector(".icon-menu");

// if (iconMenu != null) {
//     let delay = 500;
//     let body = document.querySelector("body");
//     let menuBody = document.querySelector(".menu__body");
//     iconMenu.addEventListener("click", (e) => {
//         if (!body.classList.contains("_wait")) {
//             body_lock(delay);
//             iconMenu.classList.toggle("_active");
//             menuBody.classList.toggle("_active");
//         }
//     });
// }

//     const iconMenu = document.querySelector(".icon-menu");
//     const menuBody = document.querySelector(".menu__body");
//     const body = document.querySelector("body");

//     iconMenu.addEventListener("click", function(e) {
//         iconMenu.classList.toggle("_active");
//         menuBody.classList.toggle("_active");
//         body.classList.toggle("_lock");
//     });

//     //Slider
//     if ($(".main-slider__body").length > 0) {
//         $(".main-slider__body").slick({
//             //autoplay: true,
//             //infinite: false,
//             dots: false,
//             arrows: true,
//             slidesToShow: 1,
//             autoplaySpeed: 3000,
//             adaptiveHeight: true,
//             nextArrow: ".control-main-slider__arrow_next",
//             prevArrow: ".control-main-slider__arrow_prev",
//             responsive: [{
//                 breakpoint: 768,
//                 settings: {
//                     autoHeight: false,
//                 },
//                 breakpoint: 320,
//                 settings: {
//                     autoHeight: true,
//                 },
//             }, ],
//         });
//     }
// });