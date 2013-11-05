//  product listview page

var getItemquery = "select * from WLDEMO.ITEMS ORDER BY ITEMCODE ASC";
var selectStatement = WL.Server.createSQLStatement(getItemquery);
// var selectStatement = WL.Server.createSQLStatement("select * from ITEMS ORDER
// BY ITEMCODE ASC");

function getITEMs() {

	return WL.Server.invokeSQLStatement({
		preparedStatement : selectStatement,
		parameters : []
	});
}

// product detail page
var getProductquery = "select * from WLDEMO.ITEMS where ITEMCODE=?";
var getProductStatement = WL.Server.createSQLStatement(getProductquery);
// var getProductStatement = WL.Server.createSQLStatement("select * from ITEMS
// where ITEMCODE=?");
function getProduct(ITEMCODE) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getProductStatement,
		parameters : [ ITEMCODE ]
	});
}

// addWishlist wishlist detail page add button
var addWishlistquery = "INSERT INTO WLDEMO.WISHLIST (WLID,WNAME,DESCR,CONID,TRSTAMP,ITEMCODE1, ITEMCODE2, ITEMCODE3, ITEMCODE4, ITEMCODE5, ITEMCODE6, ITEMCODE7, ITEMCODE8, ITEMCODE9, ITEMCODE10)";
addWishlistquery += " VALUES (now() + 0,";
addWishlistquery += "?,?,?,";
addWishlistquery += "date_format(now(),'%Y%m%d%H%S'),";
addWishlistquery += "?,null,null,null,null,null,null,null,null,null)";
addWishlistquery.trim();

var addWishliststatement = WL.Server.createSQLStatement(addWishlistquery);

function addWishList(wname, descr, conid, itemcode1) {
	WL.Logger.info("addWishlisttatement" + addWishliststatement);
	return WL.Server.invokeSQLStatement({
		preparedStatement : addWishliststatement,
		parameters : [ wname, descr, conid, itemcode1 ]
	});
}

// getWishList for wishlist page
// /select * from wishlist wl , items i where wl.itemcode1=i.itemcode and
// conid='00002';

var getWishListquery = "select * from WLDEMO.WISHLIST wl , WLDEMO.ITEMS i where wl.itemcode1=i.itemcode and conid=?";
var getWishListStatement = WL.Server.createSQLStatement(getWishListquery);
function getWishList(conid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getWishListStatement,
		parameters : [ conid ]
	});
}

// get wish detail (just for modify and delete)
var getWishDetailquery = "select * from WLDEMO.WISHLIST wl , WLDEMO.ITEMS i  where wl.itemcode1=i.itemcode and wl.wlid=?";
var getWishDetailStatement = WL.Server.createSQLStatement(getWishDetailquery);
function getWishDetail(wlid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getWishDetailStatement,
		parameters : [ wlid ]
	});
}

// update wishlist

var updateWishquery = "UPDATE WLDEMO.WISHLIST SET wlid=now()+0,";
updateWishquery += " wname = ?, descr = ?,";
updateWishquery += "trstamp =date_format(now(),'%Y%m%d%H%S') ";
updateWishquery += "WHERE wlid=?";
updateWishquery.trim();
var updateWishStatement = WL.Server.createSQLStatement(updateWishquery);
function updateWish(wname, descr, wlid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateWishStatement,
		parameters : [ wname, descr, wlid ]
	});
}

// //////////////////////////////////////////////////////////////
// delete wishlist

var deleteWishquery = "delete from WLDEMO.WISHLIST where  wlid=?";
var deleteWishStatement = WL.Server.createSQLStatement(deleteWishquery);
function deleteWish(wlid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : deleteWishStatement,
		parameters : [ wlid ]
	});
}

// //////////////////////////////////////////////////////////////
// getCartList
// select * from cart c , items i where c.item1=i.itemcode and c.owner='00002';

