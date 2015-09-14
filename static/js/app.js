var style = {
	position:'absolute',
	top:'50%',
	left:'50%',
	transform:'translate(-50% , -50%)',
}
React.render(
	<div style={style}>
		<h1>小鱼单词 即将到来</h1>
		<p style={{textAlign:'center'}}> comming soon </p>
	</div>,
	document.getElementById('container')
);