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

Bev.prototype.DetachEvent = function (domElement, ev, handler)
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

var bev = new Bev();