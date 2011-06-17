/** ------------------------------------
 * SweetDEV RIA library
 * Copyright [2006] [Ideo Technologies]
 * ------------------------------------
 *
 * SweetDEV RIA is available in 2 editions :
 *
 * 	SweetDEV RIA Open Source Edition
 *	SweetDEV RIA Commercial Edition
 *
 * > "SweetDEV RIA Commercial Edition" is designed for Enterprise, Web site,
 * OEMs, VARs who do not license and distribute their source code under the
 * GPL.
 * See terms on http://www.ideotechnologies.com or contact us at SweetDEV-RIA@ideotechnologies.com
 *
 * For more information, please contact us at:
 *
 *         Ideo Technologies S.A
 *        124 rue de Verdun
 *        92800 Puteaux - France
 *
 *      France & Europe Phone : +33 1.46.25.09.60
 *         USA & Canada Phone : (201) 984-7514
 *
 *		web : http://www.ideotechnologies.com
 *		email : SweetDEV-RIA@ideotechnologies.com
 *
 *
 * > "SweetDEV RIA Open Source Edition" is under GPL licence.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation version 2
 * of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301, USA.
 *
 *
 * @version 2.2
 * @author Ideo Technologies
 */

SweetDevRia.HTMLNode = function(data, parent, extended, hasIcon) {
	superClass (this, YAHOO.widget.HTMLNode, data, parent, extended, hasIcon);
	superClass (this, SweetDevRia.Node);

	this.className = SweetDevRia.HTMLNode;
	this.parentClass = YAHOO.widget.HTMLNode;
};

extendsClass (SweetDevRia.HTMLNode, YAHOO.widget.HTMLNode);
extendsClass (SweetDevRia.HTMLNode, SweetDevRia.Node);

SweetDevRia.HTMLNode.prototype.select = function() {
	SweetDevRia.Node.prototype.select.call (this);

	var div = SweetDevRia.DomHelper.get (this.getElId());
	if (div) {
		div.focus();
	}
};

SweetDevRia.HTMLNode.prototype.initialize = function() {
	var div = SweetDevRia.DomHelper.get (this.getElId());
	if (div) {
		div.focus = new Function ("YAHOO.widget.TreeView.getTree('" + this.tree.id + "').selectNode("+this.index+")");
		div.blur = new Function ("YAHOO.widget.TreeView.getTree('" + this.tree.id + "').setActive(false)");

		div.node = this;
	}

	if (! this.isRoot()) {
		var dropZoneId = this.tree.root.getChildrenElId();
		var dragDrop = new SweetDevRia.DragDrop (this.getElId());
		dragDrop.addDropZone (dropZoneId);
	}
};


SweetDevRia.HTMLNode.prototype.clone = function(parent) {
	var clone = new this.className (this.data, parent, this.extended, this.hasIcon);
	for (var i = 0; i < this.children.length; i++) {
		var childClone = this.children[i].clone (clone);
	}

	return clone;
};