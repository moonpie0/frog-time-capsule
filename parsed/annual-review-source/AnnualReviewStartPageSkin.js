generateEUI.paths['resource/China/skins/AnnualReview/AnnualReviewStartPageSkin.exml'] = window.$exmlClass41 = (function (_super) {
	__extends($exmlClass41, _super);
	var $exmlClass41$Skin42 = 	(function (_super) {
		__extends($exmlClass41$Skin42, _super);
		function $exmlClass41$Skin42() {
			_super.call(this);
			this.skinParts = ["image_tween","image"];
			
			this.image_tween_i();
			this.elementsContent = [this.image_i()];
			
			eui.Binding.$bindProperties(this, ["image"],[0],this._TweenItem1,"target");
			eui.Binding.$bindProperties(this, [15],[],this._Object1,"y");
			eui.Binding.$bindProperties(this, [0],[],this._Object2,"y");
		}
		var _proto = $exmlClass41$Skin42.prototype;

		_proto.image_tween_i = function () {
			var t = new egret.tween.TweenGroup();
			this.image_tween = t;
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
			t.duration = 1000;
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
			t.duration = 1000;
			t.props = this._Object2_i();
			return t;
		};
		_proto._Object2_i = function () {
			var t = {};
			this._Object2 = t;
			return t;
		};
		_proto.image_i = function () {
			var t = new eui.Image();
			this.image = t;
			t.source = "summary_page1_4_png";
			return t;
		};
		return $exmlClass41$Skin42;
	})(eui.Skin);

	function $exmlClass41() {
		_super.call(this);
		this.skinParts = ["start_tween","image","image0","image1"];
		
		this.height = 1136;
		this.width = 640;
		this.start_tween_i();
		this.elementsContent = [this._Image1_i(),this._Image2_i(),this.image_i(),this.image0_i(),this.image1_i()];
		
		eui.Binding.$bindProperties(this, ["image"],[0],this._TweenItem1,"target");
		eui.Binding.$bindProperties(this, [0],[],this._Object1,"alpha");
		eui.Binding.$bindProperties(this, [0],[],this._Object2,"alpha");
		eui.Binding.$bindProperties(this, [1],[],this._Object3,"alpha");
		eui.Binding.$bindProperties(this, ["image0"],[0],this._TweenItem2,"target");
		eui.Binding.$bindProperties(this, [0],[],this._Object4,"alpha");
		eui.Binding.$bindProperties(this, [1],[],this._Object5,"alpha");
		eui.Binding.$bindProperties(this, ["image1"],[0],this._TweenItem3,"target");
		eui.Binding.$bindProperties(this, [0],[],this._Object6,"alpha");
		eui.Binding.$bindProperties(this, [1],[],this._Object7,"alpha");
		eui.Binding.$bindProperties(this, ["image1.image_tween"],[0],this._AutoTweenGear1,"tweenGroup");
	}
	var _proto = $exmlClass41.prototype;

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
		t.duration = 250;
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
		t.duration = 750;
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
		t.duration = 1000;
		return t;
	};
	_proto._Set4_i = function () {
		var t = new egret.tween.Set();
		return t;
	};
	_proto._To2_i = function () {
		var t = new egret.tween.To();
		t.duration = 750;
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
		t.duration = 1750;
		return t;
	};
	_proto._Set6_i = function () {
		var t = new egret.tween.Set();
		return t;
	};
	_proto._To3_i = function () {
		var t = new egret.tween.To();
		t.duration = 750;
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
		t.source = "back_summary1_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.source = "summary_page1_1_png";
		t.x = 52.19;
		t.y = 148.85;
		return t;
	};
	_proto.image_i = function () {
		var t = new eui.Image();
		this.image = t;
		t.alpha = 0;
		t.source = "summary_page1_2_png";
		t.x = 51.98;
		t.y = 352.88;
		return t;
	};
	_proto.image0_i = function () {
		var t = new eui.Image();
		this.image0 = t;
		t.alpha = 0;
		t.source = "summary_page1_3_png";
		t.x = 51.98;
		t.y = 540.12;
		return t;
	};
	_proto.image1_i = function () {
		var t = new GearComponent();
		this.image1 = t;
		t.alpha = 0;
		t.x = 22.98;
		t.y = 653.06;
		t.skinName = $exmlClass41$Skin42;
		t.gears = [this._AutoTweenGear1_i()];
		return t;
	};
	_proto._AutoTweenGear1_i = function () {
		var t = new AutoTweenGear();
		this._AutoTweenGear1 = t;
		return t;
	};
	return $exmlClass41;
})(eui.Skin);