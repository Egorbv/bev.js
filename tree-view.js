function Tree(treeID, settings, data)
{
	var instance = this;
	this.Settings = settings;
	this.Data = data;
	this.SelectNodes = new Array();

	this.Container = document.getElementById(treeID);
	this.Container.onclick = function () { instance.MouseClick(); };
	

	//если у узлов нужно показывать всплывающую подсказку
	if (settings.showTitle)
	{
		this.Container.onmouseover = function () { instance.MouseOver(); };
	}

	//this.Container.ondblclick = function () { alert(event.toElement.tagName) };
}

//Если в настройках дерева выставлен флаг showTitle = true,
//то при наведении на узел будет отображаться всплавающая подсказка с его названием
Tree.prototype.MouseOver = function ()
{
	var e = event;
	var src = e.srcElement;
	if (src.tagName == "I" && src.title == "")
	{
		src.title = src.DataContext[this.Settings.displayName];
	}
}

Tree.prototype.Draw = function ()
{
	var nodes = "";
	switch (this.Settings.type)
	{
		case "Type1":
			this.CurrentDrawFunction = this.CreateNodesType1;
			break;
	}
	var nodes = this.CurrentDrawFunction(this.Data);

	var div = document.createElement("div");
	//var div = this.Container;
	for (var i = 0; i < nodes.length; i++)
	{
		div.appendChild(nodes[i]);
	}
	div.style.display = "inline-table";
	this.Container.appendChild(div);
}

//Обработчик клика на узле
//Либо выделяет\снимает выделение в узле, либо схлопывает\раскрывает дочерние узлы
Tree.prototype.MouseClick = function ()
{
	var e = event;
	var src = e.srcElement;
	//если нужно раскрыть или схлопнуить узел
	if (src.tagName == "B")
	{
		var node = src.parentNode;
		if (src.className == "tree-view-collapsed")
		{
			this.Expand(node);
		}
		else
		{
			this.Collapse(node);
		}
	}
	//если нужно выделить узел
	if (src.tagName == "I")
	{
		this.SelectNode(src);
	}
}

//Закрывает указанный узел
//node - узел который необходимо схлопнуть
Tree.prototype.Collapse = function (node)
{
	node.children[0].className = "tree-view-collapsed";
	node.nextSibling.style.visibility = "hidden";
	node.nextSibling.style.display = "none";
}

//Раскрывает указанный узел
//node - узел который необходимо раскрыть
Tree.prototype.Expand = function (node)
{
	var item = node.DataContext;
	if (node.hasChildren == null)
	{
		var nodes = this.CurrentDrawFunction(item[this.Settings.childrenCollectionName]);
		var div = document.createElement("DIV");
		if (this._hideNewNode == true)
		{
			div.style.visibility = "hidden";
			div.style.display = "none";
		}
		else
		{
			node.children[0].className = "tree-view-expanded";
			div.style.visibility = "visible";
			div.style.display = "block";
		}
		for (var i = 0; i < nodes.length; i++)
		{
			div.appendChild(nodes[i]);
		}
		if (node.nextSibling == null)
		{
			node.parentNode.appendChild(div);
		}
		else
		{
			node.parentNode.insertBefore(div, node.nextSibling);
		}
		node.hasChildren = true;
	}
	else
	{
		if (this._hideNewNode != true)
		{
			node.children[0].className = "tree-view-expanded";
			node.nextSibling.style.visibility = "visible";
			node.nextSibling.style.display = "block";
		}
	}
}

//Схлопывает все узлы в дереве
Tree.prototype.CollapseAll = function ()
{

	var tags = this.Container.getElementsByTagName("B");
	for (var i = 0; i < tags.length; i++)
	{
		var node = tags[i];
		if (node.className == "tree-view-expanded")
		{
			this.Collapse(node.parentNode);
		}
	}
}

//Раскрывает все узлы в дереве
Tree.prototype.ExpandAll = function ()
{
	var tags = this.Container.getElementsByClassName("tree-view-collapsed")
	var nodes = new Array();
	for (var i = 0; i < tags.length; i++)
	{
		nodes.push(tags[i]);
	}

	for (var i = 0; i < nodes.length; i++)
	{
		var node = nodes[i];
		if (node.className == "tree-view-collapsed")
		{
			this.Expand(node.parentNode);
			var newNodes = node.parentNode.nextSibling.getElementsByClassName("tree-view-collapsed");
			for (var j = 0; j < newNodes.length; j++)
			{
				nodes.push(newNodes[j]);
			}
		}
	}
}

