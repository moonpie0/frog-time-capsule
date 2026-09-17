generateEUI.paths['resource/China/skins/Capsule/CapsuleHistorySkin.exml'] = window.$exmlClass46 = (function (_super) {
	__extends($exmlClass46, _super);
	var $exmlClass46$Skin47 = 	(function (_super) {
		__extends($exmlClass46$Skin47, _super);
		function $exmlClass46$Skin47() {
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
		var _proto = $exmlClass46$Skin47.prototype;

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
		return $exmlClass46$Skin47;
	})(eui.Skin);

	var $exmlClass46$Skin48 = 	(function (_super) {
		__extends($exmlClass46$Skin48, _super);
		function $exmlClass46$Skin48() {
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
		var _proto = $exmlClass46$Skin48.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "back_84_88_png";
			t.percentWidth = 100;
			return t;
		};
		return $exmlClass46$Skin48;
	})(eui.Skin);

	function $exmlClass46() {
		_super.call(this);
		this.skinParts = ["btnRefreshTween","btnShare","btnClose","groupGet"];
		
		this.currentState = "normal";
		this.height = 1136;
		this.width = 640;
		this.btnRefreshTween_i();
		this.elementsContent = [this._Image1_i(),this._Image2_i(),this._Image3_i(),this._Group1_i(),this._Group2_i()];
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
	var _proto = $exmlClass46.prototype;

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
		t.source = "back_capsule_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.source = "back_capsule_score_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.source = "capsule_score_png";
		t.verticalCenter = -440;
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		this._Group1 = t;
		t.height = 72;
		t.left = 0;
		t.right = 0;
		t.elementsContent = [this.btnShare_i(),this.btnClose_i()];
		return t;
	};
	_proto.btnShare_i = function () {
		var t = new Button();
		this.btnShare = t;
		t.height = 88;
		t.label = "";
		t.right = 21;
		t.y = 19;
		t.skinName = $exmlClass46$Skin47;
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
		t.skinName = $exmlClass46$Skin48;
		return t;
	};
	_proto._Group2_i = function () {
		var t = new eui.Group();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 634.22;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.width = 594.94;
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
	return $exmlClass46;
})(eui.Skin);