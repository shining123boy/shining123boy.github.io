var winH, footH, diffH = 0,
    msgArr = [],
    i = 0,saw,
    myScroll, sound = document.getElementById('sound'),
    video, replyHtml;


window.onload = function() {
    showDateTime();
    winH = $(window).height();
    // 视口高度
    footH = $('.footer').height();
    $("#main").height(winH - footH - 10);

    myScroll = new IScroll('#main', {
        preventDefault: false,
    });
    document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
}

function showDateTime() {
    setTimeout(function() {
        var dateTime = '<div><span class="text-bg date-time">2017年5月20日 10:50:41</span></div>';
        $('#content').append(dateTime);
        setTimeout(function() {
            var addFinished = '<div class="text-bg add-finish-tip">你已经添加了欧弟，现在可以聊天了</div>';
            $('#content').append(addFinished);
            readyChat();
        }, 800);
    }, 500);
}


function readyChat() {
    // 1.欧弟：萨瓦迪卡！我是欧弟，我现在在泰国～～泰国好美啊
    $.get("json/msg_list.json", function(d) {
        msgArr = d.wordList;
        startChat();
    });

}

function startChat() {
    var msgReplyFriendArr = [],
        msgReplyMyArr = [];
    var randomTime = Math.floor(Math.random() * 1000) + 2000;
    // console.log('randomTime', randomTime);
    var msgTimer = setInterval(function() {
        // 发完
        // console.log(i, msgArr[i]);
        if (!msgArr[i]) {
            //console.log('over', msgArr[i]);
            clearInterval(msgTimer);
            return;
        }
        showMsg(msgArr[i]);
        // 场景
        var msgReplyChoice = msgArr[i].msg_reply_choice;
        var msgType = msgArr[i].msg_type;
        //对话
        //console.log(msgReplyChoice)
        if (msgReplyChoice) {
            msgReplyMyArr = msgArr[i].msg_reply;
            //console.log('对话', msgReplyMyArr);
            if (msgReplyMyArr && msgReplyMyArr.length > 0) {
                $('#pop-box').empty();
                // 弹出选项 
                replyHtml = '';
                for (var j = 0, len = msgReplyMyArr.length; j < len; j++) {
                    // 都是文本消息
                    //text = emoji(text);
                    if (j == 0) {
                        replyHtml += '<div data-id="' + j + '" class="btn active">' + emoji(msgReplyMyArr[j].msg_content) + '</div>'; //;
                    } else {
                        replyHtml += '<div data-id="' + j + '" class="btn ">' + emoji(msgReplyMyArr[j].msg_content) + '</div>'; //;
                    }
                }
                // console.log(replyHtml);
                $('#pop-box').append(replyHtml);
                if (msgType != 3) {
                    showPopup();
                    //
                }

                popH = $('#pop-box').height();
                //console.log('popH', popH);

                $('#pop-box .btn').on('touchstart', function() {
                    var contentPreH = $('#content').css('height');

                    var id = $(this).attr('data-id');
                    var myTextHtml = myText(msgReplyMyArr[id].msg_content);
                    $('#pop-box').removeClass('pop-up');
                    $('#content').append(myTextHtml);
                    
                    scrollTop();

                    msgReplyFriendArr = msgReplyMyArr[id].msg_reply;
                    setTimeout(function() {
                        showMsg(msgReplyFriendArr[0]);
                        i++;
                        startChat();
                    }, 1000);
                    $(this).unbind();

                })
            }
            clearInterval(msgTimer);
        } else {
            i++;
        }
    }, randomTime);

}

