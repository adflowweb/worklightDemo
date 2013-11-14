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

// 11/14 by...add wishlist modified..
// addWishlist wishlist detail page add button
var addWishlistquery = "INSERT INTO WLDEMO.WISHLIST (WLID,WNAME,DESCR,CONID,TRSTAMP,ITEMCODE1, ITEMCODE2, ITEMCODE3, ITEMCODE4, ITEMCODE5, ITEMCODE6, ITEMCODE7, ITEMCODE8, ITEMCODE9, ITEMCODE10)";
addWishlistquery += " VALUES (now() + 0,";
addWishlistquery += "?,?,?,";
addWishlistquery += "date_format(now(),'%Y%m%d%H%S'),";
addWishlistquery += "null,null,null,null,null,null,null,null,null,null)";
addWishlistquery.trim();

var addWishliststatement = WL.Server.createSQLStatement(addWishlistquery);

function addWishList(wname, descr, conid) {
	WL.Logger.info("addWishlisttatement" + addWishliststatement);
	return WL.Server.invokeSQLStatement({
		preparedStatement : addWishliststatement,
		parameters : [ wname, descr, conid]
	});
}


//getItemsInfobyWL
// 11.14
var getItemsInfobyWLquery = "select * from WLDEMO.ITEMS i where i.itemcode in (?,?,?,?,?,?,?,?,?,?);";
var getItemsInfobyWLStatement = WL.Server.createSQLStatement(getItemsInfobyWLquery);
function getItemsInfobyWL(itemcode1, itemcode2, itemcode3, itemcode4,itemcode5, itemcode6, itemcode7, itemcode8, itemcode9, itemcode10) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getItemsInfobyWLStatement,
		parameters : [ itemcode1, itemcode2, itemcode3, itemcode4,itemcode5, itemcode6, itemcode7, itemcode8, itemcode9, itemcode10 ]
	});
}

/////////////////////////////////////////////////////////////////////////////////
// getMultiWishList
// SELECT * FROM WLDEMO.WISHLIST where conid=
var getMultiWishListquery = "SELECT wlid, wname FROM WLDEMO.WISHLIST where conid=?";
var getMultiWishListStatement = WL.Server.createSQLStatement(getMultiWishListquery);
function getMultiWishList(conid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getMultiWishListStatement,
		parameters : [ conid ]
	});
}


// getWListByselected
//SELECT * FROM WLDEMO.WISHLIST where wlid='201311080000000D'


var getWListByselectedquery = "SELECT * FROM WLDEMO.WISHLIST where wlid=?";
var getWListByselectedStatement = WL.Server.createSQLStatement(getWListByselectedquery);
function getWListByselected(wlid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getWListByselectedStatement,
		parameters : [ wlid ]
	});
}

///////////////////////////////////////////////////////////////////////////////////////////////

//SELECT wlid, wname FROM WLDEMO.WISHLIST where conid='000001';
//getWLManageList
var getWLManageListquery = "SELECT * FROM WLDEMO.WISHLIST where conid=?";
var getWLManageListStatement = WL.Server.createSQLStatement(getWLManageListquery);
function getWLManageList(conid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getWLManageListStatement,
		parameters : [ conid ]
	});
}

//updateWLbyselected
// 11.14 update per specified wishlist
//UPDATE WLDEMO.WISHLIST SET
//trstamp =date_format(now(),'%Y%m%d%H%S'),
//ITEMCODE1=null, ITEMCODE2=null, ITEMCODE3=null, ITEMCODE4=null, 
//ITEMCODE5=null, ITEMCODE6=null, ITEMCODE7=null, ITEMCODE8=null, ITEMCODE9=null, ITEMCODE10=null
//WHERE wlid='20131113162857';
 
	
var updateWLbyselectedquery = "UPDATE  WLDEMO.WISHLIST SET  ";
updateWLbyselectedquery += "trstamp =date_format(now(),'%Y%m%d%H%S'), ";
updateWLbyselectedquery += "ITEMCODE1=?, ITEMCODE2=?, ITEMCODE3=?, ITEMCODE4=?,ITEMCODE5=?, ITEMCODE6=?, ITEMCODE7=?, ITEMCODE8=?, ITEMCODE9=?, ITEMCODE10=? ";
updateWLbyselectedquery += " WHERE wlid=?";
updateWLbyselectedquery.trim();
var updateWLbyselectedStatement = WL.Server.createSQLStatement(updateWLbyselectedquery);
function updateWLbyselected(itemcode1, itemcode2, itemcode3, itemcode4,itemcode5, itemcode6, itemcode7, itemcode8, itemcode9, itemcode10 , wlid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateWLbyselectedStatement,
		parameters : [ itemcode1, itemcode2, itemcode3, itemcode4,itemcode5, itemcode6, itemcode7, itemcode8, itemcode9, itemcode10 , wlid ]
	});
}


