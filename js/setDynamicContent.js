// JS to set banners content to dynamic content loaded from DoubleClick

// create var to provide easy access to dynamic data
var _dynamicData = {};

/*
* Check Hoxton is ready to prevent race condition errors
*/
if (typeof hoxton != "undefined")
{
    //console.log("Hoxton ready!");
    hoxton.timeline = Creative.tl;

    // Define the function that should fire when the Ad Server is ready and assets are preloaded
    hoxton.isInitialized = checkSetDynamicContent;
}
else
{
    var checkHoxtonExists = setInterval(function() 
    {
        if (typeof hoxton != "undefined")
        {
            //console.log("Hoxton ready! Interval used!");
            clearInterval(checkHoxtonExists);

            hoxton.timeline = Creative.tl;

            // Define the function that should fire when the Ad Server is ready and assets are preloaded
            hoxton.isInitialized = checkSetDynamicContent;
            checkSetDynamicContent();// force call in case we missed call from hoxton.js
        }
    }, 100); // check every 100ms
}


var _setDynamicFired = false;
/*
* Function ensures setDynamicContent() is only called once
*/
function checkSetDynamicContent()
{
    if(_setDynamicFired === false)
    {
        setDynamicContent();
        _setDynamicFired = true;
    }
}


function setDynamicContent()
{
    //console.log("setDynamicContent()");

    // for shorthand references to state object
    _dynamicData = hoxton.getState();

    // set copy content - not needed due to DOM (as long as hoxtin.json var names match html ids)
    
    copyFrame01a.innerHTML = _dynamicData.copy_frame01a;
  
    copyFrame02a.innerHTML = _dynamicData.copy_frame02a;
    
    /*copyFrame03a.innerHTML = _dynamicData.copy_frame03a;
    copyFrame03b.innerHTML = _dynamicData.copy_frame03b;
    copyFrame04a.innerHTML = _dynamicData.copy_frame04a;
    copyFrame04b.innerHTML = _dynamicData.copy_frame04b;
    copyFrame05a.innerHTML = _dynamicData.copy_frame05a;
    copyFrame05b.innerHTML = _dynamicData.copy_frame05b;
    */

    // set any dynamic data that Hoxton can not update by targeting a DOM element                   
    setDynamicNonDomData();
    



    // SET AND LOAD ALL DYNAMIC IMAGES - note due to Safari not firing onload for images with same url we need to just colled the unique images
    var _allDynamicImages = [imgFrame01,imgFrame02, imgLogo, btnReplay];

    var _arrDynamicImagePaths = [_dynamicData.img_frame01,_dynamicData.img_frame02, _dynamicData.img_logo, _dynamicData.btn_replay];

    var _allDynamicImagesUnique = [];
    var _allDynamicImagePathsUnique = [];

    for(var k = 0; k <_arrDynamicImagePaths.length; k++)
    {
        if(_allDynamicImagePathsUnique.indexOf(_arrDynamicImagePaths[k]) === -1)
        {
            if(_arrDynamicImagePaths[k] != "images/noImage.png") // as this noImage will have already been loaded by html (safari gives issue if this is not checked for)
            {
                _allDynamicImagePathsUnique.push(_arrDynamicImagePaths[k]);
                _allDynamicImagesUnique.push(_allDynamicImages[k]);
            }
        }
    }

    var _numImagesLoaded = 0;
    for(var l = 0; l < _allDynamicImagesUnique.length; l++)
    {

        _allDynamicImagesUnique[l].onload = function()
        {
            _numImagesLoaded++;
            if(_numImagesLoaded === _allDynamicImagesUnique.length) // only once all images are loaded
            {
                // Start Ad
                startAd();
            }
        };
    }

    // set dynamic images
    
    imgFrame01.src = _dynamicData.img_frame01;
    imgFrame02.src = _dynamicData.img_frame02;
    imgLogo.src = _dynamicData.img_logo;
    btnReplay.src = _dynamicData.btn_replay;
}