function showMsg(msgObj) {
    var contentPreH = $('#content').css('height');
    // 发消息的人
    var msgFrom = msgObj.msg_from;
    // 消息类型 1文本 2图片 3视频
    var msgType = msgObj.msg_type;

    var html = '';
    if (msgFrom == 1) {
        if (msgType == 1) {
            var msgContent = msgObj.msg_content;
            html = friendText(msgContent);
        } else if (msgType == 3) {

            html = friendVideo(msgObj);
        } else if (msgType == 2) {
            var msgImg = msgObj.msg_img;
            html = friendImg(msgImg);
        }
    }
    // 消息语音
    $('#content').append(html);

    scrollTop();
    setTimeout(function() {
        sound.play();
    }, 100)

    if (msgType == 3) {
        $('.box-video').on('click', function() {
            var img = $(this).children().get(0);
            var videoSrc = $(this).attr('data-src');
            $('.full-img').attr('src', img.src);
            $('.full-video').attr('src', videoSrc);
            $('.full-video').attr('poster', img.src);
            // console.log(videoSrc);
            // $('.full-img').css({'transform':'scale(.674)'});

            $('.full-box').show();
            video = document.getElementById('full_video');
            video.play();
        });
        $('.close').on('touchstart', function() {
            $('.full-box').hide();
            video.pause();
            if ($('.box-video').attr('data-src').indexOf('video1') != -1) {
                //saw
                //var isPlayed = sessionStorage.getItem('video-1');
                // console.log($('.box-video').attr('data-src'),isPlayed);
                if(saw){
                    return;
                }
                showPopup();
                // sessionStorage.setItem('video-1', 1);
                saw = true;
            }
            // video.src = '';
            // 弹出选择
            showPopup();
        })
    }
}

function showPopup() {
    $('#pop-box').addClass('pop-up');
}
function scrollTop(){
    setTimeout(function() {
        myScroll.refresh();
        var curH = $('#content').height();
        var cliH = winH - footH - 10;
        var diffH = curH - cliH;
        if (curH > cliH) {
            myScroll.scrollTo(0, -diffH, 300);
        }
    }, 0);
}
function showInput() {
    var input = document.getElementById('input');
    input.onfocus = function() {
        setTimeout(function() {
            input.scrollIntoView(true);
        }, 100);
    }
}

function friendText(text) {
    // 处理表情gif
    text = emoji(text);
    return '<div class="box friend-box">' +
        '<img src="http://7xot92.com1.z0.glb.clouddn.com/oudi.jpg" alt="" class="box-avatar friend-avatar">' +
        '<div class="friend-text box-content">' + text + '</div>' +
        '</div>';
}

function friendImg(src) {
    var imgClass = src.indexOf('gif') == -1 ? 'img-redbag' : 'img-gif';
    return '<div class="box friend-box">' +
        '<img src="http://7xot92.com1.z0.glb.clouddn.com/oudi.jpg" alt="" class="box-avatar friend-avatar">' +
        '<div class="box-img "><img src="' + src + '" alt="" class="friend-img ' + imgClass + '"></div>' +
        '</div>';
}

function friendVideo(msgObj) {
    var msgVideoCover = msgObj.msg_video_cover;
    var msgVideoSrc = msgObj.msg_video_src;
    return '<div class="box friend-box">' +
        '<img src="http://7xot92.com1.z0.glb.clouddn.com/oudi.jpg" alt="" class="box-avatar friend-avatar">' +
        '<div class="box-video" data-src="' + msgVideoSrc + '">' +
        '<img src="' + msgVideoCover + '" alt="" class="video-cover">' +
        '<img src="http://7xot92.com1.z0.glb.clouddn.com/play_btn.png" alt="" class="video-play-btn">' +
        '</div>' +
        '</div>';
}

function myText(text) {
    // 处理表情gif
    text = emoji(text);
    return '<div class="box my-box">' +
        '<img src="http://7xot92.com1.z0.glb.clouddn.com/avatar.jpg" alt="" class="box-avatar my-avatar">' +
        '<div class="my-text box-content">' + text + '</div>' +
        '</div>';
}
function emoji(text){
    // console.log(text);
    var reg = /emoji(\d+)/g;
    var result = reg.exec(text);
    if(result && result.length>0){
        var index = result[1];
        var pos = fixedPos(index);
        var eHtml = '<i class="emoji" style="background-position:0 -'+pos+'rem"></i>';
        text = text.replace(reg, eHtml);
    }
    return text;
}
/*自动播放*/
function fixedPos(index){
    var pos = 0;
    if(index==5) return 4.3;
    if(index==4) return 3.45;
    if(index==3) return 2.6;
    if(index==2) return 1.75;
    if(index==1) return 0.9;
    if(index==0) return 0;
    return pos;
}

function musicInWeixinHandler() {
    // 一般浏览器
    sound.play();
    document.addEventListener("WeixinJSBridgeReady", function() {
        // 微信浏览器
        sound.load();
    }, false);
    document.removeEventListener('DOMContentLoaded', musicInWeixinHandler);
}
document.addEventListener('DOMContentLoaded', musicInWeixinHandler);