//Снять выделение с указанного узла
//node - узел с которого необходимо снять выделение
Tree.prototype.UnselectNode = function(node)
{
	node.className = "";
	for (var i = 0; i < this.SelectNodes.length; i++)
	{
		if (this.SelectNodes[i] == node)
		{
			this.SelectNodes.splice(i, 1);
			break;
		}
	}
}

//Выделяет указанный узел
//node - который необходимо выделить
Tree.prototype.SelectNode = function (node)
{
	var e = event;
	if (this.Settings.selectType == "single")
	{
		this.UnselectAll();
	}
	else if (this.Settings.selectType == "ctrl")
	{
		if(!e.ctrlKey && !e.ctrlLeft)
		{
			this.UnselectAll();
		}
		else
		{
			if (node.className == "tree-view-node-selected")
			{
				this.UnselectNode(node);
				return;
			}
		}
	}
	else if (this.Settings.selectType == "select-unselect")
	{
		if(node.className == "tree-view-node-selected")
		{
			this.UnselectNode(node);
			return;
		}
	}

	node.className = "tree-view-node-selected";
	this.SelectNodes.push(node);
}

//Выделить все узлы в дереве
Tree.prototype.SelectAll = function()
{
	this._hideNewNode = true;
	this.ExpandAll();
	this._hideNewNode = false;
	var tags = this.Container.getElementsByTagName("I");
	this.SelectNodes.length = 0;
	for(var i=0; i< tags.length; i++)
	{
		tags[i].className = "tree-view-node-selected";
		this.SelectNodes.push(tags[i])
	}
}

//Снимает выделение со всех узлов
Tree.prototype.UnselectAll = function()
{
	while (this.SelectNodes.length != 0)
	{
		var oldNode = this.SelectNodes.pop();
		oldNode.className = "";
	}
}


Tree.prototype.StartEditNode = function(node)
{

	var text = node.innerText;
	var innerHTML = node.innerHTML;
	var input = document.createElement("input");
	
	input.value = text;
	input.style.padding = "0px";
	input.style.margin = "0px";
	input.style.display = "table-cell";
	input.style.height = node.offsetHeight - 2 + "px";
	input.style.border = "1px solid black";
	input.style.position = "absolute";
	input.style.top = "0px"
	var width = node.offsetWidth - 2;
	var left = 0;
	for (var i = 0; i < node.children.length; i++)
	{
		width -= node.children[i].offsetWidth;
		left += node.children[i].offsetWidth;
	}
	if (width < 100)
	{
		width = 100;
	}

	input.style.width = width + "px";
	input.style.left = left + "px";

	node.style.position = "relative";
	node.appendChild(input);

	this.CurrentEditNode = node;
}

//Отмена редактирования текущего узла
Tree.prototype.CancelEdit = function()
{
	if(this.CurrentEditNode != null)
	{
		this.CurrentEditNode.removeChild(this.CurrentEditNode.children[this.CurrentEditNode.children.length - 1]);
	}
}


Tree.prototype.CreateNodesType1 = function (items)
{
	//<s class="tree-view-icon-2">&nbsp;</s>
	var fn1 = "<b>&nbsp;</b>";
	var fn2 = "<b class='tree-view-collapsed'>&nbsp;</b>";
	var childrenName = this.Settings.childrenCollectionName;
	var displayName = this.Settings.displayName;

	var html = "";
	var nodes = new Array();
	for (var i = 0; i < items.length; i++)
	{
		var item = items[i];
		var iNode = document.createElement("I");
		iNode.DataContext = item;
		if (item[childrenName] != null && item[childrenName].length > 0)
		{

			iNode.innerHTML = fn2 + item[displayName];
		}
		else
		{
			iNode.innerHTML = fn1 + item[displayName];
		}
		nodes.push(iNode);
	}

	return nodes;
}



//нужно выяснить что работает быстрее в массивах pop или array.length = 0