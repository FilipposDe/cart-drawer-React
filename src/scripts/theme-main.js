import ReactCart from '~mod/react-cart'

window.ReactCart = ReactCart

ReactCart()

window.openReactCart = function (e) {
	e.preventDefault()
	document.querySelector('#react-cart').classList.add('react-cart--open')
}
