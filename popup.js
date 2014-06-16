function Popup(setting)
{
	//список текущих настроек
	this.Setting = setting;
	var instance = this;
	this._bodyClick = function () { instance.BodyClick(); };
}


Popup.prototype.Show=function()
{
	var width = 400;
	//создаем основной контейнер
	if(this.Panel == null)
	{
		var instance = this;
		this.Panel = document.createElement("div");
		this.Panel.className = "popup";
		this.Panel.style.width = width + "px";
		this.Panel.style.height = "200px";
		this.Panel.visibility = "hidden";
		this.Panel.onmousedown = function () { instance.PanelClick() };
	}
	bev.AttachEvent(document, "mousedown", this._bodyClick);
	document.body.appendChild(this.Panel);
	this.Panel.style.width = width + "px";

	//получаем координаты по умолчанию
	var e = event;
	var x = e.clientX + document.body.scrollLeft;
	var y = e.clientY + document.body.scrollTop;

	var borderWidth = this.Panel.offsetWidth - this.Panel.clientWidth;
	var setting = this.Setting;
	if (setting != null)
	{
		//Если нужно выровнять по указанному элементу
		if (setting.element != null)
		{
			var position = bev.GetTopCorner(setting.element);
			if (bev.IsRTL == true)
			{
				x = position.x + setting.element.offsetWidth - this.Panel.offsetWidth;
				if(x < 0)
				{
					x = 0;
					var rect = window.ClientRect;
					if (document.body.clientWidth < this.Panel.offsetWidth)
					{
						this.Panel.style.width = document.documentElement.clientWidth - borderWidth + "px";
					}
				}
			}
			else
			{
				x = position.x;
			}
			y = position.y + setting.element.offsetHeight;
		}


		if (setting.conent != null)
		{

		}
	}

	this.Panel.style.top = y + "px";
	this.Panel.style.left = x + "px";
	this.Panel.visibility = "visible";
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
	alert("panel click");
}