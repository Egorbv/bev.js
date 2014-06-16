function Bev()
{
	this.IsRTL = true;
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

var bev = new Bev();