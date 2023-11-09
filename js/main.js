// JavaScript Document

// Create and provide timeline to Hoxton
var Creative = {};
Creative.tl = gsap.timeline({defaults: {duration:1, ease:"none"}});
//hoxton.timeline = Creative.tl;
gsap.defaults({overwrite: "auto"});

// looping config vars
var _currentLoop = 0;
var _totalLoops = 0;
var _endFrameDelay = 4;
var _useReplayBtn = true;

// content
var container = getById("container");
var loadingContent = getById("loading_content");

// copy
var copyFrame01a = getById("copy_frame01a");
var copyFrame02a = getById("copy_frame02a");


gsap.to(copyFrame01a, {
    opacity: 0,
    duration: 4,
    delay: 2,
});
gsap.fromTo(copy_frame02a, { opacity: 0 }, { opacity: 1, duration: 4, delay: 4 });


// images
var img_container = getById("img_container");
var imgFrame01 = getById("img_frame01");
var imgFrame02 = getById("img_frame02");

gsap.from(img_container, {
    x: "100%", // Mueve el contenedor hacia la derecha
    duration: 3, // Duración de la animación en segundos
    ease: "power2.inOut", // Tipo de easing (puedes ajustarlo según tus preferencias)
    repeat: 0, // Repetir la animación infinitamente
    yoyo: false, // Hacer que la animación se repita en sentido contrario
});



// furniture cta, logos etc
var ctaContainer = getById("cta_container");
var copyCta = getById("copy_cta");
var logoContainer = getById("logo_container");
var imgLogo = getById("img_logo");
var copy_cta1 = getById("copy_cta1");
var copy_cta2 = getById("copy_cta2");
var copy_cta3 = getById("copy_cta3");

gsap.fromTo(copy_cta1, { opacity: 0 }, { opacity: 1, duration: 4, delay: 4 });
gsap.fromTo(copy_cta2, { opacity: 0 }, { opacity: 1, duration: 4, delay: 4 });
gsap.fromTo(copy_cta3, { opacity: 0 }, { opacity: 1, duration: 4, delay: 4 });

// banner timings
var _arrFrameWaits = [3,3,3,3]; // frame timings
var _fadeOutSpeed = 0.3;
var _fadeInSpeed = 1;

// vars to control elements that can be turned on/off for each frame (logo,cta etc).
var _arrLogoFrames = [false,false,false,false,false]; 
var _arrCtaFrames = [false,false,false,false,false];
var _arrFrameObjs = []; // array of objects (one for each ele) that define ele behaviour (used for logos and cta's)
   

// exit and replay
var btnReplay = getById("btn_replay");
var exitBtn = getById("exit_btn");

var _exitURL = "https://www.hogarthww.com";


// frame
var _totalFrames = 5;
var _currentFrame = 0;
var _previousFrame = 0;


function getById(eleID) {
    return document.getElementById(eleID);
}

/*
* Function called when banner and it's data/images have initially loaded.
* Builds timeline and adds necessary listeners.
*/
function startAd() {

    // activate btns
    //exitBtn.addEventListener("click", exitBtn_clickHandler, false);
    // copyCta.addEventListener("click", function () {
    //     disclaimer.classList.remove("hidden-disclaimer");
    //     });
    // exitBtn.addEventListener("click", function () {
    // disclaimer.classList.add("hidden-disclaimer");
    // });

    // btnReplay.addEventListener("click", btnReplay_clickHandler, false);
    
    // show Ad
    loadingContent.style.display = "none";
    container.style.display = "block";

    // setup timeline
    Creative.tl.repeat(_totalLoops);
    Creative.tl.repeatDelay(_endFrameDelay);
    Creative.tl.eventCallback("onStart", onBannerStart);
    Creative.tl.eventCallback("onRepeat", onBannerRepeat);
    //Creative.tl.eventCallback("onComplete", bannerComplete);

    Creative.init();
    Creative.checkIsBackup() ? Creative.jumpToEndFrame() : null;
}

// StartAd function




/*
* function fired when exit button clicked
*/
function exitBtn_clickHandler() {
    hoxton.exit("Exit", _exitURL);
}

/*
* function fired when replay button clicked
*/
function btnReplay_clickHandler() {
    _currentLoop++;
    Creative.tl.repeat(0);
    Creative.tl.seek("reset");
    Creative.tl.play();
    //tlTracer();
}

/*
* function fired banner starts
*/
function onBannerStart() {
    //console.log("bannerStart()");
}

/*
* function fired banner repeats
*/
function onBannerRepeat() {   
    _currentLoop++;
    //console.log("bannerRepeat():"+_currentLoop);
}

/*
* function fired when all banner loops are completed
*/
function bannerComplete() {
    //console.log("bannerComplete()");
    
    if(_currentLoop === _totalLoops && _useReplayBtn === true)
    {
        Creative.tl.to(btnReplay, {duration:0, css:{display:"block"}}, "end");
    }

}


