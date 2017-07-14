$(function() {
    // 防止全局污染，可能对页面上的其他 js 代码造成冲突
    var winH, footH,
        msgArr = [],
        i = 0,
        saw, myScroll,
        sound = document.getElementById('sound'),
        popBox = document.getElementById('pop-box'),
        video, replyHtml, msgTimer, msgReplyFriendArr = [],
        msgReplyMyArr = [];

    window.onload = function() {
        // 视口高度
        winH = $(window).height();
        footH = $('.footer').height();
        $("#main").height(winH - footH - 10);
        showDateTime();
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
        $.get("json/msg_list.json", function(d) {
            msgArr = d.wordList;
            startChat();
        });
    }

    function startChat() {
        var randomTime = Math.floor(Math.random() * 1000) + 2000;

        msgTimer = setInterval(function() {
            // 发完
            if (!msgArr[i]) {
                clearInterval(msgTimer);
                return;
            }
            showMsg(msgArr[i]);
            // 场景
            var msgReplyChoice = msgArr[i].msg_reply_choice;
            var msgType = msgArr[i].msg_type;
            //对话
            if (msgReplyChoice) {
                msgReplyMyArr = msgArr[i].msg_reply;
                if (msgReplyMyArr && msgReplyMyArr.length > 0) {
                    $('#pop-box').empty();
                    // 弹出选项 
                    replyHtml = myChoiceHTML(msgReplyMyArr);
                    $('#pop-box').append(replyHtml);
                    if (msgType != 3) {
                        setTimeout(function() {
                            showPopup();
                        }, 2400);
                    }
                }
                clearInterval(msgTimer);
            } else {
                i++;
            }
        }, randomTime);

    }
    // delegate live 效果等价，不能阻止冒泡
    popBox.addEventListener('click', function(evt) {
        var id = evt.target.getAttribute('data-id');
        if (id == null) {
            return;
        }
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
    }, true);

    function showMsg(msgObj) {
        var contentPreH = $('#content').css('height');
        // 发消息的人
        var msgFrom = msgObj.msg_from;
        // 消息类型 1文本 2图片 3视频
        var msgType = msgObj.msg_type;

        var html = '';
        if (msgFrom == 1) {
            if (msgType == 3) {
                clearInterval(msgTimer);
            }
            html = friendMsg(msgObj);
        }
        // 消息语音
        $('#content').append(html);

        scrollTop();
        setTimeout(function() {
            sound.play();
        }, 100)
    }

    $('.box-video').live('click', function() {
        var img = $(this).children().get(0);
        var videoSrc = $(this).attr('data-src');
        video = document.getElementById('full_video');
        if (video != null) {
            $('.full-video').attr('src', videoSrc);
            $('.full-video').attr('poster', img.src);
        } else {
            $('.full-box').append('<video src="' + videoSrc + '" poster="' + img.src + '" controls preload="auto" class="full-video" id="full_video"></video>');
            video = document.getElementById('full_video');
        }
        $('.full-box').show();
        video.play();
    });

    $('.close').on('click', function() {
        $('.full-box').hide();
        video.pause();
        var dataSrc = $('.full-video').attr('src');
        // console.log(dataSrc);
        if (dataSrc.indexOf('video1') != -1) {
            if (saw) {
                return;
            }
            setTimeout(function() {
                showPopup();
            }, 100);
            saw = true;
        } else {
            startChat();
        }
    })

    function showPopup() {
        $('#pop-box').addClass('pop-up');
    }

    function scrollTop() {
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

    function friendMsg(msgObj) {
        // 消息类型解耦
        var msgType = msgObj.msg_type;
        var html = '<div class="box friend-box"><img src="http://7xot92.com1.z0.glb.clouddn.com/oudi.jpg" alt="" class="box-avatar friend-avatar">';
        if (msgType == 1) {
            text = emoji(msgObj.msg_content);
            html += '<div class="friend-text box-content">' + text + '</div></div>';
        } else if (msgType == 2) {
            var imgClass = msgObj.msg_img.indexOf('gif') == -1 ? 'img-redbag' : 'img-gif';
            html += '<div class="box-img "><img src="' + msgObj.msg_img + '" alt="" class="friend-img ' + imgClass + '"></div></div>';
        } else {
            var msgVideoSrc = msgObj.msg_video_src;
            var msgVideoCover = msgObj.msg_video_cover;
            html += '<div class="box-video" data-src="' + msgVideoSrc + '">' +
                '<img src="' + msgVideoCover + '" alt="" class="video-cover">' +
                '<img src="http://7xot92.com1.z0.glb.clouddn.com/play_btn.png" alt="" class="video-play-btn">' +
                '</div>' +
                '</div>';
        }
        return html;
    }

    function myText(text) {
        // 处理表情gif
        text = emoji(text);
        return '<div class="box my-box">' +
            '<img src="http://7xot92.com1.z0.glb.clouddn.com/avatar.jpg" alt="" class="box-avatar my-avatar">' +
            '<div class="my-text box-content">' + text + '</div>' +
            '</div>';
    }

    function myChoiceHTML(arr) {
        var replyHtml = '';
        for (var j = 0, len = arr.length; j < len; j++) {
            // 都是文本消息
            //text = emoji(text);
            if (j == 0) {
                replyHtml += '<div data-id="' + j + '" class="btn active">' + emoji(arr[j].msg_content) + '</div>'; //;
            } else {
                replyHtml += '<div data-id="' + j + '" class="btn ">' + emoji(arr[j].msg_content) + '</div>'; //;
            }
        }
        return replyHtml;
    }

    function emoji(text) {
        // console.log(text);
        var reg = /emoji(\d+)/g;
        var result = reg.exec(text);
        if (result && result.length > 0) {
            var index = result[1];
            var pos = fixedPos(index);
            var eHtml = '<i class="emoji" style="background-position:0 -' + pos + 'rem"></i>';
            text = text.replace(reg, eHtml);
        }
        return text;
    }
    /*自动播放*/
    function fixedPos(index) {
        var pos = 0;
        if (index == 5) return 4.3;
        if (index == 4) return 3.45;
        if (index == 3) return 2.6;
        if (index == 2) return 1.75;
        if (index == 1) return 0.9;
        if (index == 0) return 0;
        return pos;
    }
})

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
