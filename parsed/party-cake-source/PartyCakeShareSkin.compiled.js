generateEUI.paths['resource/China/skins/PartyCake/PartyCakeShareSkin.exml'] = window.$exmlClass453 = (function (_super) {
	__extends($exmlClass453, _super);
	var $exmlClass453$Skin454 = 	(function (_super) {
		__extends($exmlClass453$Skin454, _super);
		function $exmlClass453$Skin454() {
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
		var _proto = $exmlClass453$Skin454.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "share_84_88_png";
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
		return $exmlClass453$Skin454;
	})(eui.Skin);

	var $exmlClass453$Skin455 = 	(function (_super) {
		__extends($exmlClass453$Skin455, _super);
		function $exmlClass453$Skin455() {
			_super.call(this);
			this.skinParts = [];
			
			this.elementsContent = [this._Image1_i()];
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
		var _proto = $exmlClass453$Skin455.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "back_84_88_png";
			t.percentWidth = 100;
			return t;
		};
		return $exmlClass453$Skin455;
	})(eui.Skin);

	var $exmlClass453$Skin456 = 	(function (_super) {
		__extends($exmlClass453$Skin456, _super);
		function $exmlClass453$Skin456() {
			_super.call(this);
			this.skinParts = ["imagePic","textFrog"];
			
			this.height = 800;
			this.width = 640;
			this.elementsContent = [this._Image1_i(),this.imagePic_i(),this._Image2_i(),this.textFrog_i()];
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
		var _proto = $exmlClass453$Skin456.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.horizontalCenter = 0;
			t.source = "share_cake_bg_png";
			t.verticalCenter = -80;
			return t;
		};
		_proto.imagePic_i = function () {
			var t = new eui.Image();
			this.imagePic = t;
			t.horizontalCenter = -3;
			t.source = "";
			t.verticalCenter = -19;
			return t;
		};
		_proto._Image2_i = function () {
			var t = new eui.Image();
			t.horizontalCenter = 0;
			t.scale9Grid = new egret.Rectangle(33,9,12,55);
			t.source = "share_cake_info_bg_png";
			t.verticalCenter = 260;
			t.width = 500;
			return t;
		};
		_proto.textFrog_i = function () {
			var t = new TravelNoteTextLabel();
			this.textFrog = t;
			t.height = 40;
			t.horizontalCenter = 0;
			t.verticalCenter = 260;
			return t;
		};
		return $exmlClass453$Skin456;
	})(eui.Skin);

	function $exmlClass453() {
		_super.call(this);
		this.skinParts = ["btnRefreshTween","imageTitle","groupTitle","btnShare","btnClose","imageGoods","imageGet","groupItem","groupTop","list","scroller","imageLeft","imageRight","lbShare","groupShare"];
		
		this.currentState = "normal";
		this.height = 1136;
		this.width = 640;
		this.btnRefreshTween_i();
		this.elementsContent = [this._Image1_i(),this.groupTitle_i(),this.groupTop_i(),this._Group1_i(),this.groupShare_i()];
		this.states = [
			new eui.State ("normal",
				[
				])
		];
		
		eui.Binding.$bindProperties(this, ["hostComponent.btnRefresh"],[0],this._TweenItem1,"target");
		eui.Binding.$bindProperties(this, [1.2],[],this._Object1,"scaleX");
		eui.Binding.$bindProperties(this, [1.2],[],this._Object1,"scaleY");
		eui.Binding.$bindProperties(this, [1],[],this._Object2,"scaleX");
		eui.Binding.$bindProperties(this, [1],[],this._Object2,"scaleY");
		eui.Binding.$bindProperties(this, ["hostComponent.safe_top"],[0],this.groupTitle,"top");
		eui.Binding.$bindProperties(this, ["hostComponent.safe_top"],[0],this.groupTop,"top");
	}
	var _proto = $exmlClass453.prototype;

	_proto.btnRefreshTween_i = function () {
		var t = new egret.tween.TweenGroup();
		this.btnRefreshTween = t;
		t.items = [this._TweenItem1_i()];
		return t;
	};
	_proto._TweenItem1_i = function () {
		var t = new egret.tween.TweenItem();
		this._TweenItem1 = t;
		t.paths = [this._Set1_i(),this._To1_i(),this._To2_i()];
		return t;
	};
	_proto._Set1_i = function () {
		var t = new egret.tween.Set();
		return t;
	};
	_proto._To1_i = function () {
		var t = new egret.tween.To();
		t.duration = 1500;
		t.props = this._Object1_i();
		return t;
	};
	_proto._Object1_i = function () {
		var t = {};
		this._Object1 = t;
		return t;
	};
	_proto._To2_i = function () {
		var t = new egret.tween.To();
		t.duration = 1500;
		t.props = this._Object2_i();
		return t;
	};
	_proto._Object2_i = function () {
		var t = {};
		this._Object2 = t;
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.source = "back_makecake_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.groupTitle_i = function () {
		var t = new eui.Group();
		this.groupTitle = t;
		t.anchorOffsetY = 0;
		t.height = 166;
		t.left = 0;
		t.right = 0;
		t.elementsContent = [this.imageTitle_i()];
		return t;
	};
	_proto.imageTitle_i = function () {
		var t = new eui.Image();
		this.imageTitle = t;
		t.horizontalCenter = 0;
		t.source = "text_cake_with_frog_png";
		t.top = 50;
		return t;
	};
	_proto.groupTop_i = function () {
		var t = new eui.Group();
		this.groupTop = t;
		t.anchorOffsetY = 0;
		t.height = 166;
		t.left = 0;
		t.right = 0;
		t.elementsContent = [this.btnShare_i(),this.btnClose_i(),this.groupItem_i()];
		return t;
	};
	_proto.btnShare_i = function () {
		var t = new Button();
		this.btnShare = t;
		t.height = 88;
		t.label = "";
		t.right = 21;
		t.top = 19;
		t.skinName = $exmlClass453$Skin454;
		return t;
	};
	_proto.btnClose_i = function () {
		var t = new Button();
		this.btnClose = t;
		t.label = "";
		t.left = 23;
		t.scaleX = 1;
		t.scaleY = 1;
		t.top = 19;
		t.skinName = $exmlClass453$Skin455;
		return t;
	};
	_proto.groupItem_i = function () {
		var t = new eui.Group();
		this.groupItem = t;
		t.height = 153;
		t.right = 23;
		t.top = 75;
		t.width = 134;
		t.elementsContent = [this._Image2_i(),this.imageGoods_i(),this.imageGet_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.source = "share_cake_item_bg_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.imageGoods_i = function () {
		var t = new eui.Image();
		this.imageGoods = t;
		t.horizontalCenter = 0;
		t.scaleX = 0.5;
		t.scaleY = 0.5;
		t.source = "";
		t.verticalCenter = 9;
		return t;
	};
	_proto.imageGet_i = function () {
		var t = new eui.Image();
		this.imageGet = t;
		t.horizontalCenter = 0;
		t.source = "text_share_got_png";
		t.verticalCenter = 53;
		t.visible = false;
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 800;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.elementsContent = [this.scroller_i(),this.imageLeft_i(),this.imageRight_i()];
		return t;
	};
	_proto.scroller_i = function () {
		var t = new PageGroupScroller();
		this.scroller = t;
		t.anchorOffsetY = 0;
		t.height = 800;
		t.horizontalCenter = 0;
		t.name = "scroller";
		t.pageHorizontalGap = 400;
		t.touchEnabled = false;
		t.verticalCenter = 0;
		t.width = 640;
		t.viewport = this.list_i();
		return t;
	};
	_proto.list_i = function () {
		var t = new eui.List();
		this.list = t;
		t.name = "list";
		t.x = 1;
		t.y = -1;
		t.layout = this._HorizontalLayout1_i();
		t.itemRendererSkinName = $exmlClass453$Skin456;
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.gap = 12;
		t.horizontalAlign = "center";
		t.paddingLeft = 0;
		t.paddingRight = 0;
		t.verticalAlign = "middle";
		return t;
	};
	_proto.imageLeft_i = function () {
		var t = new eui.Image();
		this.imageLeft = t;
		t.left = 10;
		t.source = "text_slide_left_png";
		t.verticalCenter = 470;
		t.width = 185;
		return t;
	};
	_proto.imageRight_i = function () {
		var t = new eui.Image();
		this.imageRight = t;
		t.right = 10;
		t.source = "text_slide_right_png";
		t.verticalCenter = 470;
		return t;
	};
	_proto.groupShare_i = function () {
		var t = new eui.Group();
		this.groupShare = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.horizontalCenter = 0;
		t.verticalCenter = 430;
		t.visible = false;
		t.elementsContent = [this._Image3_i(),this.lbShare_i()];
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.source = "share_cake_logo_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.lbShare_i = function () {
		var t = new eui.Label();
		this.lbShare = t;
		t.bold = true;
		t.horizontalCenter = 36;
		t.text = "";
		t.textAlign = "left";
		t.textColor = 0x545d4c;
		t.verticalCenter = -74;
		return t;
	};
	return $exmlClass453;
})(eui.Skin);