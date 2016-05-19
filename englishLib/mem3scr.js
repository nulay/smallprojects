var useword_rus={
	allword:"Всего слов",
	closeR:"Закрыто справа",
	closeL:"Закрыто слево",
	wordJSON:"Добавьте слова в виде",
	add:"Добавить",
	cancal:"Отмена",
	allwords:"Все слова в виде",
	checkoutSel:"Снять выделение.",
	selAll:"Выделить все.",
	showEng:' Показать английский',
	hideEng:' Скрыть английский',
	}

var useword=useword_rus;

jQuery.fn.shuffle = function () {
		var allElems = this.get();
		var getRandom = function (max) {
			return Math.floor(Math.random() * max);
		};
		var shuffled = jQuery.map(allElems, function () {
				var random = getRandom(allElems.length);
				randEl = jQuery(allElems[random]).clone(true)[0];
				allElems.splice(random, 1);
				return randEl;
			});
		this.each(function (i) {
			jQuery(this).replaceWith(jQuery(shuffled[i]));
		});
		return jQuery(shuffled);
}

function _getListOb(arrEl){
	var listOb = [];
	arrEl.each(function (ind, el) {
		var ob = new Object();
		el = $(el);
		ob.r = el.find('.input-group2 input[type=text]').val();
		ob.rc=(el.find('.input-group2').hasClass('elclose'))?1:0;
		ob.e = el.find('.input-group input[type=search]').val();
		ob.ec=(el.find('.input-group').hasClass('elclose'))?1:0;
		if (ob.r != '')
			listOb.push(ob);
	});
	return listOb;
}
function getAllSelWords(){
	return _getListOb($('.wordsEl .checkSh:checked').parent().parent().parent());
}

function getCurentStateDictionary(){
	return _getListOb($('.wordsEl .input-group2').parent().parent());
}

var prStr = {"statePr" : "STATE_MENU", "curentlib" : null, "yoursLib": null }

function getState(){
	var dt=$('#edit-body').val();
	if(dt.length > 0){
		return JSON.parse(dt);
	}
	return prStr;
}

function changeState(){
	$('#edit-body').val(prStr);
	$('#edit-submit').click();
}

function startWorkCard() {	
	if(document.URL.includes('/node/add/englishlib')){
		$('#edit-title').val("My dictionary-"+new Date().getTime());
		$('#edit-path').val("englishlib-"+new Date().getTime()+"-"+Math.floor(Math.random() * (1000 - 0 + 1)) + 0);		
	}
	
	prStr=getState();

	jQuery('#main').css({"z-index" : "20","position" : "absolute","background" : "white","left" : "0px","top" : "160px","padding" : "0px 75px 0px 75px","width":"100%"});

	jQuery("#sidebar-left").hide();
	jQuery('#node-form div.standard').hide();
	jQuery('#node-form div.admin').hide();
	jQuery('#edit-preview').hide();
	jQuery('#main .tabs').hide();
	console.log('i did it');

	if (prStr.statePr == "STATE_MENU") {
		//here will build menu
		$('#main .node-form').prepend($('#edit-field-menu-0-value').val());
		$('.lang-lg').parent().on('click',function(ev){console.log(ev);setLib($(ev.target).find('.lang-lg').attr('indLib')); return;});
	} else {		
		startlib(prStr.yoursLib[prStr.curentlib]);
	}
}

function setLib(indLib){
	var wordsEl = JSON.parse($('#edit-field-words-0-value').val());
	if(prStr.yoursLib==null){
		prStr.yoursLib=[];
	}
	prStr.curentlib=prStr.yoursLib.length;
	prStr.yoursLib[prStr.curentlib]=wordsEl[indLib];
		
	prStr.statePr = "LIB_"+prStr.curentlib;
	
	$('#edit-body').val(JSON.stringify(prStr));
	
	startlib(prStr.yoursLib[prStr.curentlib]);		
}

