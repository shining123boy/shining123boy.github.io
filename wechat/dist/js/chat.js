function showDateTime(){setTimeout(function(){$("#content").append('<div><span class="text-bg date-time">2017年5月20日 10:50:41</span></div>'),setTimeout(function(){$("#content").append('<div class="text-bg add-finish-tip">你已经添加了欧弟，现在可以聊天了</div>'),readyChat()},800)},500)}function readyChat(){$.get("json/msg_list.json",function(t){msgArr=t.wordList,startChat()})}function startChat(){var t=[],o=[],e=Math.floor(1e3*Math.random())+2e3;msgTimer=setInterval(function(){if(msgArr[i]){showMsg(msgArr[i]);var e=msgArr[i].msg_reply_choice,n=msgArr[i].msg_type;if(e){if((o=msgArr[i].msg_reply)&&o.length>0){$("#pop-box").empty(),replyHtml="";for(var s=0,r=o.length;s<r;s++)replyHtml+=0==s?'<div data-id="'+s+'" class="btn active">'+emoji(o[s].msg_content)+"</div>":'<div data-id="'+s+'" class="btn ">'+emoji(o[s].msg_content)+"</div>";$("#pop-box").append(replyHtml),3!=n&&setTimeout(function(){showPopup()},2400),popH=$("#pop-box").height(),$("#pop-box .btn").on("touchstart",function(){$("#content").css("height");var e=$(this).attr("data-id"),n=myText(o[e].msg_content);$("#pop-box").removeClass("pop-up"),$("#content").append(n),scrollTop(),t=o[e].msg_reply,setTimeout(function(){showMsg(t[0]),i++,startChat()},1e3),$(this).unbind()})}clearInterval(msgTimer)}else i++}else clearInterval(msgTimer)},e)}function showMsg(t){$("#content").css("height");var o=t.msg_from,e=t.msg_type,i="";1==o&&(1==e?i=friendText(t.msg_content):3==e?(i=friendVideo(t),clearInterval(msgTimer)):2==e&&(i=friendImg(t.msg_img))),$("#content").append(i),scrollTop(),setTimeout(function(){sound.play()},100),3==e&&$(".box-video").on("click",function(){var t=$(this).children().get(0),o=$(this).attr("data-src");$(".full-img").attr("src",t.src),$(".full-video").attr("src",o),$(".full-video").attr("poster",t.src),$(".full-box").show(),(video=document.getElementById("full_video")).play()})}function showPopup(){$("#pop-box").addClass("pop-up")}function scrollTop(){setTimeout(function(){myScroll.refresh();var t=$("#content").height(),o=winH-footH-10,e=t-o;t>o&&myScroll.scrollTo(0,-e,300)},0)}function showInput(){var t=document.getElementById("input");t.onfocus=function(){setTimeout(function(){t.scrollIntoView(!0)},100)}}function friendText(t){return'<div class="box friend-box"><img src="http://7xot92.com1.z0.glb.clouddn.com/oudi.jpg" alt="" class="box-avatar friend-avatar"><div class="friend-text box-content">'+(t=emoji(t))+"</div></div>"}function friendImg(t){return'<div class="box friend-box"><img src="http://7xot92.com1.z0.glb.clouddn.com/oudi.jpg" alt="" class="box-avatar friend-avatar"><div class="box-img "><img src="'+t+'" alt="" class="friend-img '+(-1==t.indexOf("gif")?"img-redbag":"img-gif")+'"></div></div>'}function friendVideo(t){var o=t.msg_video_cover;return'<div class="box friend-box"><img src="http://7xot92.com1.z0.glb.clouddn.com/oudi.jpg" alt="" class="box-avatar friend-avatar"><div class="box-video" data-src="'+t.msg_video_src+'"><img src="'+o+'" alt="" class="video-cover"><img src="http://7xot92.com1.z0.glb.clouddn.com/play_btn.png" alt="" class="video-play-btn"></div></div>'}function myText(t){return'<div class="box my-box"><img src="http://7xot92.com1.z0.glb.clouddn.com/avatar.jpg" alt="" class="box-avatar my-avatar"><div class="my-text box-content">'+(t=emoji(t))+"</div></div>"}function emoji(t){var o=/emoji(\d+)/g,e=o.exec(t);if(e&&e.length>0){var i='<i class="emoji" style="background-position:0 -'+fixedPos(e[1])+'rem"></i>';t=t.replace(o,i)}return t}function fixedPos(t){return 5==t?4.3:4==t?3.45:3==t?2.6:2==t?1.75:1==t?.9:0}function musicInWeixinHandler(){sound.play(),document.addEventListener("WeixinJSBridgeReady",function(){sound.load()},!1),document.removeEventListener("DOMContentLoaded",musicInWeixinHandler)}var winH,footH,diffH=0,msgArr=[],i=0,saw,myScroll,sound=document.getElementById("sound"),video,replyHtml,msgTimer;window.onload=function(){showDateTime(),winH=$(window).height(),footH=$(".footer").height(),$("#main").height(winH-footH-10),myScroll=new IScroll("#main",{preventDefault:!1}),document.addEventListener("touchmove",function(t){t.preventDefault()},!1)},$(".close").on("click",function(){if($(".full-box").hide(),video.pause(),-1!=$(".full-video").attr("src").indexOf("video1")){if(saw)return;setTimeout(function(){showPopup()},100),saw=!0}else startChat()}),document.addEventListener("DOMContentLoaded",musicInWeixinHandler);