/*
* Set any dynamic data that Hoxton can not update by targeting a DOM element
*/                               
function setDynamicNonDomData()
{
    // set frame timimgs
    setFrameTimes();

    // set general banner fade in and out speeds
    _fadeInSpeed = Number(_dynamicData.fadeInSpeed);
    _fadeOutSpeed = Number(_dynamicData.fadeOutSpeed);

     // create array of objects to define when to show cta's and logos
    _arrLogoFrames = getBoolArrayData(_arrLogoFrames, _dynamicData.logoFrames);
    _arrFrameObjs.push({eleRef:logoContainer, arrFrames:_arrLogoFrames, ifShowing:false});
    _arrCtaFrames = getBoolArrayData(_arrCtaFrames, _dynamicData.ctaFrames);
    _arrFrameObjs.push({eleRef:cta_container, arrFrames:_arrCtaFrames, ifShowing:false});


    // update copy alignment (only really needed on 300x250 and 336x280)
    for(var j = 1; j <= _totalFrames; j++)
    {
        switch(_dynamicData["align_copy_frame0"+j+"a"])
        {
            case "top":
                getById("copy_frame0"+j+"a").classList.remove("copy-align-bottom");
                getById("copy_frame0"+j+"a").classList.add("copy-align-top");
                break;

            case "bottom":
                getById("copy_frame0"+j+"a").classList.remove("copy-align-top");
                getById("copy_frame0"+j+"a").classList.add("copy-align-bottom");
                break;

            default:
        }
    }

    // set exit url
    _exitURL = _dynamicData.exit_url;

    // set looping props
    var arrLooping = _dynamicData.loopingProps.split(",");
    if(arrLooping.length === 3)
    {
        _totalLoops = Number(arrLooping[0].trim());
        _endFrameDelay = Number(arrLooping[1].trim());
        if(arrLooping[2].trim() === "true")
        {
            _useReplayBtn = true;
        }
        else
        {
            _useReplayBtn = false;
        }
    }

}




/*
* For content in your creative that Hoxton can not update by targeting a DOM element
* use this function to manually refresh and have control over the display when working in Hoxton.
*/
Creative.updateContent = function (item) {
    
    console.log("Creative.updateContent");

    //hoxton.setState(item);
    _dynamicData = hoxton.getState();

    setDynamicNonDomData(); // update data


    var ifNeedsRebuilt = false; // if we need to rebuild the timeline
    var ifRebuiltButContinuePlayback = false; // if we need to rebuild the timeline and resume at same position

    switch(item.name)
    {
        case "logoFrames":
        case "ctaFrames":
        case "frameTimes":
            ifNeedsRebuilt = true;
            ifRebuiltButContinuePlayback = false;
            break;

        case "fadeInSpeed":
        case "fadeOutSpeed":
            ifRebuiltButContinuePlayback = true;
            ifNeedsRebuilt = false;
            break;

        default:
        ifRebuiltButContinuePlayback = ifNeedsRebuilt = false;
    }


    // If we need to renuild the timeline to refresh the updates in Hoxton
    if(ifNeedsRebuilt === true && hoxton.timeline.time() > 0.1)
    {   
        /* 
        // ORIGINAL SOLUTION
        //console.log("rebuild timeline");
        Creative.tl.clear(); // clear timline
        Creative.init(); // rebuild timeline
        Creative.tl.seek("frame01");
        Creative.tl.play();
        */

        // SELDA'S SOLUTION
        debounceRate = 1000;
        if (hoxton.timer) { clearTimeout(hoxton.timer) }
        hoxton.timer = setTimeout(function () { window.location.reload() }, debounceRate)


    } else if(ifRebuiltButContinuePlayback === true && hoxton.timeline.time() > 0.1){

        // if values are changed that require the TL to be rebuilt but we dont want to skip back to TL start point,
        // instead continue playback from the playhead position at time of edit:
        
        var currPlayheadPos = Creative.tl.time();
        Creative.tl.clear(); // clear timline
        Creative.init(); // rebuild timeline
        Creative.tl.time(currPlayheadPos);
        Creative.tl.play();
    }

}


/*
* Function sets the frame times for the banner. Frames with a time of 0 will be skipped.
* Any frame with no content will have its time set to 0 despite the value for the frame in the frameTime array
*/
function setFrameTimes() {

    var arrFrameWaits = _dynamicData.frameTimes.split(",");
    if(arrFrameWaits.length === _arrFrameWaits.length)
    {
        for(var j = 0; j < _arrFrameWaits.length; j++)
        {
            _arrFrameWaits[j] = Number(arrFrameWaits[j].trim());
        }
    }
}




/*
* function gets the contents of an numeric array
*/
function getNumArrayData(arrTarget, strSource)
{
    var arr = strSource.split(",");

    if(arr.length === arrTarget.length)
    {
        for(var i = 0 ; i < arr.length; i++)
        {
            arr[i] = Number(arr[i].trim());
        }

        arrTarget = arr;
    }

    return arrTarget;
}


/*
* function gets the contents of an boolean array
*/
function getBoolArrayData(arrTarget, strSource)
{
    var arr = strSource.split(",");

    if(arr.length === arrTarget.length)
    {
        for(var i = 0 ; i < arr.length; i++)
        {
            if(arr[i].trim() == "true")
            {
                arr[i] = true;
            }
            else
            {
                arr[i] = false;
            }
        }
        arrTarget = arr;
    }

    return arrTarget;
}

/*
* function checks if number
*/
function isNumeric(n)
{
    return !isNaN(parseFloat(n)) && isFinite(n);
}