function closeOpenEl(el, dir){	
    var elName='.input-group2';
	var arrowOpen='fa-arrow-right';
	var arrowClose='fa-arrow-left';
	if(dir=="r"){		
		arrowOpen=arrowClose;
	    arrowClose='fa-arrow-right';
		elName='.input-group';
	}
	el=$(el).parents(elName);
		
	if(el.hasClass('elclose')){
		el.find('.'+arrowClose).removeClass(arrowClose).addClass(arrowOpen);
		el.removeClass('elclose').css('width', ($('.hideEng').width() - $($('.wordcard')[0]).width() * 3) + 'px');
	}else{
		el.find('.'+arrowOpen).removeClass(arrowOpen).addClass(arrowClose);
		el.addClass('elclose').css('width', '1px');
	}	
}

function calculateWords(){
	var txt=useword.allword+": "+$(".wordsEl .row").length+"; ";
	var td=$(".wordsEl .input-group2.elclose").length;
	if(td>0) txt+=useword.closeR+": "+td+"; ";
	td=$(".wordsEl .input-group.elclose").length;
	if(td>0) txt+=useword.closeL+": "+td+"; ";
	$('.fa-info').attr('title',txt);
}

function showDialogAddWord(){
	if($("#windowAddW").length==0){
		$('body').append('<dialog id="windowAddW" style="z-index:22;position:fixed;"><h3>'+useword.wordJSON+' JSON [{"r":"Абрикос","e":"Apricot"},...]!</h3><p><textarea rows="10" style="width: 100%;" id="newWords"></textarea></p><button id="butaddWords">'+useword.add+'</dialog><button id="butclosewindowAddW">'+useword.cancal+'</dialog>');
		$('#butclosewindowAddW').on('click',function(){$("#windowAddW")[0].close();});
		$('#butaddWords').on('click',function(){var wordsEl = JSON.parse($('#newWords').val());if(wordsEl.length>0){addWords(wordsEl);};$("#windowAddW")[0].close();});
	}
	$("#windowAddW")[0].show();
}

function showDialogWord(){
	if($("#windowAddW1").length==0){
		$('body').append('<dialog id="windowAddW1" style="z-index:22;position:fixed;"><h3>'+useword.allwords+' JSON [{"r":"Абрикос","e":"Apricot"},...]!</h3><p><textarea rows="10" style="width: 100%;" id="newWords1"></textarea></p><button id="butaddWords1">Ok</dialog><button id="butclosewindowAddW1">'+useword.cancal+'</dialog>');
		$('#butclosewindowAddW1').on('click',function(){$("#windowAddW1")[0].close();});
		$('#butaddWords1').on('click',function(){$("#windowAddW1")[0].close();});
	}
	$("#windowAddW1")[0].show();
}

function addWords(curentlib){
	if(curentlib!=null && $(curentlib).length>0){
	var elEx = $('.exampleEl').html();
	var reReplacePatternRu = /rusword/g;
	var reReplacePatternEn = /enword/g;
	
	$(curentlib).each(function (ind, el) {		
			if(el.r=='rusword') return true;
			var t = elEx.replace(/rusword/g, el.r);
			t=t.replace(/enword/g, el.e);	
			t = $(t);
			$('.wordsEl').append(t);
			if(el.rc!=null){			
				if(el.rc=="1"){
					t.find('.input-group2').addClass('elclose').css('width', '1px');
					t.find('.input-group2').find('.fa-arrow-right').removeClass('fa-arrow-right').addClass('fa-arrow-left');
				}
				if(el.ec=="1"){
					t.find('.input-group').addClass('elclose').css('width', '1px');
					t.find('.input-group').find('.fa-arrow-left').removeClass('fa-arrow-left').addClass('fa-arrow-right');
				}
			}
			t.addClass('newheadline');		
	})
	
	$('.wordsEl .newheadline .input-group .fashowinput').on('click', function(ev){closeOpenEl($(ev.target),"r")});
	$('.wordsEl .newheadline .input-group2 .fashowinput').on('click', function(ev){closeOpenEl($(ev.target),"l")});
	
	$('.newheadline .fa-times').parent().on('click', function () {
	  var thisEl = $(this).parents('div.row');
	  var idel = thisEl.find('input:hidden').val();
	 // $.ajax({method : "GET",url : "/new/profile/del/word/" + idel + "/" + $('input[name=dic_id]:first').val() + "/"}).done(function (msg) {thisEl.remove();});
	  thisEl.remove();	 
    });
	
	$('.newheadline .checkSh').on('change', function () {
		if ($('.checkSh:checked').length > 0) {
			$('.shuffler input').prop("checked", "checked");
			$('.shuffler label span').text(useword.checkoutSel);
		} else {
			$('.shuffler input').prop("checked", "");
			$('.shuffler label span').text(useword.sellAll);
		}
	});
	
	console.log("removeClass(newheadline)");
	$('.newheadline').removeClass('newheadline');
	}
}

