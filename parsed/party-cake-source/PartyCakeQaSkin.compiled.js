generateEUI.paths['resource/China/skins/PartyCake/PartyCakeQaSkin.exml'] = window.$exmlClass452 = (function (_super) {
	__extends($exmlClass452, _super);
	function $exmlClass452() {
		_super.call(this);
		this.skinParts = ["cover","imageTitle","imageGuest","lbQue","imageSelect","groupAnswer","groupReward","btnOk"];
		
		this.height = 1136;
		this.width = 640;
		this.elementsContent = [this.cover_i(),this._Group7_i()];
	}
	var _proto = $exmlClass452.prototype;

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
	_proto._Group7_i = function () {
		var t = new eui.Group();
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.elementsContent = [this._Image1_i(),this.imageTitle_i(),this._Group1_i(),this.groupAnswer_i(),this.groupReward_i(),this.btnOk_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.anchorOffsetY = 0;
		t.fillMode = "scale";
		t.height = 570;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(17,17,17,17);
		t.source = "frame_gift_png";
		t.verticalCenter = 0;
		t.width = 500;
		return t;
	};
	_proto.imageTitle_i = function () {
		var t = new eui.Image();
		this.imageTitle = t;
		t.anchorOffsetY = 0;
		t.horizontalCenter = 0.5;
		t.source = "text_ask_answer_png";
		t.verticalCenter = -228;
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.horizontalCenter = 0;
		t.verticalCenter = -114;
		t.elementsContent = [this._Image2_i(),this.imageGuest_i(),this.lbQue_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.anchorOffsetY = 0;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "neighbor_ask_bg_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.imageGuest_i = function () {
		var t = new eui.Image();
		this.imageGuest = t;
		t.anchorOffsetY = 0;
		t.horizontalCenter = -151;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "neighbor_emote_2_0_png";
		t.verticalCenter = 7;
		return t;
	};
	_proto.lbQue_i = function () {
		var t = new eui.Label();
		this.lbQue = t;
		t.bold = true;
		t.fontFamily = "SimHei";
		t.horizontalCenter = 56;
		t.lineSpacing = 10;
		t.size = 30;
		t.text = "以下哪个食物跳跳看起来最喜欢";
		t.textAlign = "left";
		t.textColor = 0x545d4c;
		t.verticalCenter = 9;
		t.width = 250;
		return t;
	};
	_proto.groupAnswer_i = function () {
		var t = new eui.Group();
		this.groupAnswer = t;
		t.horizontalCenter = 0;
		t.verticalCenter = 80;
		t.visible = false;
		t.elementsContent = [this._Group2_i(),this._Group3_i(),this._Group4_i(),this.imageSelect_i()];
		return t;
	};
	_proto._Group2_i = function () {
		var t = new eui.Group();
		t.horizontalCenter = -153;
		t.verticalCenter = 0;
		t.elementsContent = [this._Image3_i(),this._Image4_i()];
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.anchorOffsetY = 0;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "neighbor_answer_bg_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto._Image4_i = function () {
		var t = new eui.Image();
		t.height = 120;
		t.horizontalCenter = 0;
		t.source = "";
		t.verticalCenter = 0;
		t.width = 120;
		return t;
	};
	_proto._Group3_i = function () {
		var t = new eui.Group();
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.x = 10;
		t.y = 10;
		t.elementsContent = [this._Image5_i(),this._Image6_i()];
		return t;
	};
	_proto._Image5_i = function () {
		var t = new eui.Image();
		t.anchorOffsetY = 0;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "neighbor_answer_bg_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto._Image6_i = function () {
		var t = new eui.Image();
		t.height = 120;
		t.horizontalCenter = 0;
		t.source = "";
		t.verticalCenter = 0;
		t.width = 120;
		return t;
	};
	_proto._Group4_i = function () {
		var t = new eui.Group();
		t.horizontalCenter = 153;
		t.verticalCenter = 0;
		t.x = 20;
		t.y = 20;
		t.elementsContent = [this._Image7_i(),this._Image8_i()];
		return t;
	};
	_proto._Image7_i = function () {
		var t = new eui.Image();
		t.anchorOffsetY = 0;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "neighbor_answer_bg_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto._Image8_i = function () {
		var t = new eui.Image();
		t.height = 120;
		t.horizontalCenter = 0;
		t.source = "";
		t.verticalCenter = 0;
		t.width = 120;
		return t;
	};
	_proto.imageSelect_i = function () {
		var t = new eui.Image();
		this.imageSelect = t;
		t.anchorOffsetY = 0;
		t.height = 150;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(22,33,34,30);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "frame_placed_user_png";
		t.verticalCenter = 0;
		t.visible = false;
		t.width = 150;
		t.x = 10;
		t.y = 10;
		return t;
	};
	_proto.groupReward_i = function () {
		var t = new eui.Group();
		this.groupReward = t;
		t.horizontalCenter = 0;
		t.verticalCenter = 80;
		t.visible = false;
		t.elementsContent = [this._Group5_i(),this._Group6_i()];
		return t;
	};
	_proto._Group5_i = function () {
		var t = new eui.Group();
		t.horizontalCenter = -80;
		t.verticalCenter = 0;
		t.elementsContent = [this._Image9_i(),this._Image10_i(),this._Label1_i()];
		return t;
	};
	_proto._Image9_i = function () {
		var t = new eui.Image();
		t.alpha = 0.5;
		t.anchorOffsetY = 0;
		t.horizontalCenter = 0;
		t.scaleX = 0.5;
		t.scaleY = 0.5;
		t.source = "item_back_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto._Image10_i = function () {
		var t = new eui.Image();
		t.height = 120;
		t.horizontalCenter = 0;
		t.source = "";
		t.verticalCenter = 0;
		t.width = 120;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.bold = true;
		t.bottom = 3;
		t.fontFamily = "SimHei";
		t.lineSpacing = 10;
		t.right = 3;
		t.size = 30;
		t.text = "";
		t.textAlign = "right";
		t.textColor = 0x545D4C;
		return t;
	};
	_proto._Group6_i = function () {
		var t = new eui.Group();
		t.horizontalCenter = 80;
		t.verticalCenter = 0;
		t.y = 10;
		t.elementsContent = [this._Image11_i(),this._Image12_i(),this._Label2_i()];
		return t;
	};
	_proto._Image11_i = function () {
		var t = new eui.Image();
		t.alpha = 0.5;
		t.anchorOffsetY = 0;
		t.horizontalCenter = 0;
		t.scaleX = 0.5;
		t.scaleY = 0.5;
		t.source = "item_back_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto._Image12_i = function () {
		var t = new eui.Image();
		t.height = 120;
		t.horizontalCenter = 0;
		t.source = "";
		t.verticalCenter = 0;
		t.width = 120;
		return t;
	};
	_proto._Label2_i = function () {
		var t = new eui.Label();
		t.bold = true;
		t.bottom = 3;
		t.fontFamily = "SimHei";
		t.lineSpacing = 10;
		t.right = 3;
		t.size = 30;
		t.text = "";
		t.textAlign = "right";
		t.textColor = 0x545D4C;
		return t;
	};
	_proto.btnOk_i = function () {
		var t = new ImageButton();
		this.btnOk = t;
		t.horizontalCenter = 0;
		t.source = "btn_receive_png";
		t.verticalCenter = 220;
		return t;
	};
	return $exmlClass452;
})(eui.Skin);