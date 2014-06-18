//БИндить нужно либо на Textbox  - если нет готового списка
//либо на Select - если список заполнен
function Combobox(id, setting)
{
	//основные проверки на правильность настроек инициализации компонента
	if (setting != null)
	{
		if(setting.dataSource != null)
		{
			if (!(setting.dataSource instanceof Array))
			{
				bev.ShowError("Combobox control - в поле настроек 'dataSource' должен быть массив эллементов");
				return;
			}
		}
		else if (setting.dataSourceFunction == null)
		{
			bev.ShowError("Combobox control - в настройках должен быть передан массив элементов в поле -dataSource или ссылка на функцию получения данных - поле dataSourceFunction");
			return;
		}
		if (setting.dataTextField == null || setting.dataValueField == null)
		{
			bev.ShowError("Combobox control - должны быть указаны названия полей для значения и отображения в источнике данных")
			return;
		}
	}
	else
	{
		//create from select
	}

	//Идентификатор текущего выбранного значения
	this.SelectedValue = null;
	//Ссылка экземпляр выбранного элемента в списке
	this.SelectedItem = null;
	//Массив идентификаторов выбранных в списке
	this.SelectedValues = null;
	//Массив экземпляров выбранных элементов в списке
	this.SelectedItems = null;

	this.OriginalSelect = document.getElementById(id);
	this.Setting = setting;
	//Ссылка на элемент контейнер для выпадающего списка
	this.Combobox = document.createElement("span");
	this.Combobox.className = "combo-box";
	this.Combobox.innerHTML = "&nbsp;";
	this.Combobox.style.visibility = "hidden";

	this.OriginalSelect.style.display = "none";
	this.OriginalSelect.parentNode.insertBefore(this.Combobox, this.OriginalSelect);

	var button = document.createElement("span");
	this.Content = document.createElement("span");
	var icon = document.createElement("span");
	icon.className = "combo-box-button-icon";
	button.appendChild(icon);
	this.Combobox.onmouseover = function () { icon.className = "combo-box-button-icon-hover" };
	this.Combobox.onmouseout = function () { icon.className = "combo-box-button-icon"; }
	this.Combobox.onclick = function () { instance.BeginShowDropDown(); };
	button.className = "combo-box-button"

	var instance = this;


	this.Content.className = "combo-box-content";

	var styles = document.defaultView.getComputedStyle(this.Combobox);
	if (bev.IsRTL == true)
	{
		button.style.left = "0px";
		this.Content.style.right = "0px";
		button.style.borderLeftWidth = "0px";
		this.Content.style.borderBottomRightRadius = styles.borderBottomRightRadius;
		this.Content.style.borderTopRightRadius = styles.borderTopRightRadius;
	}
	else
	{
		button.style.right = "0px";
		button.style.borderRightWidth = "0px";
		this.Content.style.left = "0px";
		this.Content.style.borderBottomLeftRadius = styles.borderBottomLeftRadius;
		this.Content.style.borderTopLeftRadius = styles.borderTopLeftRadius;
	}


	this.Combobox.appendChild(button);
	bev.CenteringElement(button, icon);

	this.Content.style.width = this.Combobox.clientWidth - button.offsetWidth + "px";
	this.Content.innerHTML = "dddwwwwwwdW";
	this.Combobox.appendChild(this.Content);

	this._onClickContentHandler = function () { instance.OnClickContent(); };
	this.Combobox.style.visibility = "visible";
}

Combobox.prototype.BeginShowDropDown=function()
{
	var setting = this.Setting;
	if(setting.dataSourceFunction)
	{
		var instance = this;
		var icon = this.Combobox.children[0].children[0];
		icon.classList.toggle("combo-box-button-icon-loaded");
		bev.CenteringElement(icon.parentNode, icon);
		setting.dataSourceFunction({ control: this, callback: function (data) { instance.EndShowDropDown(data); } });
	}
	else
	{
		this.EndShowDropDown(setting.dataSource)
	}
}

//Завершение отображение выпадающего списка
//data - список элементов для отображения
Combobox.prototype.EndShowDropDown = function(data)
{
	//если мы ожидали получение данных возвращаем прежний класс
	var icon = this.Combobox.children[0].children[0];
	if (icon.classList.contains("combo-box-button-icon-loaded"))
	{
		icon.classList.toggle("combo-box-button-icon-loaded");
		bev.CenteringElement(icon.parentNode, icon);
	}



	var setting = this.Setting;
	//Если всплывающая панель еще не создана - создаем ее
	if (this.DropDownContent == null) {
		var content = document.createElement("div");
		content.className = "combo-box-drop-down-content";
		if (bev.IsRTL == true)
		{
			content.style.direction = "rtl";
			//change size event
			//content.onmscontentzoom
		}

		if (setting.onLoadItem != null)
		{
			this.Render2(content, data);
		}
		else if (setting.template != null)
		{
			this.Render3(content, data);
		}
		else
		{
			this.Render1(content, data);
		}
		this.DropDownContent = new Popup(
		{
			element: this.Combobox,
			minHeight: bev.DropDownContentMinHeight,
			maxHeight: bev.DropDownContentMaxHeight,
			content: content,
		});
	}
	//Нужно определять что выделенный элемент не выделяется и скролировать до него
	this.DropDownContent.Show();
}

//Обработчик клика по элементу списка
Combobox.prototype.OnClickContent = function(ee)
{
	//Нужно зделать обработку мульти выбора
	var item = bev.GetParentDataContext(event.srcElement);
	item.classList.toggle("combo-box-selected-item");
	this.DropDownContent.Hide();

	var selectedItem = item;
	var selectedValue = item.DataContext[this.Setting.dataValueField];
	if(this.Setting.allowMultiSelect == true)
	{

	}
	else
	{
		if(this.SelectedItem != null)
		{
			this.SelectedItem.classList.toggle("combo-box-selected-item");
		}
		this.SelectedItem = selectedItem;
		this.SelectedValue = selectedValue;
		this.Content.innerText = selectedItem.DataContext[this.Setting.dataTextField];
	}

	if(this.Setting.showTitle == true)
	{
		this.Content.title = this.Content.innerText;
	}
	
}

//Создание списка элементов на основе коллекции элементов
//items - массив элементо выпадающего списка
Combobox.prototype.Render1 = function (content, items)
{
	var setting = this.Setting;
	for (var i = 0; i < items.length; i++)
	{
		var item = document.createElement("div");
		item.className = "combo-box-item";
		item.innerHTML = "<div class='eeeeeee'><div>----" + items[i][setting.dataTextField] + "</div></div>";
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
	debugger;
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
	debugger;
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