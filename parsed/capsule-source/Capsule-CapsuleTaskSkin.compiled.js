generateEUI.paths['resource/China/skins/Capsule/CapsuleTaskSkin.exml'] = window.$exmlClass56 = (function (_super) {
	__extends($exmlClass56, _super);
	function $exmlClass56() {
		_super.call(this);
		this.skinParts = ["cover","lbTitle","lbTask","btnFast","lbClover"];
		
		this.height = 1136;
		this.width = 640;
		this.elementsContent = [this.cover_i(),this._Group1_i()];
	}
	var _proto = $exmlClass56.prototype;

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
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.elementsContent = [this._Image1_i(),this._Image2_i(),this.lbTitle_i(),this.lbTask_i(),this.btnFast_i(),this.lbClover_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.anchorOffsetY = 0;
		t.fillMode = "scale";
		t.height = 204;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(17,17,17,17);
		t.source = "frame_13_png";
		t.verticalCenter = -2;
		t.width = 400;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.anchorOffsetY = 0;
		t.height = 150;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(12,17,35,26);
		t.scaleY = 0.5;
		t.source = "zukan_santi_png";
		t.verticalCenter = -49.5;
		t.width = 379;
		return t;
	};
	_proto.lbTitle_i = function () {
		var t = new eui.Label();
		this.lbTitle = t;
		t.bold = true;
		t.fontFamily = "SimHei";
		t.horizontalCenter = 0;
		t.lineSpacing = 10;
		t.size = 30;
		t.text = "";
		t.textAlign = "center";
		t.textColor = 0x409fea;
		t.verticalCenter = -65;
		return t;
	};
	_proto.lbTask_i = function () {
		var t = new eui.Label();
		this.lbTask = t;
		t.bold = true;
		t.fontFamily = "SimHei";
		t.horizontalCenter = 0;
		t.lineSpacing = 10;
		t.size = 24;
		t.text = "";
		t.textAlign = "center";
		t.textColor = 0x545A4F;
		t.verticalCenter = -32;
		return t;
	};
	_proto.btnFast_i = function () {
		var t = new ImageButton();
		this.btnFast = t;
		t.horizontalCenter = 0;
		t.source = "btn_finish_capsule_png";
		t.verticalCenter = 44;
		return t;
	};
	_proto.lbClover_i = function () {
		var t = new eui.BitmapLabel();
		this.lbClover = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.font = "sys_num_20_29_fnt";
		t.horizontalCenter = 53;
		t.text = "";
		t.touchEnabled = false;
		t.verticalCenter = 44.5;
		return t;
	};
	return $exmlClass56;
})(eui.Skin);