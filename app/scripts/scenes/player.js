$(function () {

    //shortcuts for controls
    var $progress = $('.progress'),
        $progressBar = $('.progress-bar'),
        $currentTime = $('.current-time'),
        $pausePlayButton = $('.button_play_pause'),
        $duration = $('.duration'),
        $player = $('.player');


    // hide player buttons each 7 seconds inactivity
    var $time = 0,
        isShown = false,
        isPlaying = false;

    function showPlayer(){
        if(!isShown) $player.show();
        isShown = true;
        if($time <= 0)
            setTimeout(timer, 1000);
        $time = 7;
    }
    function hidePlayer(){
        if(isShown) $player.hide();
        isShown = false;
    }
    function timer(){
        if(isShown){
            $time--;
        
            if($time <= 0){
                hidePlayer();
            }else{
            setTimeout(timer, 1000);
            }
        }
    }
    $(document).mousemove(function(e){
        if(isPlaying){
            if(e.pageY > 620) showPlayer();
        }
    });


    //set progress bar position while video playing
    Player.on("update", function () {
        if(isShown || isPlaying){
            var currentTime = Player.videoInfo.currentTime;
            $progressBar.css({
                width: currentTime / Player.videoInfo.duration * 100 + "%"
            });
            $currentTime.html(Player.formatTime(currentTime));
        }
    });

    //after player reads stream info duration indicator needs refresh
    Player.on("ready", function () {
        $currentTime.html(Player.formatTime(0));
        $duration.html(Player.formatTime(Player.videoInfo.duration));
        isPlaying = true;
        $pausePlayButton.find('.fa').removeClass('fa-play');
        $pausePlayButton.find('.fa').addClass('fa-pause');
    });

    //rewind to start after complete
    Player.on("complete", function () {
        Player.seek(0);
        $progressBar.css({
            width: 0
        });
        $pausePlayButton.find('.fa').removeClass("fa-pause");
        showPlayer();
    });

    //handle click on progress bar
    var progressOffset = $progress.offset().left;
    var progressWidth = $progress.width();
    $progress.click(function (e) {
        var x = e.pageX - progressOffset;
        Player.seek(Player.videoInfo.duration * (x / progressWidth));
        showPlayer();
    });


    $pausePlayButton.click(function () {
        Player.togglePause();
        if(Player.state === 'pause'){
            $pausePlayButton.find('.fa').addClass('fa-play');
            $pausePlayButton.find('.fa').removeClass('fa-pause');
        }else if(Player.state === 'play'){
            $pausePlayButton.find('.fa').addClass('fa-pause');
            $pausePlayButton.find('.fa').removeClass('fa-play');
        }
        showPlayer();
    });


    //jump backward to 10 seconds
    $('.button_rw').click(function () {
        showPlayer();
        Player.seek(Player.videoInfo.currentTime - 10);
    });

    //jump forward to 10 seconds
    $('.button_ff').click(function () {
        showPlayer();
        Player.seek(Player.videoInfo.currentTime + 10);
    });

    $('.button_compress').click(function(){
        isPlaying = false;
        $pausePlayButton.find('.fa').removeClass("fa-pause");
        
        App.toggleView();
    });

    $('.btn').on('nav_focus', function(){
        isPlaying = true;
    });

    $('body').on('nav_key', function(){
        if(isPlaying){
            showPlayer();
        
            if(Player.state === 'pause'){
                $pausePlayButton.find('.fa').addClass('fa-play');
                $pausePlayButton.find('.fa').removeClass('fa-pause');
            }else if(Player.state === 'play'){
                $pausePlayButton.find('.fa').addClass('fa-pause');
                $pausePlayButton.find('.fa').removeClass('fa-play');
            }
        }
    });
});