generateEUI.paths['resource/China/skins/Share/CapsuleShareSkin.exml'] = window.PhotoShareSkin = (function (_super) {
	__extends(PhotoShareSkin, _super);
	function PhotoShareSkin() {
		_super.call(this);
		this.skinParts = ["capture_Tween","cover","groupGet","lbName","groupView"];
		
		this.height = 1136;
		this.width = 640;
		this.capture_Tween_i();
		this.elementsContent = [this.cover_i(),this.groupView_i()];
		
		eui.Binding.$bindProperties(this, ["hostComponent.c_view"],[0],this._TweenItem1,"target");
		eui.Binding.$bindProperties(this, [1],[],this._Object1,"scaleX");
		eui.Binding.$bindProperties(this, [1],[],this._Object1,"scaleY");
		eui.Binding.$bindProperties(this, [1],[],this._Object2,"scaleX");
		eui.Binding.$bindProperties(this, [1],[],this._Object2,"scaleY");
		eui.Binding.$bindProperties(this, [0],[],this._Object2,"x");
		eui.Binding.$bindProperties(this, [1136],[],this._Object2,"y");
		eui.Binding.$bindProperties(this, [0.3],[],this._Object3,"scaleX");
		eui.Binding.$bindProperties(this, [0.3],[],this._Object3,"scaleY");
		eui.Binding.$bindProperties(this, [20],[],this._Object3,"x");
		eui.Binding.$bindProperties(this, [1116],[],this._Object3,"y");
		eui.Binding.$bindProperties(this, ["hostComponent.i_capture"],[0],this._TweenItem2,"target");
		eui.Binding.$bindProperties(this, [1],[],this._Object4,"alpha");
		eui.Binding.$bindProperties(this, [1],[],this._Object5,"alpha");
		eui.Binding.$bindProperties(this, [0],[],this._Object6,"alpha");
	}
	var _proto = PhotoShareSkin.prototype;

	_proto.capture_Tween_i = function () {
		var t = new egret.tween.TweenGroup();
		this.capture_Tween = t;
		t.items = [this._TweenItem1_i(),this._TweenItem2_i()];
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
		t.duration = 500;
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
		t.duration = 250;
		return t;
	};
	_proto._Set4_i = function () {
		var t = new egret.tween.Set();
		t.props = this._Object5_i();
		return t;
	};
	_proto._Object5_i = function () {
		var t = {};
		this._Object5 = t;
		return t;
	};
	_proto._To2_i = function () {
		var t = new egret.tween.To();
		t.duration = 500;
		t.props = this._Object6_i();
		return t;
	};
	_proto._Object6_i = function () {
		var t = {};
		this._Object6 = t;
		return t;
	};
	_proto.cover_i = function () {
		var t = new eui.Image();
		this.cover = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "Square_png";
		t.top = 0;
		return t;
	};
	_proto.groupView_i = function () {
		var t = new eui.Group();
		this.groupView = t;
		t.height = 1136;
		t.width = 640;
		t.x = 0;
		t.y = 0;
		t.elementsContent = [this._Image1_i(),this._Image2_i(),this._Image3_i(),this._Group1_i(),this.lbName_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "back_capsule_png";
		t.verticalCenter = 0;
		t.x = -107;
		t.y = -142;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "back_capsule_score_png";
		t.verticalCenter = 0;
		t.x = -107;
		t.y = -142;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "back_capsule_share_png";
		t.verticalCenter = 0;
		t.x = -107;
		t.y = -142;
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 634.22;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.verticalCenter = 0;
		t.width = 594.94;
		t.x = 23;
		t.y = 251;
		t.elementsContent = [this.groupGet_i()];
		return t;
	};
	_proto.groupGet_i = function () {
		var t = new eui.Group();
		this.groupGet = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.x = 48;
		t.y = 130;
		return t;
	};
	_proto.lbName_i = function () {
		var t = new eui.Label();
		this.lbName = t;
		t.anchorOffsetX = 0;
		t.bold = true;
		t.horizontalCenter = 68;
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 26;
		t.text = "玩家名字的扭蛋记录";
		t.textAlign = "left";
		t.textColor = 0x545d4c;
		t.verticalCenter = -336;
		t.width = 374;
		t.x = 201;
		t.y = 219;
		return t;
	};
	return PhotoShareSkin;
})(eui.Skin);