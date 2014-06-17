function Combobox(setting)
{
	//основные проверки на правильность настроек инициализации компонента
	if (setting == null)
	{
		bev.ShowError("Combobox control - не переданы настройка выпадающего списка");
		return;
	}

	if (setting.onLoadData != null || setting.items != null)
	{
		if(setting.valueFieldName == null || setting.displayFieldName == null)
		{
			bev.ShowError("Combobox control - должны быть указаны названия полей для значения и отображения в источнике данных")
			return;
		}
	}


	this.Setting = setting;
	var cb = document.getElementsByClassName("combo-box")[0];
	var container = document.createElement("div");
	cb.parentNode.insertBefore(container, cb);
	cb = container;
	container.className = "combo-box";
	container.style.visibility = "visible";

	//Ссылка на элемент контейнер для выпадающего списка
	this.Root = cb;

	var button = document.createElement("span");
	this.Content = document.createElement("span");
	var icon = document.createElement("span");
	icon.className = "combo-box-button-icon";
	icon.innerHTML = "select";
	icon.style.visibility = "hidden";
	button.appendChild(icon);
	button.onmouseover = function () { icon.className = "combo-box-button-icon-hover" };
	button.onmouseout = function () { icon.className = "combo-box-button-icon"; }
	button.onclick = function () { instance.BeginShowDropDown(); };
	button.className = "combo-box-button"
	var instance = this;


	this.Content.className = "combo-box-content";

	if (bev.IsRTL == true)
	{
		button.style.left = "0px";
		this.Content.style.right = "0px";
		button.style.borderLeftWidth = "0px";
	}
	else
	{
		button.style.right = "0px";
		button.style.borderRightWidth = "0px";
		this.Content.style.left = "0px";
	}
	cb.appendChild(button);
	icon.style.top = parseInt((button.clientHeight - icon.offsetHeight) / 2) + "px";
	icon.style.left = parseInt((button.clientWidth - icon.offsetWidth) / 2) + "px";
	icon.style.visibility = "visible";

	this.Content.style.width = cb.clientWidth - button.offsetWidth + "px";
	this.Content.style.height = cb.clientHeight + "px";
	cb.appendChild(this.Content);

	var span = document.createElement("span");
	span.innerHTML = "5";
	this.Content.appendChild(span);

	var paddingTop = parseInt((this.Content.clientHeight - span.offsetHeight) / 2);
	this.Content.style.paddingTop = paddingTop + "px";
	this.Content.removeChild(span);


	this._onClickContentHandler = function () { instance.OnClickContent(); };

}

Combobox.prototype.BeginShowDropDown=function()
{
	var setting = this.Setting;
	if(setting.items == null && setting.onLoadData == null)
	{
		bev.ShowError("Combobox - не указаны данные или функция получения данных");
	}
	if(setting.onLoadData)
	{
		var instance = this;
		setting.onLoadData({ control: this, callback: function(){ instance.EndShowDropDown();} });
	}
	else
	{
		this.EndShowDropDown(setting.items)
	}
}

//Завершение отображение выпадающего списка
//data - список элементов для отображения
Combobox.prototype.EndShowDropDown = function(data)
{
	var setting = this.Setting;
	//Если всплывающая панель еще не создана - создаем ее
	if (this.DropDownContent == null) {
		var content = document.createElement("div");
		if (bev.IsRTL == true) {
			content.style.direction = "rtl";
			//change size event
			//content.onmscontentzoom
		}
		if (setting.displayName != null) {
			this.Render1(content, data);
		}
		else if(setting.onLoadItem != null)
		{
			this.Render2(content, data);
		}
		else if (setting.template != null)
		{
			this.Render3(content, data);
		}
		this.DropDownContent = new Popup(
		{
			element: this.Root,
			minHeight: bev.DropDownContentMinHeight,
			maxHeight: bev.DropDownContentMaxHeight,
			content: content,
		});
	}
	this.DropDownContent.Show();
}

//Получаем элемент списка выбранного кликом по нему мыши
Combobox.prototype.GetClickedItem = function(obj)
{
	while(1==1)
	{
		for (var i = 0; i < obj.classList.length; i++)
		{
			if(obj.classList.item(i) == "combo-box-item")
			{
				return obj;
			}
		}
		obj = obj.parentNode;
	}
}

//Обработчик клика по элементу списка
Combobox.prototype.OnClickContent = function()
{
	//Нужно зделать обработку мульти выбора
	var e = event;
	var item = this.GetClickedItem(e.srcElement);
	item.classList.add("combo-box-selected-item");
	var item = item.DataContext;
	this.DropDownContent.Hide();
}

//Создание списка элементов на основе коллекции элементов
//переденнах в списке настроек выпадающего списка (setting.items )
Combobox.prototype.Render1 = function (content, items)
{
	var setting = this.Setting;
	for (var i = 0; i < items.length; i++)
	{
		var item = document.createElement("div");
		item.className = "combo-box-item";
		item.innerText = items[i][setting.displayName];
		item.onclick = this._onClickContentHandler;
		item.DataContext = items[i];
		content.appendChild(item);
	}
}

//Создание списка элементов на основе выполения пользовательской
//функции создания содержимого элемента списка указанной в настройке выпадающего списка (setting.onLoadItem).
//Вызывается для каждого элемента в списке
Combobox.prototype.Render2 = function(content, items)
{
	var setting = this.Setting;
	for (var i = 0; i < items.length; i++)
	{
		var item = document.createElement("div");
		item.className = "combo-box-item";
		item.onclick = this._onClickContentHandler;
		item.DataContext = items[i];
		setting.onLoadItem(items[i]);
		content.appendChild(item);
	}
}

//Создание списка элементов на основе коллекции элементов
//переденнах в списке настроек выпадающего списка (setting.items )
//с использование указанного шаблона (setting.template)
Combobox.prototype.Render3 = function(content, items)
{
	var setting = this.Setting;
	var template = document.getElementById(setting.template);
	var reg = new RegExp("{.*?\}", "gm");
	var found = reg.exec(template.innerHTML);
	var templateItems = new Array();
	var templateItemNames = new Array();
	var startIndex = 0;
	if (found != null) {
		while (found != null) {
			templateItemNames.push(found[0].substring(1, found[0].length - 1));
			templateItems.push(template.innerHTML.substring(startIndex, found.index));
			startIndex = found.index + found[0].length;
			found = reg.exec(template.innerHTML);
		}
		templateItems.push(template.innerHTML.substring(startIndex, template.innerHTML.length));
	}

	for (var i = 0; i < items.length; i++) {
		var item = document.createElement("div");
		item.className = "combo-box-item";
		item.onclick = this._onClickContentHandler;
		item.DataContext = items[i];
		var s = "";
		for (var j = 0; j < templateItemNames.length; j++) {
			s += templateItems[j] + items[i][templateItemNames[j]];
		}
		s += templateItems[templateItems.length - 1];
		item.innerHTML = s;
		content.appendChild(item);
	}
}