/////////////////////////////////////////////////////////////////////////////////////////////
// get wish detail (just for modify and delete)
var getWishDetailquery = "select * from WLDEMO.WISHLIST wl , WLDEMO.ITEMS i  where wl.itemcode1=i.itemcode and wl.wlid=?";
var getWishDetailStatement = WL.Server.createSQLStatement(getWishDetailquery);
function getWishDetail(wlid) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getWishDetailStatement,
		parameters : [ wlid ]
	});
}

// update wishlist  titel and descr  by 11.14

var updateWishquery = "UPDATE WLDEMO.WISHLIST SET ";
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

var getTranHistquery = "select * from WLDEMO.TRANHIST th, WLDEMO.ITEMS i  where th.itemcode1=i.itemcode and th.conid=?";
var getTranHistStatement = WL.Server.createSQLStatement(getTranHistquery);

function getTranHist(conid) {
//	WL.Logger.debug("getTranHistStatement" + getTranHistStatement);
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
///////////////////////////////////////////////////////////////////////////////////////////////////////
//getUser

var getUserquery = "SELECT conid,cname FROM WLDEMO.CONSUMER where loginid=?";
var getUserStatement = WL.Server.createSQLStatement(getUserquery);
// SELECT * FROM WLDEMO.CONSUMER where loginid='consumer01';

function getUser(loginid) {

	return WL.Server.invokeSQLStatement({
		preparedStatement : getUserStatement,
		parameters : [loginid]
	});
}


////////////////////////////////////////////////////////////////////////////////////////////


var updateSelectedWLquery1 = "UPDATE WLDEMO.WISHLIST SET";
updateSelectedWLquery1 += " itemcode1 = ?";
updateSelectedWLquery1 += ", trstamp =date_format(now(),'%Y%m%d%H%S') ";
updateSelectedWLquery1 += "WHERE wlid=?";
updateSelectedWLquery1.trim();
var updateSelectedWLStatement1 = WL.Server.createSQLStatement(updateSelectedWLquery1);
function updateSelectedWL1( itemcode, wlid ) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateSelectedWLStatement1,
		parameters : [ itemcode, wlid ]
	});
}



var updateSelectedWLquery2 = "UPDATE WLDEMO.WISHLIST SET";
updateSelectedWLquery2 += " itemcode2 = ?";
updateSelectedWLquery2 += ", trstamp =date_format(now(),'%Y%m%d%H%S') ";
updateSelectedWLquery2 += "WHERE wlid=?";
updateSelectedWLquery2.trim();
var updateSelectedWLStatement2 = WL.Server.createSQLStatement(updateSelectedWLquery2);
function updateSelectedWL2( itemcode, wlid ) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateSelectedWLStatement2,
		parameters : [ itemcode, wlid ]
	});
}



var updateSelectedWLquery3 = "UPDATE WLDEMO.WISHLIST SET";
updateSelectedWLquery3 += " itemcode3 = ?";
updateSelectedWLquery3 += ", trstamp =date_format(now(),'%Y%m%d%H%S') ";
updateSelectedWLquery3 += "WHERE wlid=?";
updateSelectedWLquery3.trim();
var updateSelectedWLStatement3 = WL.Server.createSQLStatement(updateSelectedWLquery3);
function updateSelectedWL3( itemcode, wlid ) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateSelectedWLStatement3,
		parameters : [ itemcode, wlid ]
	});
}


