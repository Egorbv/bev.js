function Combobox()
{
	var cb = document.getElementsByClassName("combo-box")[0];
	var button = document.createElement("span");
	this.Content = document.createElement("span");
	var icon = document.createElement("span");
	icon.className = "combo-box-button-icon";
	icon.innerHTML = "select";
	icon.style.visibility = "hidden";
	button.appendChild(icon);
	button.onmouseover = function () { icon.className = "combo-box-button-icon-hover" };
	button.onmouseout = function () { icon.className = "combo-box-button-icon"; }
	button.onclick = function () { instance.ShowDropDown(); };
	button.className = "combo-box-button"
	var instance = this;


	this.Content.className = "combo-box-content";

	if (bev.IsRTL == true)
	{
		button.style.left = "0px";
		this.Content.style.right = "0px";
	}
	else
	{
		button.style.right = "0px";
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

}

Combobox.prototype.ShowDropDown=function()
{
	
}