function startlib(curentlib, settLib) {
	$('#main .node-form').prepend($('#edit-field-elem-0-value').val());
	addWords(curentlib);	
	
	$('.hideEng').on('click', function () {
		if ($('.hideEng .fa-angle-double-left').length > 0) {
			$('.hideEng .fa-angle-double-left').removeClass('fa-angle-double-left').addClass('fa-angle-double-right');
			$('.hideEng .txtF').text(useword.showEng);
			$('.input-group').addClass('elclose').css('width', '1px');
			$('.input-group .fa-arrow-left').removeClass('fa-arrow-left').addClass('fa-arrow-right');			
		} else {
			$('.hideEng .fa-angle-double-right').removeClass('fa-angle-double-right').addClass('fa-angle-double-left');
			$('.hideEng .txtF').text(useword.hideEng);
			$('.input-group').removeClass('elclose').css('width', ($('.hideEng').width() - $($('.wordcard')[0]).width() * 3) + 'px');
			$('.input-group .fa-arrow-right').removeClass('fa-arrow-right').addClass('fa-arrow-left');			
		}
	});
	
	$('.shuffler input').on('change', function () {
		if ($('.checkSh:checked').length > 0) {
			$('.checkSh:checked').prop("checked", "");
			$('.shuffler label span').text(useword.selAll);
		} else {
			$('.checkSh').prop("checked", "checked");
			$('.shuffler label span').text(useword.checkoutSel);
		}
	});
	
	$('body').append('<div style="display:block;height:300px;width:60px;left:20px;top:160px;z-index:21;position:fixed;font-size: smaller;"><div style="padding:10px 10px;"><i class="fa fa-random" style="width: 40px;font-size: 22px;"/></div><div style="padding:10px 10px;"><i class="fa fa-level-down" style="width: 40px;font-size: 22px;"/></div><div style="padding:10px 10px;"><i class="fa fa-external-link" style="width: 40px;font-size: 22px;"/></div><div style="padding:10px 10px;"><i class="fa fa-plus" style="width: 40px;font-size: 22px;"/></div><div style="padding:10px 10px;"><i class="fa fa-save" style="width: 40px;font-size: 22px;"/></div><div style="padding:10px 10px;"><i class="fa fa-info" style="width: 40px;font-size: 22px;"/></div></div>');
	$('.fa-random').on('click', function () {
		$('.checkSh:checked').parents('.row').shuffle();
	});
	$('.fa-level-down').on('click', function () {
		$('.checkSh:checked').parents('.row').insertBefore($('.checkSh:checked:last').parents('.row').next());
	});
	
	$('.fa-external-link').on('click', function () {
		var d = JSON.stringify(getAllSelWords());
		showDialogWord()
		$('#newWords1').val(d);
	});
	$('.fa-plus').on('click', function () {
		console.log("call showDialogAddWord");
		showDialogAddWord();		
	});
		
	$('.fa-save').on('click', function () {
		$('#main #edit-submit').click();
	});
	
	$('.fa-info').parent().on('mouseover', function () {
		calculateWords();
	});
	
	//Save state library to save page on server
	$('#main #edit-submit')[0].onclick=function(){
		prStr.yoursLib[prStr.curentlib]=getCurentStateDictionary();
		$('#edit-body').val(JSON.stringify(prStr));
		console.log('I save it');
		return true;
	}
	
	$(window).resize(function () {
		if ($('.hideEng .fa-angle-double-left').length > 0 && !$('.input-group').hasClass('elclose')) {
			$('.input-group').css('width', ($('.hideEng').width() - $($('.wordcard')[0]).width() * 3) + 'px');
		}
	});
}

jQuery(function () {
	startWorkCard();
})