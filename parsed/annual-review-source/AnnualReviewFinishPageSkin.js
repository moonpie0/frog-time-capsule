generateEUI.paths['resource/China/skins/AnnualReview/AnnualReviewFinishPageSkin.exml'] = window.$exmlClass37 = (function (_super) {
	__extends($exmlClass37, _super);
	var $exmlClass37$Skin38 = 	(function (_super) {
		__extends($exmlClass37$Skin38, _super);
		function $exmlClass37$Skin38() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = $exmlClass37$Skin38.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "year_summary_share_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return $exmlClass37$Skin38;
	})(eui.Skin);

	function $exmlClass37() {
		_super.call(this);
		this.skinParts = ["start_tween","lblName","lblDate","btnShare","imgRole","imgTitle","imgDesc","imageGoods","imageGet","groupItem","group"];
		
		this.currentState = "normal";
		this.height = 1136;
		this.width = 640;
		this.start_tween_i();
		this.elementsContent = [this._Image1_i(),this.group_i()];
		this._Image4_i();
		
		this._Group1_i();
		
		this._Image5_i();
		
		this._Image6_i();
		
		this.btnShare_i();
		
		this.groupItem_i();
		
		this.states = [
			new eui.State ("normal",
				[
					new eui.AddItems("btnShare","_Group2",2,"imgRole"),
					new eui.AddItems("groupItem","group",1,""),
					new eui.SetProperty("_Group1","y",757.56),
					new eui.SetProperty("imgDesc","horizontalCenter",0),
					new eui.SetProperty("groupItem","y",886),
					new eui.SetProperty("groupItem","x",444)
				])
			,
			new eui.State ("share",
				[
					new eui.AddItems("_Image4","_Group1",0,""),
					new eui.AddItems("_Group1","_Group2",2,"imgRole"),
					new eui.AddItems("_Image5","_Group2",2,"imgRole"),
					new eui.AddItems("_Image6","_Group2",2,"imgRole"),
					new eui.SetProperty("_Image3","y",81.82),
					new eui.SetProperty("lblName","text",""),
					new eui.SetProperty("lblName","x",92),
					new eui.SetProperty("lblDate","text",""),
					new eui.SetProperty("lblDate","x",92),
					new eui.SetProperty("_Group1","y",827.38),
					new eui.SetProperty("_Group1","horizontalCenter",0.5),
					new eui.SetProperty("imgRole","y",303.82),
					new eui.SetProperty("imgTitle","horizontalCenter",135),
					new eui.SetProperty("imgTitle","y",355.82),
					new eui.SetProperty("imgDesc","y",575.82),
					new eui.SetProperty("imgDesc","horizontalCenter",17),
					new eui.SetProperty("group","height",1173)
				])
		];
		
		eui.Binding.$bindProperties(this, ["hostComponent.image"],[0],this._TweenItem1,"target");
		eui.Binding.$bindProperties(this, [0],[],this._Object1,"alpha");
		eui.Binding.$bindProperties(this, [0],[],this._Object2,"alpha");
		eui.Binding.$bindProperties(this, [1],[],this._Object3,"alpha");
		eui.Binding.$bindProperties(this, ["hostComponent.image0"],[0],this._TweenItem2,"target");
		eui.Binding.$bindProperties(this, [0],[],this._Object4,"alpha");
		eui.Binding.$bindProperties(this, [1],[],this._Object5,"alpha");
		eui.Binding.$bindProperties(this, ["hostComponent.image1"],[0],this._TweenItem3,"target");
		eui.Binding.$bindProperties(this, [0],[],this._Object6,"alpha");
		eui.Binding.$bindProperties(this, [1],[],this._Object7,"alpha");
	}
	var _proto = $exmlClass37.prototype;

	_proto.start_tween_i = function () {
		var t = new egret.tween.TweenGroup();
		this.start_tween = t;
		t.items = [this._TweenItem1_i(),this._TweenItem2_i(),this._TweenItem3_i()];
		return t;
	};
	_proto._TweenItem1_i = function () {
		var t = new egret.tween.TweenItem();
		this._TweenItem1 = t;
		t.paths = [this._Set1_i(),this._Wait1_i(),this._Set2_i(),this._To1_i()];
		return t;
	};
	_proto._Set1_i = function () {
		var t = new egret.tween.Set();
		t.props = this._Object1_i();
		return t;
	};
	_proto._Object1_i = function () {
		var t = {};
		this._Object1 = t;
		return t;
	};
	_proto._Wait1_i = function () {
		var t = new egret.tween.Wait();
		t.duration = 200;
		return t;
	};
	_proto._Set2_i = function () {
		var t = new egret.tween.Set();
		t.props = this._Object2_i();
		return t;
	};
	_proto._Object2_i = function () {
		var t = {};
		this._Object2 = t;
		return t;
	};
	_proto._To1_i = function () {
		var t = new egret.tween.To();
		t.duration = 300;
		t.props = this._Object3_i();
		return t;
	};
	_proto._Object3_i = function () {
		var t = {};
		this._Object3 = t;
		return t;
	};
	_proto._TweenItem2_i = function () {
		var t = new egret.tween.TweenItem();
		this._TweenItem2 = t;
		t.paths = [this._Set3_i(),this._Wait2_i(),this._Set4_i(),this._To2_i()];
		return t;
	};
	_proto._Set3_i = function () {
		var t = new egret.tween.Set();
		t.props = this._Object4_i();
		return t;
	};
	_proto._Object4_i = function () {
		var t = {};
		this._Object4 = t;
		return t;
	};
	_proto._Wait2_i = function () {
		var t = new egret.tween.Wait();
		t.duration = 500;
		return t;
	};
	_proto._Set4_i = function () {
		var t = new egret.tween.Set();
		return t;
	};
	_proto._To2_i = function () {
		var t = new egret.tween.To();
		t.duration = 300;
		t.props = this._Object5_i();
		return t;
	};
	_proto._Object5_i = function () {
		var t = {};
		this._Object5 = t;
		return t;
	};
	_proto._TweenItem3_i = function () {
		var t = new egret.tween.TweenItem();
		this._TweenItem3 = t;
		t.paths = [this._Set5_i(),this._Wait3_i(),this._Set6_i(),this._To3_i()];
		return t;
	};
	_proto._Set5_i = function () {
		var t = new egret.tween.Set();
		t.props = this._Object6_i();
		return t;
	};
	_proto._Object6_i = function () {
		var t = {};
		this._Object6 = t;
		return t;
	};
	_proto._Wait3_i = function () {
		var t = new egret.tween.Wait();
		t.duration = 500;
		return t;
	};
	_proto._Set6_i = function () {
		var t = new egret.tween.Set();
		return t;
	};
	_proto._To3_i = function () {
		var t = new egret.tween.To();
		t.duration = 500;
		t.props = this._Object7_i();
		return t;
	};
	_proto._Object7_i = function () {
		var t = {};
		this._Object7 = t;
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.includeInLayout = true;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "back_summary3_png";
		t.verticalCenter = 0;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.group_i = function () {
		var t = new eui.Group();
		this.group = t;
		t.height = 1136;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.width = 640;
		t.elementsContent = [this._Image2_i(),this._Group2_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.includeInLayout = true;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "back_summary3_png";
		t.verticalCenter = 0;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Group2_i = function () {
		var t = new eui.Group();
		this._Group2 = t;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.elementsContent = [this._Image3_i(),this.imgRole_i(),this.imgTitle_i(),this.imgDesc_i()];
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		this._Image3 = t;
		t.source = "theme_paper_png";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		this._Group1 = t;
		t.elementsContent = [this.lblName_i(),this.lblDate_i()];
		return t;
	};
	_proto._Image4_i = function () {
		var t = new eui.Image();
		this._Image4 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "icon_head_png";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.lblName_i = function () {
		var t = new eui.Label();
		this.lblName = t;
		t.size = 30;
		t.text = "";
		t.textColor = 0x545D4C;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.lblDate_i = function () {
		var t = new eui.Label();
		this.lblDate = t;
		t.size = 24;
		t.text = "";
		t.textColor = 0xAAAAAA;
		t.x = 0;
		t.y = 40.69;
		return t;
	};
	_proto._Image5_i = function () {
		var t = new eui.Image();
		this._Image5 = t;
		t.source = "summary_qr_code_png";
		t.x = 227.18;
		t.y = 998.66;
		return t;
	};
	_proto._Image6_i = function () {
		var t = new eui.Image();
		this._Image6 = t;
		t.right = 0;
		t.source = "summary_logo_png";
		t.top = -6;
		return t;
	};
	_proto.btnShare_i = function () {
		var t = new Button();
		this.btnShare = t;
		t.x = 186;
		t.y = 759;
		t.skinName = $exmlClass37$Skin38;
		return t;
	};
	_proto.imgRole_i = function () {
		var t = new eui.Image();
		this.imgRole = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.source = "10_role_png";
		t.x = 83;
		t.y = 222;
		return t;
	};
	_proto.imgTitle_i = function () {
		var t = new eui.Image();
		this.imgTitle = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.horizontalCenter = 135;
		t.source = "10_title_png";
		t.y = 274;
		return t;
	};
	_proto.imgDesc_i = function () {
		var t = new eui.Image();
		this.imgDesc = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.source = "10_desc_png";
		t.y = 494;
		return t;
	};
	_proto.groupItem_i = function () {
		var t = new eui.Group();
		this.groupItem = t;
		t.height = 153;
		t.width = 134;
		t.x = 444;
		t.y = 751;
		t.elementsContent = [this._Image7_i(),this.imageGoods_i(),this.imageGet_i()];
		return t;
	};
	_proto._Image7_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.rotation = -72.6;
		t.source = "share_cake_item_bg_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.imageGoods_i = function () {
		var t = new eui.Image();
		this.imageGoods = t;
		t.horizontalCenter = 10;
		t.scaleX = 0.5;
		t.scaleY = 0.5;
		t.source = "goods_98_png";
		t.verticalCenter = 4;
		return t;
	};
	_proto.imageGet_i = function () {
		var t = new eui.Image();
		this.imageGet = t;
		t.horizontalCenter = 8;
		t.source = "text_share_got_png";
		t.verticalCenter = 41;
		t.visible = false;
		return t;
	};
	return $exmlClass37;
})(eui.Skin);