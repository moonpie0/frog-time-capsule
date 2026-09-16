generateEUI.paths['resource/China/skins/PartyCake/PartyCakeSkin.exml'] = window.$exmlClass457 = (function (_super) {
	__extends($exmlClass457, _super);
	var $exmlClass457$Skin458 = 	(function (_super) {
		__extends($exmlClass457$Skin458, _super);
		var $exmlClass457$Skin458$Skin459 = 		(function (_super) {
			__extends($exmlClass457$Skin458$Skin459, _super);
			function $exmlClass457$Skin458$Skin459() {
				_super.call(this);
				this.skinParts = [];
				
				this.elementsContent = [this._DragonbonesUI1_i()];
			}
			var _proto = $exmlClass457$Skin458$Skin459.prototype;

			_proto._DragonbonesUI1_i = function () {
				var t = new DragonbonesUI();
				t.source = "tips_xhd";
				return t;
			};
			return $exmlClass457$Skin458$Skin459;
		})(eui.Skin);

		function $exmlClass457$Skin458() {
			_super.call(this);
			this.skinParts = [];
			
			this.elementsContent = [this._Image1_i(),this._Redot1_i()];
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
		var _proto = $exmlClass457$Skin458.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "share_84_88_png";
			t.percentWidth = 100;
			return t;
		};
		_proto._Redot1_i = function () {
			var t = new Redot();
			t.redot = "PARTYCAKESHARE";
			t.touchEnabled = false;
			t.x = 10;
			t.y = 10;
			t.skinName = $exmlClass457$Skin458$Skin459;
			return t;
		};
		return $exmlClass457$Skin458;
	})(eui.Skin);

	var $exmlClass457$Skin460 = 	(function (_super) {
		__extends($exmlClass457$Skin460, _super);
		function $exmlClass457$Skin460() {
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
		var _proto = $exmlClass457$Skin460.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "back_84_88_png";
			t.percentWidth = 100;
			return t;
		};
		return $exmlClass457$Skin460;
	})(eui.Skin);

	var $exmlClass457$Skin461 = 	(function (_super) {
		__extends($exmlClass457$Skin461, _super);
		function $exmlClass457$Skin461() {
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
		var _proto = $exmlClass457$Skin461.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "btn_week_task_png";
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
		return $exmlClass457$Skin461;
	})(eui.Skin);

	var $exmlClass457$Skin462 = 	(function (_super) {
		__extends($exmlClass457$Skin462, _super);
		function $exmlClass457$Skin462() {
			_super.call(this);
			this.skinParts = ["imageBg","lbTask","imageDone","groupGoods1","groupGoods2"];
			
			this.height = 88;
			this.width = 420;
			this.elementsContent = [this.imageBg_i(),this.lbTask_i(),this.imageDone_i(),this.groupGoods1_i(),this.groupGoods2_i()];
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
		var _proto = $exmlClass457$Skin462.prototype;

		_proto.imageBg_i = function () {
			var t = new eui.Image();
			this.imageBg = t;
			t.height = 80;
			t.horizontalCenter = 0;
			t.scale9Grid = new egret.Rectangle(23,23,15,15);
			t.source = "frame_15_png";
			t.verticalCenter = 0;
			t.width = 380;
			return t;
		};
		_proto.lbTask_i = function () {
			var t = new eui.Label();
			this.lbTask = t;
			t.left = 35;
			t.size = 24;
			t.text = "任务1";
			t.textColor = 0x545d4c;
			t.verticalCenter = 0;
			return t;
		};
		_proto.imageDone_i = function () {
			var t = new eui.Image();
			this.imageDone = t;
			t.left = 16;
			t.source = "text_caketask_tips_png";
			t.top = 0;
			t.visible = false;
			return t;
		};
		_proto.groupGoods1_i = function () {
			var t = new eui.Group();
			this.groupGoods1 = t;
			t.height = 60;
			t.right = 33;
			t.verticalCenter = 0;
			t.width = 60;
			t.elementsContent = [this._Image1_i(),this._Image2_i(),this._Label1_i()];
			return t;
		};
		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.height = 60;
			t.horizontalCenter = 0;
			t.scale9Grid = new egret.Rectangle(18,17,23,26);
			t.scaleX = 1;
			t.scaleY = 1;
			t.source = "item_back_png";
			t.verticalCenter = 0;
			t.width = 60;
			return t;
		};
		_proto._Image2_i = function () {
			var t = new eui.Image();
			t.height = 60;
			t.horizontalCenter = 0;
			t.scaleX = 1;
			t.scaleY = 1;
			t.source = "goods_91_png";
			t.verticalCenter = 0;
			t.width = 60;
			return t;
		};
		_proto._Label1_i = function () {
			var t = new eui.Label();
			t.bottom = 3;
			t.right = 3;
			t.size = 20;
			t.text = "3";
			t.textColor = 0x545D4C;
			return t;
		};
		_proto.groupGoods2_i = function () {
			var t = new eui.Group();
			this.groupGoods2 = t;
			t.height = 60;
			t.right = 100;
			t.verticalCenter = 0;
			t.width = 60;
			t.elementsContent = [this._Image3_i(),this._Image4_i(),this._Label2_i()];
			return t;
		};
		_proto._Image3_i = function () {
			var t = new eui.Image();
			t.height = 60;
			t.horizontalCenter = 0;
			t.scale9Grid = new egret.Rectangle(18,17,23,26);
			t.scaleX = 1;
			t.scaleY = 1;
			t.source = "item_back_png";
			t.verticalCenter = 0;
			t.width = 60;
			return t;
		};
		_proto._Image4_i = function () {
			var t = new eui.Image();
			t.height = 60;
			t.horizontalCenter = 0;
			t.scaleX = 1;
			t.scaleY = 1;
			t.source = "goods_91_png";
			t.verticalCenter = 0;
			t.width = 60;
			return t;
		};
		_proto._Label2_i = function () {
			var t = new eui.Label();
			t.bottom = 3;
			t.right = 3;
			t.size = 20;
			t.text = "3";
			t.textColor = 0x545D4C;
			return t;
		};
		return $exmlClass457$Skin462;
	})(eui.Skin);

	function $exmlClass457() {
		_super.call(this);
		this.skinParts = ["btnRefreshTween","btnShare","btnClose","lblLimitDate","imagePart1","imagePart2","imagePart3","imagePart4","imagePart5","groupPart","imageCake1_1","imageCake1_2","imageCake2_1","imageCake2_2","imageCake3_1","imageCake5_1","imageCake4_1","imageCake4_2","imageCake4_3","imageCake4_4","imageCake4_5","imageCake4_6","imageCake4_7","imageCake4_8","groupCake","lbCream","lbSugar","btnMake","lbCreamMake","lbSugarMake","groupMake","lbOpen","groupOpen","coverTask","btnTask","list","groupTask","cover","lbGift","groupItem","btnOpen","groupGift"];
		
		this.currentState = "normal";
		this.height = 1136;
		this.width = 640;
		this.btnRefreshTween_i();
		this.elementsContent = [this._Image1_i(),this._Group1_i(),this._Group4_i()];
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
		eui.Binding.$bindProperties(this, ["hostComponent.safe_top"],[0],this._Group1,"top");
	}
	var _proto = $exmlClass457.prototype;

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
	_proto._Group1_i = function () {
		var t = new eui.Group();
		this._Group1 = t;
		t.height = 72;
		t.left = 0;
		t.right = 0;
		t.touchThrough = true;
		t.elementsContent = [this._Image2_i(),this.btnShare_i(),this.btnClose_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.source = "text_frog_party_png";
		t.top = 50;
		return t;
	};
	_proto.btnShare_i = function () {
		var t = new Button();
		this.btnShare = t;
		t.height = 88;
		t.label = "";
		t.right = 21;
		t.top = 19;
		t.skinName = $exmlClass457$Skin458;
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
		t.skinName = $exmlClass457$Skin460;
		return t;
	};
	_proto._Group4_i = function () {
		var t = new eui.Group();
		t.anchorOffsetY = 0;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchThrough = true;
		t.elementsContent = [this.lblLimitDate_i(),this.groupPart_i(),this.groupCake_i(),this._Group2_i(),this.groupMake_i(),this.groupOpen_i(),this.groupTask_i(),this.groupGift_i()];
		return t;
	};
	_proto.lblLimitDate_i = function () {
		var t = new eui.Label();
		this.lblLimitDate = t;
		t.bold = true;
		t.horizontalCenter = 10.5;
		t.size = 22;
		t.strokeColor = 0xfff6d4;
		t.text = "";
		t.textColor = 0x5d4d2e;
		t.verticalCenter = -385;
		return t;
	};
	_proto.groupPart_i = function () {
		var t = new eui.Group();
		this.groupPart = t;
		t.horizontalCenter = 11;
		t.verticalCenter = -323.5;
		t.elementsContent = [this._Image3_i(),this.imagePart1_i(),this.imagePart2_i(),this.imagePart3_i(),this.imagePart4_i(),this.imagePart5_i()];
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_stage_bg_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.imagePart1_i = function () {
		var t = new eui.Image();
		this.imagePart1 = t;
		t.horizontalCenter = -156;
		t.name = "imagePart1";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "make_stage_1_off_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.imagePart2_i = function () {
		var t = new eui.Image();
		this.imagePart2 = t;
		t.horizontalCenter = -75;
		t.name = "imagePart2";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "make_stage_2_off_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.imagePart3_i = function () {
		var t = new eui.Image();
		this.imagePart3 = t;
		t.horizontalCenter = 5;
		t.name = "imagePart3";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "make_stage_3_off_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.imagePart4_i = function () {
		var t = new eui.Image();
		this.imagePart4 = t;
		t.horizontalCenter = 86;
		t.name = "imagePart4";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "make_stage_4_off_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.imagePart5_i = function () {
		var t = new eui.Image();
		this.imagePart5 = t;
		t.horizontalCenter = 161;
		t.name = "imagePart5";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "make_stage_5_off_png";
		t.verticalCenter = -5;
		return t;
	};
	_proto.groupCake_i = function () {
		var t = new eui.Group();
		this.groupCake = t;
		t.horizontalCenter = 6;
		t.touchThrough = true;
		t.verticalCenter = 0;
		t.elementsContent = [this._Image4_i(),this.imageCake1_1_i(),this.imageCake1_2_i(),this.imageCake2_1_i(),this.imageCake2_2_i(),this.imageCake3_1_i(),this.imageCake5_1_i(),this.imageCake4_1_i(),this.imageCake4_2_i(),this.imageCake4_3_i(),this.imageCake4_4_i(),this.imageCake4_5_i(),this.imageCake4_6_i(),this.imageCake4_7_i(),this.imageCake4_8_i()];
		return t;
	};
	_proto._Image4_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = -6;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_0_1_on_png";
		t.verticalCenter = 502;
		return t;
	};
	_proto.imageCake1_1_i = function () {
		var t = new eui.Image();
		this.imageCake1_1 = t;
		t.horizontalCenter = 0;
		t.name = "imageCake1_1";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_1_1_on_png";
		t.verticalCenter = 293;
		return t;
	};
	_proto.imageCake1_2_i = function () {
		var t = new eui.Image();
		this.imageCake1_2 = t;
		t.horizontalCenter = -11.5;
		t.name = "imageCake1_2";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_1_2_on_png";
		t.verticalCenter = 125;
		return t;
	};
	_proto.imageCake2_1_i = function () {
		var t = new eui.Image();
		this.imageCake2_1 = t;
		t.horizontalCenter = 18.5;
		t.name = "imageCake2_1";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_2_1_on_png";
		t.verticalCenter = 105.5;
		return t;
	};
	_proto.imageCake2_2_i = function () {
		var t = new eui.Image();
		this.imageCake2_2 = t;
		t.horizontalCenter = -1.5;
		t.name = "imageCake2_2";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_2_2_on_png";
		t.verticalCenter = 290.5;
		return t;
	};
	_proto.imageCake3_1_i = function () {
		var t = new eui.Image();
		this.imageCake3_1 = t;
		t.horizontalCenter = 7;
		t.name = "imageCake3_1";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_3_1_on_png";
		t.verticalCenter = -33;
		return t;
	};
	_proto.imageCake5_1_i = function () {
		var t = new eui.Image();
		this.imageCake5_1 = t;
		t.horizontalCenter = 20;
		t.name = "imageCake5_1";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_5_1_on_png";
		t.verticalCenter = -187.5;
		return t;
	};
	_proto.imageCake4_1_i = function () {
		var t = new eui.Image();
		this.imageCake4_1 = t;
		t.horizontalCenter = -35.5;
		t.name = "imageCake4_1";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_4_1_on_png";
		t.verticalCenter = -129;
		return t;
	};
	_proto.imageCake4_2_i = function () {
		var t = new eui.Image();
		this.imageCake4_2 = t;
		t.horizontalCenter = 114;
		t.name = "imageCake4_2";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_4_2_on_png";
		t.verticalCenter = 5.5;
		return t;
	};
	_proto.imageCake4_3_i = function () {
		var t = new eui.Image();
		this.imageCake4_3 = t;
		t.horizontalCenter = -94.5;
		t.name = "imageCake4_3";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_4_3_on_png";
		t.verticalCenter = 13.5;
		return t;
	};
	_proto.imageCake4_4_i = function () {
		var t = new eui.Image();
		this.imageCake4_4 = t;
		t.horizontalCenter = 140;
		t.name = "imageCake4_4";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_4_4_on_png";
		t.verticalCenter = 181;
		return t;
	};
	_proto.imageCake4_5_i = function () {
		var t = new eui.Image();
		this.imageCake4_5 = t;
		t.horizontalCenter = -188;
		t.name = "imageCake4_5";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_4_5_on_png";
		t.verticalCenter = 188;
		return t;
	};
	_proto.imageCake4_6_i = function () {
		var t = new eui.Image();
		this.imageCake4_6 = t;
		t.horizontalCenter = -249.5;
		t.name = "imageCake4_6";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_4_6_on_png";
		t.verticalCenter = 294.5;
		return t;
	};
	_proto.imageCake4_7_i = function () {
		var t = new eui.Image();
		this.imageCake4_7 = t;
		t.horizontalCenter = 211.5;
		t.name = "imageCake4_7";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_4_7_on_png";
		t.verticalCenter = 325.5;
		return t;
	};
	_proto.imageCake4_8_i = function () {
		var t = new eui.Image();
		this.imageCake4_8 = t;
		t.horizontalCenter = -63.5;
		t.name = "imageCake4_8";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_make_4_8_on_png";
		t.verticalCenter = 373.5;
		return t;
	};
	_proto._Group2_i = function () {
		var t = new eui.Group();
		t.left = 10;
		t.verticalCenter = -172;
		t.elementsContent = [this._Image5_i(),this._Image6_i(),this._Image7_i(),this.lbCream_i(),this.lbSugar_i()];
		return t;
	};
	_proto._Image5_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "cake_item_bg_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto._Image6_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = -0.5;
		t.scaleX = 0.35;
		t.scaleY = 0.35;
		t.source = "goods_91_png";
		t.verticalCenter = -49;
		return t;
	};
	_proto._Image7_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = -0.5;
		t.scaleX = 0.35;
		t.scaleY = 0.35;
		t.source = "goods_92_png";
		t.verticalCenter = 39;
		return t;
	};
	_proto.lbCream_i = function () {
		var t = new eui.Label();
		this.lbCream = t;
		t.horizontalCenter = 0.5;
		t.size = 24;
		t.text = "x20";
		t.textColor = 0x545d4c;
		t.verticalCenter = -14;
		return t;
	};
	_proto.lbSugar_i = function () {
		var t = new eui.Label();
		this.lbSugar = t;
		t.horizontalCenter = 0.5;
		t.size = 24;
		t.text = "x20";
		t.textColor = 0x545D4C;
		t.verticalCenter = 77;
		return t;
	};
	_proto.groupMake_i = function () {
		var t = new eui.Group();
		this.groupMake = t;
		t.horizontalCenter = 3;
		t.verticalCenter = 500;
		t.elementsContent = [this.btnMake_i(),this.lbCreamMake_i(),this.lbSugarMake_i()];
		return t;
	};
	_proto.btnMake_i = function () {
		var t = new ImageButton();
		this.btnMake = t;
		t.horizontalCenter = 0;
		t.source = "btn_cake_consume_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.lbCreamMake_i = function () {
		var t = new eui.Label();
		this.lbCreamMake = t;
		t.horizontalCenter = -2.5;
		t.size = 26;
		t.text = "";
		t.textColor = 0x545D4C;
		t.verticalCenter = 16.5;
		return t;
	};
	_proto.lbSugarMake_i = function () {
		var t = new eui.Label();
		this.lbSugarMake = t;
		t.horizontalCenter = 85.5;
		t.size = 26;
		t.text = "";
		t.textColor = 0x545D4C;
		t.verticalCenter = 16.5;
		return t;
	};
	_proto.groupOpen_i = function () {
		var t = new eui.Group();
		this.groupOpen = t;
		t.horizontalCenter = 3;
		t.verticalCenter = 500;
		t.visible = false;
		t.elementsContent = [this._Image8_i(),this.lbOpen_i()];
		return t;
	};
	_proto._Image8_i = function () {
		var t = new eui.Image();
		t.height = 80;
		t.horizontalCenter = 0;
		t.source = "frame_03_png";
		t.verticalCenter = 0;
		t.width = 420;
		return t;
	};
	_proto.lbOpen_i = function () {
		var t = new eui.Label();
		this.lbOpen = t;
		t.bold = true;
		t.horizontalCenter = 0;
		t.size = 30;
		t.text = "";
		t.textAlign = "center";
		t.textColor = 0x545D4C;
		t.verticalCenter = 0;
		return t;
	};
	_proto.groupTask_i = function () {
		var t = new eui.Group();
		this.groupTask = t;
		t.right = -480;
		t.touchThrough = true;
		t.verticalCenter = 14;
		t.elementsContent = [this.coverTask_i(),this.btnTask_i(),this._Image9_i(),this._Group3_i(),this._Label1_i()];
		return t;
	};
	_proto.coverTask_i = function () {
		var t = new eui.Rect();
		this.coverTask = t;
		t.bottom = -500;
		t.fillAlpha = 0.2;
		t.left = -800;
		t.right = -200;
		t.top = -500;
		t.visible = false;
		return t;
	};
	_proto.btnTask_i = function () {
		var t = new Button();
		this.btnTask = t;
		t.horizontalCenter = -232;
		t.label = "";
		t.verticalCenter = 0;
		t.skinName = $exmlClass457$Skin461;
		return t;
	};
	_proto._Image9_i = function () {
		var t = new eui.Image();
		t.height = 500;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(21,21,18,19);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "frame_14_png";
		t.verticalCenter = 0;
		t.width = 420;
		return t;
	};
	_proto._Group3_i = function () {
		var t = new eui.Group();
		t.height = 500;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.width = 420;
		t.elementsContent = [this.list_i()];
		return t;
	};
	_proto.list_i = function () {
		var t = new eui.List();
		this.list = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.layout = this._VerticalLayout1_i();
		t.itemRendererSkinName = $exmlClass457$Skin462;
		return t;
	};
	_proto._VerticalLayout1_i = function () {
		var t = new eui.VerticalLayout();
		t.gap = 0;
		t.paddingTop = 8;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.bold = true;
		t.horizontalCenter = 0;
		t.size = 20;
		t.text = "任务隔天刷新，而每周一0点会恢复次数";
		t.textColor = 0x545D4C;
		t.verticalCenter = 225;
		return t;
	};
	_proto.groupGift_i = function () {
		var t = new eui.Group();
		this.groupGift = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.visible = false;
		t.elementsContent = [this.cover_i(),this._Image10_i(),this.lbGift_i(),this.groupItem_i(),this.btnOpen_i()];
		return t;
	};
	_proto.cover_i = function () {
		var t = new eui.Rect();
		this.cover = t;
		t.bottom = 0;
		t.fillAlpha = 0.2;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto._Image10_i = function () {
		var t = new eui.Image();
		t.height = 350;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(22,23,17,15);
		t.source = "frame_14_png";
		t.verticalCenter = 0;
		t.width = 400;
		return t;
	};
	_proto.lbGift_i = function () {
		var t = new eui.Label();
		this.lbGift = t;
		t.horizontalCenter = 0;
		t.lineSpacing = 6;
		t.size = 24;
		t.text = "";
		t.textAlign = "center";
		t.textColor = 0x545D4C;
		t.verticalAlign = "top";
		t.verticalCenter = -107;
		return t;
	};
	_proto.groupItem_i = function () {
		var t = new eui.Group();
		this.groupItem = t;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.layout = this._HorizontalLayout1_i();
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.gap = 10;
		return t;
	};
	_proto.btnOpen_i = function () {
		var t = new ImageButton();
		this.btnOpen = t;
		t.horizontalCenter = 0;
		t.source = "btn_receive_png";
		t.verticalCenter = 112;
		return t;
	};
	return $exmlClass457;
})(eui.Skin);