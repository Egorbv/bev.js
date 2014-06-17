function Bev()
{
    this.IsRTL = false;

    this.DropDownContentMinHeight = 100;
    this.DropDownContentMaxHeight = 200;

    var instance = this;
    document.onreadystatechange = function () { instance.OnLoadDocument(); };
}

//Обработчик загрузки документа
//Попытка инициализации контролера (если он указан в теге BODY) и вызов его метода инициализации компонентов
Bev.prototype.OnLoadDocument = function()
{
	if (document.readyState == "complete")
	{
		var controllerName = document.body.getAttribute("data-controller");
		if (controllerName != null && controllerName != "")
		{
			var controller = eval("new " + controllerName);
			if (controller == null)
			{
				this.ShowError("Не удалось создать контроллер");
			}

			if (controller.InitializeComponent == null)
			{
				this.ShowError("У контроллера нет метода инициализации компонентов (InitializeComponent)");
			}
			controller.InitializeComponent(this);
		}
	}
}

Bev.prototype.InitComboBox = function(id, setting)
{
	return new Combobox(id, setting);
}








	Bev.prototype.AttachEvent = function(domElement, ev, handler)
	{
		if (domElement.attachEvent)
		{
			domElement.attachEvent("on" + ev, handler);
		}
		else
		{
			domElement.addEventListener(ev, handler);
		}
	}

	Bev.prototype.DettachEvent = function (domElement, ev, handler)
	{
		if (domElement.detachEvent)
		{
			domElement.detachEvent("on" + ev, handler);
		}
		else
		{
			domElement.removeEventListener(ev, handler);
		}
	}


	Bev.prototype.GetTopCorner = function (element)
	{
		var e = event;
		var obj = element;
		var top = 0;
		var left = 0;
		while (obj != document.body)
		{
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.parentNode;
		}
		return { x: left, y: top };
	}

	//Отображение сообщения об ошибке
	Bev.prototype.ShowError = function(str)
	{
		alert(str);
	}
	var bev = new Bev();