var getCartListquery = "select * from WLDEMO.CART c , WLDEMO.ITEMS i where c.item1=i.itemcode and c.owner=?";
var getCartListStatement = WL.Server.createSQLStatement(getCartListquery);
function getCartList(conid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getCartListStatement,
		parameters : [ conid ]
	});
}
// ////////////////////////////////////////////////////////////////////////
// getCartDetail (just for modify and delete) 20131027144639
var getCartDetailquery = "select * from WLDEMO.CART c  , WLDEMO.ITEMS i  where c.item1=i.itemcode and c.cartid=?";
var getCartDetailStatement = WL.Server.createSQLStatement(getCartDetailquery);
function getCartDetail(cartid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getCartDetailStatement,
		parameters : [ cartid ]
	});
}
// ///////////////////////////////////////////////////////////////////////////
// deleteCart

var deleteCartquery = "delete from WLDEMO.CART where  cartid=?";
var deleteCartStatement = WL.Server.createSQLStatement(deleteCartquery);
function deleteCart(cartid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : deleteCartStatement,
		parameters : [ cartid ]
	});
}

// ///////////////////////////////////////////////////////////////////////////
// addCartList owner, item1, amt1, unitprc1
// INSERT INTO cart (CARTID,OWNER, ITEM1, AMT1, UNITPRC1)
// values (now() + 0, '00002', '00004',1,300000);
// addWishlist wishlist detail page add button
var addCartlistquery = "INSERT INTO WLDEMO.CART (CARTID,OWNER, ITEM1, AMT1, UNITPRC1)";
addCartlistquery += " VALUES (now() + 0,";
addCartlistquery += "?,?,?,?)";
addCartlistquery.trim();

var addCartListsatement = WL.Server.createSQLStatement(addCartlistquery);

function addCartList(owner, item1, amt1, unitprc1) {
	WL.Logger.info("addCartListsatement" + addCartListsatement);
	return WL.Server.invokeSQLStatement({
		preparedStatement : addCartListsatement,
		parameters : [ owner, item1, amt1, unitprc1 ]
	});
}

// ///////////////////////////////////////////////////////////////////////////
// update cart updateCart
// UPDATE cart

var updateCartquery = "update WLDEMO.CART set cartid=now()+0,";
updateCartquery += " item1 = ?, amt1 = ?,";
updateCartquery += "unitprc1 = ? ";
updateCartquery += "where cartid= ?";
updateCartquery.trim();
var updateCartStatement = WL.Server.createSQLStatement(updateCartquery);
function updateCart(item1, amt1, unitprc1, cartid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateCartStatement,
		parameters : [ item1, amt1, unitprc1, cartid ]
	});
}

// //////////////////////////////////////////////

function getDummy() {
	WL.Logger.debug("getDummy.............");
	return {};
}

// ///////////////////////////////////////////////////////////////////////////////////////////////
// <!-- for tranhist -->SELECT * FROM WLDEMO.TRANHIST;
// <procedure securityTest="WLShoppersSecurityTest" name="addTranHist" />
// <procedure securityTest="WLShoppersSecurityTest" name="getTranHist" />

var getTranHistquery = "SELECT * FROM WLDEMO.TRANHIST where CONID=?";
var getTranHistStatement = WL.Server.createSQLStatement(getProductquery);

function getTranHist(conid) {
	WL.Logger.info("getTranHistStatement" + getTranHistStatement);
	return WL.Server.invokeSQLStatement({
		preparedStatement : getTranHistStatement,
		parameters : [ conid ]
	});
}

// addWishlist wishlist detail page add button

var addTranHistquery = "INSERT INTO WLDEMO.TRANHIST (TRID, CONID, TRSTAMP, ITEMCODE1)";
addTranHistquery += " VALUES (now() + 0, ?, date_format(now(),'%Y%m%d%H%S'), ?)";
addTranHistquery.trim();

var addTranHiststatement = WL.Server.createSQLStatement(addTranHistquery);

function addTranHist(conid, itemcode1) {
	WL.Logger.info("addTranHiststatement" + addTranHiststatement);
	return WL.Server.invokeSQLStatement({
		preparedStatement : addTranHiststatement,
		parameters : [ conid, itemcode1]
	});
}
