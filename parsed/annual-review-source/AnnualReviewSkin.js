generateEUI.paths['resource/China/skins/AnnualReview/AnnualReviewSkin.exml'] = window.$exmlClass39 = (function (_super) {
	__extends($exmlClass39, _super);
	var $exmlClass39$Skin40 = 	(function (_super) {
		__extends($exmlClass39$Skin40, _super);
		function $exmlClass39$Skin40() {
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
		var _proto = $exmlClass39$Skin40.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "back_84_88_png";
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
		return $exmlClass39$Skin40;
	})(eui.Skin);

	function $exmlClass39() {
		_super.call(this);
		this.skinParts = ["pageGroup","btnClose"];
		
		this.height = 1136;
		this.width = 640;
		this.elementsContent = [this._Image1_i(),this.pageGroup_i(),this.btnClose_i()];
	}
	var _proto = $exmlClass39.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.source = "back_summary1_png";
		t.verticalCenter = 0;
		return t;
	};
	_proto.pageGroup_i = function () {
		var t = new PageGroup();
		this.pageGroup = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.btnClose_i = function () {
		var t = new Button();
		this.btnClose = t;
		t.label = "";
		t.left = 20;
		t.top = 30;
		t.skinName = $exmlClass39$Skin40;
		return t;
	};
	return $exmlClass39;
})(eui.Skin);