var updateSelectedWLquery4 = "UPDATE WLDEMO.WISHLIST SET";
updateSelectedWLquery4 += " itemcode4 = ?";
updateSelectedWLquery4 += ", trstamp =date_format(now(),'%Y%m%d%H%S') ";
updateSelectedWLquery4 += "WHERE wlid=?";
updateSelectedWLquery4.trim();
var updateSelectedWLStatement4 = WL.Server.createSQLStatement(updateSelectedWLquery4);
function updateSelectedWL4( itemcode, wlid ) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateSelectedWLStatement4,
		parameters : [ itemcode, wlid ]
	});
}


var updateSelectedWLquery5 = "UPDATE WLDEMO.WISHLIST SET";
updateSelectedWLquery5 += " itemcode5 = ?";
updateSelectedWLquery5 += ", trstamp =date_format(now(),'%Y%m%d%H%S') ";
updateSelectedWLquery5 += "WHERE wlid=?";
updateSelectedWLquery5.trim();
var updateSelectedWLStatement5 = WL.Server.createSQLStatement(updateSelectedWLquery5);
function updateSelectedWL5( itemcode, wlid ) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateSelectedWLStatement5,
		parameters : [ itemcode, wlid ]
	});
}



var updateSelectedWLquery6 = "UPDATE WLDEMO.WISHLIST SET";
updateSelectedWLquery6 += " itemcode6 = ?";
updateSelectedWLquery6 += ", trstamp =date_format(now(),'%Y%m%d%H%S') ";
updateSelectedWLquery6 += "WHERE wlid=?";
updateSelectedWLquery6.trim();
var updateSelectedWLStatement6 = WL.Server.createSQLStatement(updateSelectedWLquery6);
function updateSelectedWL6( itemcode, wlid ) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateSelectedWLStatement6,
		parameters : [ itemcode, wlid ]
	});
}



var updateSelectedWLquery7 = "UPDATE WLDEMO.WISHLIST SET";
updateSelectedWLquery7 += " itemcode7 = ?";
updateSelectedWLquery7 += ", trstamp =date_format(now(),'%Y%m%d%H%S') ";
updateSelectedWLquery7 += "WHERE wlid=?";
updateSelectedWLquery7.trim();
var updateSelectedWLStatement7 = WL.Server.createSQLStatement(updateSelectedWLquery7);
function updateSelectedWL7( itemcode, wlid ) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateSelectedWLStatement7,
		parameters : [ itemcode, wlid ]
	});
}



var updateSelectedWLquery8 = "UPDATE WLDEMO.WISHLIST SET";
updateSelectedWLquery8 += " itemcode8 = ?";
updateSelectedWLquery8 += ", trstamp =date_format(now(),'%Y%m%d%H%S') ";
updateSelectedWLquery8 += "WHERE wlid=?";
updateSelectedWLquery8.trim();
var updateSelectedWLStatement8 = WL.Server.createSQLStatement(updateSelectedWLquery8);
function updateSelectedWL8( itemcode, wlid ) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateSelectedWLStatement8,
		parameters : [ itemcode, wlid ]
	});
}




var updateSelectedWLquery9 = "UPDATE WLDEMO.WISHLIST SET";
updateSelectedWLquery9 += " itemcode9 = ?";
updateSelectedWLquery9 += ", trstamp =date_format(now(),'%Y%m%d%H%S') ";
updateSelectedWLquery9 += "WHERE wlid=?";
updateSelectedWLquery9.trim();
var updateSelectedWLStatement9 = WL.Server.createSQLStatement(updateSelectedWLquery9);
function updateSelectedWL9( itemcode, wlid ) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateSelectedWLStatement9,
		parameters : [ itemcode, wlid ]
	});
}




var updateSelectedWLquery10 = "UPDATE WLDEMO.WISHLIST SET";
updateSelectedWLquery10 += " itemcode10 = ?";
updateSelectedWLquery10 += ", trstamp =date_format(now(),'%Y%m%d%H%S') ";
updateSelectedWLquery10 += "WHERE wlid=?";
updateSelectedWLquery10.trim();
var updateSelectedWLStatement10 = WL.Server.createSQLStatement(updateSelectedWLquery10);
function updateSelectedWL10( itemcode, wlid ) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : updateSelectedWLStatement10,
		parameters : [ itemcode, wlid ]
	});
}