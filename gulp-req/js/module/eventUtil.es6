/**
 * Created by yvan on 16/4/27.
 */

var EventUtil = {

	addHandler: function(element, type, handler){
		if (element.addEventListener){
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent){
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},

	getButton: function(event){
		if (document.implementation.hasFeature("MouseEvents", "2.0")){
			return event.button;
		} else {
			switch(event.button){
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4: return 1;
			}
		}
	},

	getCharCode: function(event){
		if (typeof event.charCode == "number"){
			return event.charCode;
		} else {
			return event.keyCode;
		}
	},

	getClipboardText: function(event){
		var clipboardData =  (event.clipboardData || window.clipboardData);
		return clipboardData.getData("text");
	},

	getEvent: function(event){
		return event ? event : window.event;
	},

	getRelatedTarget: function(event){
		if (event.relatedTarget){
			return event.relatedTarget;
		} else if (event.toElement){
			return event.toElement;
		} else if (event.fromElement){
			return event.fromElement;
		} else {
			return null;
		}

	},

	getTarget: function(event){
		return event.target || event.srcElement;
	},

	getWheelDelta: function(event){
		if (event.wheelDelta){
			return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
		} else {
			return -event.detail * 40;
		}
	},

	preventDefault: function(event){
		if (event.preventDefault){
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},

	removeHandler: function(element, type, handler){
		if (element.removeEventListener){
			element.removeEventListener(type, handler, false);
		} else if (element.detachEvent){
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	},

	setClipboardText: function(event, value){
		if (event.clipboardData){
			event.clipboardData.setData("text/plain", value);
		} else if (window.clipboardData){
			window.clipboardData.setData("text", value);
		}
	},

	stopPropagation: function(event){
		if (event.stopPropagation){
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	}

};


function serialize(form){
	var parts = [],
		field = null,
		i,
		len,
		j,
		optLen,
		option,
		optValue;

	for (i=0, len=form.elements.length; i < len; i++){
		field = form.elements[i];

		switch(field.type){
			case "select-one":
			case "select-multiple":

				if (field.name.length){
					for (j=0, optLen = field.options.length; j < optLen; j++){
						option = field.options[j];
						if (option.selected){
							optValue = "";
							if (option.hasAttribute){
								optValue = (option.hasAttribute("value") ? option.value : option.text);
							} else {
								optValue = (option.attributes["value"].specified ? option.value : option.text);
							}
							parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
						}
					}
				}
				break;

			case undefined:     //fieldset
			case "file":        //file input
			case "submit":      //submit button
			case "reset":       //reset button
			case "button":      //custom button
				break;

			case "radio":       //radio button
			case "checkbox":    //checkbox
				if (!field.checked){
					break;
				}
			/* falls through */

			default:
				//don't include form fields without names
				if (field.name.length){
					parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
				}
		}
	}
	return parts.join("&");
}