generateEUI.paths['resource/China/skins/AnnualReview/AnnualReviewChatPageSkin.exml'] = window.$exmlClass32 = (function (_super) {
	__extends($exmlClass32, _super);
	var $exmlClass32$Skin33 = 	(function (_super) {
		__extends($exmlClass32$Skin33, _super);
		var $exmlClass32$Skin33$Skin34 = 		(function (_super) {
			__extends($exmlClass32$Skin33$Skin34, _super);
			function $exmlClass32$Skin33$Skin34() {
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
			var _proto = $exmlClass32$Skin33$Skin34.prototype;

			_proto._Image1_i = function () {
				var t = new eui.Image();
				t.percentHeight = 100;
				t.source = "year_summary_png";
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
			return $exmlClass32$Skin33$Skin34;
		})(eui.Skin);

		var $exmlClass32$Skin33$Skin35 = 		(function (_super) {
			__extends($exmlClass32$Skin33$Skin35, _super);
			function $exmlClass32$Skin33$Skin35() {
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
			var _proto = $exmlClass32$Skin33$Skin35.prototype;

			_proto._Image1_i = function () {
				var t = new eui.Image();
				t.percentHeight = 100;
				t.source = "year_summary_review_png";
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
			return $exmlClass32$Skin33$Skin35;
		})(eui.Skin);

		function $exmlClass32$Skin33() {
			_super.call(this);
			this.skinParts = ["fadein","fadeout","imgBg","lblContent","btnCreate","btnReview","group"];
			
			this.height = 128;
			this.fadein_i();
			this.fadeout_i();
			this.elementsContent = [this.group_i()];
			this.imgBg_i();
			
			this.lblContent_i();
			
			this.btnCreate_i();
			
			this.btnReview_i();
			
			this.states = [
				new eui.State ("type1",
					[
						new eui.AddItems("imgBg","group",0,""),
						new eui.AddItems("lblContent","group",1,"")
					])
				,
				new eui.State ("type2",
					[
						new eui.AddItems("imgBg","group",0,""),
						new eui.AddItems("lblContent","group",1,""),
						new eui.SetProperty("imgBg","source","summary_paper_size2_png"),
						new eui.SetProperty("","height",174)
					])
				,
				new eui.State ("type3",
					[
						new eui.AddItems("imgBg","group",0,""),
						new eui.AddItems("lblContent","group",1,""),
						new eui.SetProperty("imgBg","source","summary_paper_size3_png"),
						new eui.SetProperty("","height",255)
					])
				,
				new eui.State ("finish",
					[
						new eui.AddItems("btnCreate","group",1,""),
						new eui.AddItems("btnReview","group",1,""),
						new eui.SetProperty("","height",198)
					])
			];
			
			eui.Binding.$bindProperties(this, ["group"],[0],this._TweenItem1,"target");
			eui.Binding.$bindProperties(this, [0],[],this._Object1,"alpha");
			eui.Binding.$bindProperties(this, [20],[],this._Object1,"y");
			eui.Binding.$bindProperties(this, [1],[],this._Object2,"alpha");
			eui.Binding.$bindProperties(this, [0],[],this._Object2,"y");
			eui.Binding.$bindProperties(this, ["group"],[0],this._TweenItem2,"target");
			eui.Binding.$bindProperties(this, [1],[],this._Object3,"alpha");
			eui.Binding.$bindProperties(this, [0],[],this._Object3,"y");
			eui.Binding.$bindProperties(this, [0],[],this._Object4,"alpha");
			eui.Binding.$bindProperties(this, [-20],[],this._Object4,"y");
		}
		var _proto = $exmlClass32$Skin33.prototype;

		_proto.fadein_i = function () {
			var t = new egret.tween.TweenGroup();
			this.fadein = t;
			t.items = [this._TweenItem1_i()];
			return t;
		};
		_proto._TweenItem1_i = function () {
			var t = new egret.tween.TweenItem();
			this._TweenItem1 = t;
			t.paths = [this._Set1_i(),this._To1_i()];
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
		_proto._To1_i = function () {
			var t = new egret.tween.To();
			t.duration = 150;
			t.props = this._Object2_i();
			return t;
		};
		_proto._Object2_i = function () {
			var t = {};
			this._Object2 = t;
			return t;
		};
		_proto.fadeout_i = function () {
			var t = new egret.tween.TweenGroup();
			this.fadeout = t;
			t.items = [this._TweenItem2_i()];
			return t;
		};
		_proto._TweenItem2_i = function () {
			var t = new egret.tween.TweenItem();
			this._TweenItem2 = t;
			t.paths = [this._Set2_i(),this._To2_i()];
			return t;
		};
		_proto._Set2_i = function () {
			var t = new egret.tween.Set();
			t.props = this._Object3_i();
			return t;
		};
		_proto._Object3_i = function () {
			var t = {};
			this._Object3 = t;
			return t;
		};
		_proto._To2_i = function () {
			var t = new egret.tween.To();
			t.duration = 150;
			t.props = this._Object4_i();
			return t;
		};
		_proto._Object4_i = function () {
			var t = {};
			this._Object4 = t;
			return t;
		};
		_proto.group_i = function () {
			var t = new eui.Group();
			this.group = t;
			t.x = 0;
			t.elementsContent = [];
			return t;
		};
		_proto.imgBg_i = function () {
			var t = new eui.Image();
			this.imgBg = t;
			t.source = "summary_paper_size1_png";
			return t;
		};
		_proto.lblContent_i = function () {
			var t = new eui.Label();
			this.lblContent = t;
			t.bottom = 25;
			t.lineSpacing = 12;
			t.textColor = 0x545a4f;
			t.top = 31;
			t.width = 413;
			t.x = 28;
			return t;
		};
		_proto.btnCreate_i = function () {
			var t = new Button();
			this.btnCreate = t;
			t.skinName = $exmlClass32$Skin33$Skin34;
			return t;
		};
		_proto.btnReview_i = function () {
			var t = new Button();
			this.btnReview = t;
			t.x = 332;
			t.y = 154;
			t.skinName = $exmlClass32$Skin33$Skin35;
			return t;
		};
		return $exmlClass32$Skin33;
	})(eui.Skin);

	var $exmlClass32$Skin36 = 	(function (_super) {
		__extends($exmlClass32$Skin36, _super);
		function $exmlClass32$Skin36() {
			_super.call(this);
			this.skinParts = ["tween","image"];
			
			this.tween_i();
			this.elementsContent = [this.image_i()];
			
			eui.Binding.$bindProperties(this, ["image"],[0],this._TweenItem1,"target");
			eui.Binding.$bindProperties(this, [1],[],this._Object1,"alpha");
			eui.Binding.$bindProperties(this, [20],[],this._Object1,"y");
			eui.Binding.$bindProperties(this, [1],[],this._Object2,"alpha");
			eui.Binding.$bindProperties(this, [10],[],this._Object2,"y");
			eui.Binding.$bindProperties(this, [0.5],[],this._Object3,"alpha");
			eui.Binding.$bindProperties(this, [0],[],this._Object3,"y");
			eui.Binding.$bindProperties(this, [0],[],this._Object4,"alpha");
		}
		var _proto = $exmlClass32$Skin36.prototype;

		_proto.tween_i = function () {
			var t = new egret.tween.TweenGroup();
			this.tween = t;
			t.items = [this._TweenItem1_i()];
			return t;
		};
		_proto._TweenItem1_i = function () {
			var t = new egret.tween.TweenItem();
			this._TweenItem1 = t;
			t.paths = [this._Set1_i(),this._To1_i(),this._To2_i(),this._To3_i(),this._Wait1_i(),this._Set2_i()];
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
		_proto._To1_i = function () {
			var t = new egret.tween.To();
			t.duration = 500;
			t.props = this._Object2_i();
			return t;
		};
		_proto._Object2_i = function () {
			var t = {};
			this._Object2 = t;
			return t;
		};
		_proto._To2_i = function () {
			var t = new egret.tween.To();
			t.duration = 500;
			t.props = this._Object3_i();
			return t;
		};
		_proto._Object3_i = function () {
			var t = {};
			this._Object3 = t;
			return t;
		};
		_proto._To3_i = function () {
			var t = new egret.tween.To();
			t.duration = 500;
			t.props = this._Object4_i();
			return t;
		};
		_proto._Object4_i = function () {
			var t = {};
			this._Object4 = t;
			return t;
		};
		_proto._Wait1_i = function () {
			var t = new egret.tween.Wait();
			t.duration = 1000;
			return t;
		};
		_proto._Set2_i = function () {
			var t = new egret.tween.Set();
			return t;
		};
		_proto.image_i = function () {
			var t = new eui.Image();
			this.image = t;
			t.source = "summary_page2_png";
			return t;
		};
		return $exmlClass32$Skin36;
	})(eui.Skin);

	function $exmlClass32() {
		_super.call(this);
		this.skinParts = ["list","scroller","imgArrow"];
		
		this.height = 1136;
		this.width = 640;
		this.elementsContent = [this._Image1_i(),this.scroller_i(),this.imgArrow_i()];
		
		eui.Binding.$bindProperties(this, ["imgArrow.tween"],[0],this._AutoTweenGear1,"tweenGroup");
	}
	var _proto = $exmlClass32.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.source = "back_summary2_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.scroller_i = function () {
		var t = new eui.Scroller();
		this.scroller = t;
		t.height = 856;
		t.horizontalCenter = 0;
		t.verticalCenter = -10;
		t.width = 580;
		t.viewport = this.list_i();
		return t;
	};
	_proto.list_i = function () {
		var t = new eui.List();
		this.list = t;
		t.itemRendererSkinName = $exmlClass32$Skin33;
		t.layout = this._VerticalLayout1_i();
		return t;
	};
	_proto._VerticalLayout1_i = function () {
		var t = new eui.VerticalLayout();
		t.gap = 20;
		t.horizontalAlign = "contentJustify";
		return t;
	};
	_proto.imgArrow_i = function () {
		var t = new GearComponent();
		this.imgArrow = t;
		t.bottom = 40;
		t.horizontalCenter = 0;
		t.skinName = $exmlClass32$Skin36;
		t.gears = [this._AutoTweenGear1_i()];
		return t;
	};
	_proto._AutoTweenGear1_i = function () {
		var t = new AutoTweenGear();
		this._AutoTweenGear1 = t;
		return t;
	};
	return $exmlClass32;
})(eui.Skin);