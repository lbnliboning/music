/*
 * powered by liuxiaodong
 * 
 * 注：
 * 1、由于chrome中不允许自动播放，请不要在加载完页面后马上调用play方法
 * 2、由于会删除列表中播放失败的歌曲，list中元素的下标可能会改变
 */
(function(){
	//当前页面所有的Audio对象
	var audios={};
	//播放按钮
	var playSvg='<path fill="#FFFFFF" fill-rule="evenodd" d="M5,21 L5,3 C5,2.20883421 5.87524596,1.73099262 6.54075759,2.15882152 L20.5407576,11.1588215 C21.1530808,11.5524579 21.1530808,12.4475421 20.5407576,12.8411785 L6.54075759,21.8411785 C5.87524596,22.2690074 5,21.7911658 5,21 Z M7,19.1683345 L18.1507426,12 L7,4.8316655 L7,19.1683345 Z"/>';
    //暂停按钮
    var pauseSvg='<path fill="#FFFFFF" fill-rule="evenodd" d="M7,2 L9,2 C10.1045695,2 11,2.8954305 11,4 L11,20 C11,21.1045695 10.1045695,22 9,22 L7,22 C5.8954305,22 5,21.1045695 5,20 L5,4 C5,2.8954305 5.8954305,2 7,2 Z M15,2 L17,2 C18.1045695,2 19,2.8954305 19,4 L19,20 C19,21.1045695 18.1045695,22 17,22 L15,22 C13.8954305,22 13,21.1045695 13,20 L13,4 C13,2.8954305 13.8954305,2 15,2 Z M7,4 L7,20 L9,20 L9,4 L7,4 Z M15,4 L15,20 L17,20 L17,4 L15,4 Z"/>';
	//下一首按钮
	var nextSvg='<path fill="#FFFFFF" fill-rule="evenodd" d="M4,21 L4,3 C4,2.17595468 4.94076375,1.70557281 5.6,2.2 L17.6,11.2 C18.1333333,11.6 18.1333333,12.4 17.6,12.8 L5.6,21.8 C4.94076375,22.2944272 4,21.8240453 4,21 Z M6,19 L15.3333333,12 L6,5 L6,19 Z M20,22 L18,22 L18,2 L20,2 L20,22 Z"/>';
	
	
    Audio = function(options) {
    	var $this=this;
    	$this._options={
			top:"",//顶部距离
			right:"",//右侧距离
			bottom:"",//底部距离
			left:"",//左侧距离
			id:"audio",//选择元素的id
			bg:"res/audio_bg.jpg",//默认背景
			pause:true,
			nextFn:function(obj){obj.play(obj.index+=1);},//点击下一曲事件
			endFn:function(obj){obj.play(obj.index+=1);},//播放完成事件
			list:[
				'res/01.mp3',//只传入链接地址
				{
					name:"dream it possible",//文件名称
					src:'res/02.mp3',//链接地址
					bg:"res/02.jpg"//背景图
				}
			]//播放列表，支持字符串和对象两种格式
		};
		//当前播放列表中的音乐下标
		$this.index=0;
    	//参数合并
        $.extend($this._options, options);
        var list=$this._options.list;
        for(var i in list){
        	if(typeof(list[i])=="string"){
        		var src=list[i];
        		list[i]={};
        		list[i].src=src;
        	}
        	if(!list[i].name){
    			var audio_src=list[i].src.replace("\\","/");
    			filename=decodeURI(audio_src.substring(audio_src.lastIndexOf("/")+1));
    			list[i].name=filename;
    		}
        }
        //存入数组
        audios[$this._options.id]=$this;
        //初始化界面
        var audioHtml="";
			audioHtml+='<div class="audio_filter"></div>                                                                                                                                                                                                                                                                                                                      ';
			audioHtml+='<div class="audio_content">                                                                                                                                                                                                                                                                                                                           ';
			audioHtml+='	<div class="audio_btn">                                                                                                                                                                                                                                                                                                                           ';
			audioHtml+='		<svg class="audio_play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">                                                                                                                                                                                                                                                               ';
			audioHtml+=playSvg;
			audioHtml+='		</svg>                                                                                                                                                                                                                                                                                                                                        ';
			audioHtml+='		<svg class="audio_next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">                                                                                                                                                                                                                                                               ';
			audioHtml+=nextSvg;
			audioHtml+='		</svg>                                                                                                                                                                                                                                                                                                                                        ';
			audioHtml+='	</div>                                                                                                                                                                                                                                                                                                                                            ';
			audioHtml+='	<div class="audio_info">                                                                                                                                                                                                                                                                                                                          ';
			audioHtml+='		<div class="audio_name">歌曲</div>                                                                                                                                                                                                                                                                                                  ';
			audioHtml+='		<div class="audio_time">--:--/--:--</div>                                                                                                                                                                                                                                                                                                   ';
			audioHtml+='	</div>                                                                                                                                                                                                                                                                                                                                            ';
			audioHtml+='	<audio class="audioCtl" src="'+$this._options.list[$this.index].src+'"></audio>                                                                                                                                                                                                                                                                                                 ';
			audioHtml+='</div>                                                                                                                                                                                                                                                                                                                                                ';
			var content=$("#"+$this._options.id);
			content.addClass("audio").html(audioHtml);
			$(".audio_filter")
			.css("-o-transition","all 3s ease 0s")
			.css("-ms-transition","all 3s ease 0s")
			.css("-moz-transition","all 3s ease 0s")
			.css("-webkit-transition","all 3s ease 0s")
			.css("transition","all 3s ease 0s");
			var bg=$this._options.bg;
			if($this._options.list[$this.index].bg){
				bg=$this._options.list[$this.index].bg;
			}
			content.find(".audio_filter").css("background-image","url("+bg+")");
			//初始化位置
			if($this._options.top){
				content.css("top",$this._options.top);
			}
			if($this._options.right){
				content.css("right",$this._options.right);
			}
			if($this._options.bottom){
				content.css("bottom",$this._options.bottom);
			}
			if($this._options.left){
				content.css("left",$this._options.left);
			}
        //H5音乐控制器
        $this.audioCtl=$("#"+$this._options.id).find(".audioCtl")[0];
        //播放完成一首歌后的操作
        $this.audioCtl.onended=function(){
        	$(this).parents(".audio").find(".audio_time").text("--:--/--:--");
        	$this._options.endFn($this);
        }
        //错误处理
        $this.audioCtl.onerror=function(){
        	//在列表中删除该文件
        	$this._options.list.splice($this.index,1);
        	//是否第一次加载
        	var isfirst=true;
        	if($this.index!=0){
        		isfirst=false;
        	}
        	//若是最后一个文件，直接播放第一首
        	if($this.index==$this._options.list.length){
        		$this.index=0;
        	}
        	//如果一开始加载就出错，不播放
        	if(!isfirst){
				$this.play($this.index);
        	}
        }
        //初始化进度显示
        setInterval(function(){
        	if(!$this.audioCtl.ended){//避免获取歌曲失败时，时间显示NAN:NAN
        		//歌曲总时间
        		var dur=Math.round($this.audioCtl.duration);
        		var dur_sec=dur%60<10?"0"+dur%60:dur%60;
        		var dur_time=Math.floor(dur/60)+":"+dur_sec;
        		//当前时间
        		var cur=Math.round($this.audioCtl.currentTime);
        		var cur_sec=cur%60<10?"0"+cur%60:cur%60;
        		var cur_time=Math.floor(cur/60)+":"+cur_sec;
        		
        		$("#"+$this._options.id).find(".audio_time").html(cur_time+"/"+dur_time);
        	}
        },1000)
        //播放/暂停按钮绑定事件
        $("#"+$this._options.id).find(".audio_play").click(function(){
        	var id=$(this).parents(".audio").attr("id");
        	audios[id].play();
        })
        //下一首按钮绑定事件
        $("#"+$this._options.id).find(".audio_next").click(function(){
        	var id=$(this).parents(".audio").attr("id");
        	audios[id].next();
        })
        
    }
    //播放/暂停逻辑处理
    Audio.prototype.play = function(n) {
    	var $this=this;
    	var index=n;//默认传入的是下标
    	if(typeof(n)=="string"){//传入的是名称
    		var list=$this._options.list;
    		for(var i=0;i<list.length;i++){
    			if(list[i].name.toLowerCase()==name.toLowerCase()){
    				index=i;
    				break;
    			}
    		}
    		if(typeof(index)!="number"){
    			alert("未找到要播放的文件");
    			return;
    		}
    	}
    	//检测是否载入完成
    	var looper=setInterval(function(){
    		if($this.audioCtl){
    			//清除循环
    			if(looper){
    				clearInterval(looper);
    			}
    			if(!$this.audioCtl.src){
    				index=0;
    			}
    			//若传入index，则播放对应的曲目
    			if(index!=null){
	    			$this.index=index=index%$this._options.list.length;
	    			$this.audioCtl.src=$this._options.list[$this.index].src;
	    			//歌曲名称
	    			var audioEle=$("#"+$this._options.id).find(".audio_name");
	    			var filename=$this._options.list[$this.index].name;
	    			audioEle.attr("title",filename).text(filename);
	    			//更换背景
	    			var bg=$this._options.list[$this.index].bg;
	    			if(!bg){
	    				bg=$this._options.bg;
	    			}
	    			//缓存完成后再更换，避免播放器白屏
					var img=new Image();
					img.src=bg;
					img.onload=function(){
						$("#"+$this._options.id).find(".audio_filter").css("background-image","url("+bg+")");
					}
					if(!$this._options.pause){
						$this.audioCtl.play();
					}
	    		}else{
	    			//暂停/播放
	    			if($this._options.pause){
	    				$this.audioCtl.play();
						$("#"+$this._options.id).find(".audio_play").html(pauseSvg);
						$this._options.pause=false;
			        }else{
		        		$this.audioCtl.pause();
		        		$("#"+$this._options.id).find(".audio_play").html(playSvg);
		        		$this._options.pause=true;
			        }
	    		}
    		}
    	},500)
    }
    //下一首逻辑处理
    Audio.prototype.next = function() {
        this._options.nextFn(this);
    }
})();