Creative.jumpToEndFrame = function() {
    Creative.tl.pause();
    Creative.tl.seek( "end", false);
    btnReplay.style.display = "none";
}

Creative.checkIsBackup = function() {
    return (window.location.href.indexOf('hoxtonBackup') >= 0) ? true : false;
}


/*
* Function builds banners timeline
*/
Creative.init = function() {

    Creative.tl.addLabel("reset", 0)
        
        // reset elements to initial states
        .call(resetBanner,[], "reset")
        

   
    .addLabel("frame01, frame02", getLabelTime(1))

        // show frame content
        .to([imgFrame01], {duration:_fadeInSpeed, alpha:1}, "frame01+="+_fadeOutSpeed)
        .to([copyFrame01a, copyFrame01b], {duration:_fadeInSpeed, alpha:1}, "frame01+="+(_fadeOutSpeed+_fadeInSpeed))

         .to([imgFrame02], {duration:_fadeInSpeed, alpha:1}, "frame02+="+_fadeOutSpeed)
         .to([copyFrame02a, copyFrame02b], {duration:_fadeInSpeed, alpha:1}, "frame02+="+(_fadeOutSpeed+_fadeInSpeed))

        // hide frame content
        .to([copyFrame01a, copyFrame01b], {duration:_fadeOutSpeed, alpha:0, overwrite:(_arrFrameWaits[1] <= _fadeOutSpeed+_fadeInSpeed) ? true:"auto"}, "frame01+="+_arrFrameWaits[1])
        .to([copyFrame02a, copyFrame02b], {duration:_fadeOutSpeed, alpha:0, overwrite:(_arrFrameWaits[1] <= _fadeOutSpeed+_fadeInSpeed) ? true:"auto"}, "frame02+="+_arrFrameWaits[1])



    .addLabel("end", "frame05+="+(_fadeOutSpeed+_fadeInSpeed+_fadeInSpeed))
        .call(bannerComplete, null, "end")


        // function adds to the timeline any tweens for the elements that can be turned on/off for each frame (logo,cta etc)
        // must be called here, after whole TL is defined but using the position value we actually call it right at start of playback
        .call(showHideBoolElements,[], "reset");


};


/*
* Function gets cumulative time for frame/labels
*/
function getLabelTime(frameIndex) {
    var totalTime = 0;

    var arrCumulativeTime = [];
    arrCumulativeTime.push(totalTime);

    for(var i= 0; i < _arrFrameWaits.length; i++)
    {
        totalTime += _arrFrameWaits[i];
        arrCumulativeTime.push(totalTime);
    }

    if(arrCumulativeTime.length > frameIndex)
    {
        return arrCumulativeTime[frameIndex];
    }
    else
    {
        return 0;
    }
}

/*
* Function adds to the timeline any tweens required to control the state
* of the objects that can be turned on/off for each frame (logo,cta etc).
*/
function showHideBoolElements() {
    
    var showSpeed;
    var showDelay;
    var hideSpeed;

    for(var i = 0; i < _arrFrameObjs.length; i ++)
    {
        for(var fIndex = 1; fIndex <= _totalFrames; fIndex++) 
        { 
            showSpeed = (fIndex > 1) ? _fadeInSpeed:2;
            showDelay = (fIndex > 1) ? _fadeOutSpeed:1;
            hideSpeed = (fIndex > 1) ? _fadeOutSpeed:0;

            var ifSkip = false;
            if(fIndex < _totalFrames) // if skipping a frame we need to not add tweens for it
            {
                if(_arrFrameWaits[fIndex-1] <= 0)
                {
                    ifSkip = true;
                }
            }

            var tlPos = getLabelTime(fIndex-1); // position in timeline at which to add the tween
            if(_arrFrameObjs[i].arrFrames[fIndex-1] === true) // if the element should be shown on a frame
            {
                if(_arrFrameObjs[i].ifShowing === false && ifSkip === false) // if not already showing add tween to show it
                {
                    Creative.tl
                        .to(_arrFrameObjs[i].eleRef, {duration:showSpeed, alpha:1, delay:showDelay}, tlPos);
                    _arrFrameObjs[i].ifShowing = true;
                }
            }
            else // if the element should not be shown on a frame
            {
                if(_arrFrameObjs[i].ifShowing === true && ifSkip === false) // if currently showing add tween to remove it
                {
                    Creative.tl
                        .to(_arrFrameObjs[i].eleRef, {duration:hideSpeed, alpha:0, delay:0}, tlPos);
                    _arrFrameObjs[i].ifShowing = false;
                }
            }
        }
    }
}



/**
 * function sets banner content to initial states
 */
function resetBanner() {
    //console.log("resetBanner()")

    btnReplay.style.display = "none";

    for(var i = 0; i < _arrFrameObjs.length; i ++)
    {
        _arrFrameObjs[i].ifShowing = false;
        gsap.set([_arrFrameObjs[i].eleRef], {alpha:0});
    }

    // reset frame content - rather than hiding individual elements, we hide all using one class:
    gsap.set(".hidden", {alpha:0});
}
