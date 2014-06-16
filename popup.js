function Popup(setting)
{
	var e = event;
	var x = e.clientX + document.body.scrollLeft;
	var y = e.clientY + document.body.scrollTop;


	this.Panel = document.createElement("div");
	this.Panel.className = "popup";
	this.Panel.style.width = "200px";
	this.Panel.style.height = "200px";
	this.Panel.style.top = y + "px";
	this.Panel.style.left = x + "px";



	if (setting != null)
	{
		if (setting.element != null)
		{
			alert(5);
		}
		if (setting.conent != null)
		{

		}
	}

	document.body.appendChild(this.Panel);

	var instance = this;
	this.Panel.onmousedown = function () { instance.PanelClick() };
	this._bodyClick = function () { instance.BodyClick(); };
	bev.AttachEvent(document, "mousedown", this._bodyClick);
}

//Обработка клика вне нажатия всплывающей панели
Popup.prototype.BodyClick = function ()
{
	bev.DettachEvent(document, "mousedown", this._bodyClick);
	document.body.removeChild(this.Panel);
}

//Обработчик клика в сплывающей панели
Popup.prototype.PanelClick = function ()
{
	alert(5);
}