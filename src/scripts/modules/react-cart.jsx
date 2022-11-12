import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

/*
● reactJS, by building a cart drawer component and list item components
● work with cart AJAX API, don’t need to use Shopify storefront API
There are no restrictions on the UI of the cart drawer, keep it simple. Just follow the
basic style from the source code and focus on the following functionality:
● Get cart items.
● Ability to change quantity, plus/minus quantity button or update on input field.
● Ability to remove items from cart.
*/

function Cart() {
	const [items, setItems] = useState([])

	useEffect(() => {
		async function fetchCart() {
			const res = await fetch('/cart.js')
			const cart = await res.json()
			setItems(cart.items)
		}

		fetchCart()
	}, [])

	async function updateItem(id, quantity) {
		const res = await fetch('/cart/change.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				line: id,
				quantity,
			}),
		})
		const cart = await res.json()
		console.log(cart)
		setItems(cart.items)

		//
	}

	return (
		<div class='drawer'>
			<style jsx>
				{`
					#react-cart .inner {
						height: 100vh;
						width: 40rem;
						max-width: calc(100vw - 3rem);
						padding: 0 1.5rem;
						border: 0.1rem solid rgba(var(--color-foreground), 0.2);
						border-right: 0;
						background-color: rgb(var(--color-background));
						overflow: hidden;
						display: flex;
						flex-direction: column;
					}

					#react-cart h2 {
						text-align: center;
						margin-top: 50px;
						margin-bottom: 0;
					}
					#react-cart .drawer {
						position: absolute;
						top: 0;
						bottom: 0;
						right: 0;
						z-index: 11;
					}
					#react-cart .drawer .close-cart svg {
						height: 2.4rem;
						width: 2.4rem;
					}
					#react-cart .drawer .close-cart {
						display: inline-block;
						padding: 0;
						min-width: 4.4rem;
						min-height: 4.4rem;
						box-shadow: 0 0 0 0.2rem rgba(var(--color-button), 0);
						position: absolute;
						top: 10px;
						right: 0;
						color: rgb(var(--color-foreground));
						background-color: transparent;
						border: none;
						cursor: pointer;
					}
					#react-cart ul {
						list-style: none;
						padding: 50px 10px;
						margin: 0;
					}
					#react-cart ul li {
						padding: 0;
						margin: 0 0 20px;
						font-size: 12px;
						display: flex;
					}
					#react-cart ul li > div:nth-child(2) {
						flex: 1;
						padding: 0 20px;
					}
					#react-cart ul li > div:nth-child(3) {
						padding: 0 20px;
					}
					#react-cart ul li h3 {
						font-size: 14px;
						margin: 0;
					}
					#react-cart ul li > img {
						width: 100px;
						height: 100px;
						object-fit: cover;
					}
					#react-cart .drawer-quantity {
						display: flex;
					}
					#react-cart .drawer-quantity input {
						flex: 1;
						max-width: 60px;
						padding: 10px;
						text-align: center;
					}
					#react-cart .remove-item {
						appearance: none;
						background: transparent;
						border: none;
						cursor: pointer;
						display: inline-block;
						margin: 0;
						padding: 0;
					}
				`}
			</style>
			<div class='cart-drawer'>
				<div
					class='inner'
					role='dialog'
					aria-modal='true'
					aria-label='Your cart'
					tabindex='-1'
				>
					{items.length > 0 ? (
						<>
							<h2>Your cart</h2>

							<ul>
								{items.map((item, i) => (
									<li key={item.id}>
										<img
											src={item.image}
											alt={item.title}
											width='150'
											height='150'
										></img>
										<div>
											<h3>
												<a
													href={`/products/${item.handle}`}
												>
													{item.title}
												</a>
											</h3>
											<div>{item.variant_title}</div>
											<div className='drawer-quantity'>
												<button
													onClick={() => {
														updateItem(
															i + 1,
															item.quantity - 1
														)
													}}
												>
													-
												</button>
												<input
													type='number'
													value={item.quantity}
													onChange={(e) => {
														updateItem(
															i + 1,
															e.target.value
														)
													}}
												/>

												<button
													onClick={() => {
														updateItem(
															i + 1,
															item.quantity + 1
														)
													}}
												>
													+
												</button>
											</div>
											<button
												className='remove-item'
												onClick={() => {
													updateItem(i + 1, 0)
												}}
											>
												<small>Remove</small>
											</button>
										</div>
										<div>
											$
											{(item.price / 100) * item.quantity}
										</div>
									</li>
								))}
							</ul>
							<div>
								<div>
									<div>
										<div>
											<h4>
												Subtotal: $
												{items.reduce((acc, item) => {
													return (
														acc +
														(item.price / 100) *
															item.quantity
													)
												}, 0)}
											</h4>
										</div>

										<div></div>

										<small>
											Taxes and shipping calculated at
											checkout
										</small>
									</div>
									<div>
										<a
											className='button button--full-width'
											href='/checkout'
										>
											Check out
										</a>
									</div>
								</div>
							</div>
						</>
					) : (
						<h2>Your cart is empty</h2>
					)}
					{/* <h2>Your cart is empty</h2>
					<a href='/collections/all' class='button'>
						Continue shopping
					</a> */}
					<button
						className='close-cart drawer__close'
						type='button'
						aria-label='Close'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							aria-hidden='true'
							focusable='false'
							role='presentation'
							class='icon icon-close'
							fill='none'
							viewBox='0 0 18 17'
						>
							<path
								d='M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z'
								fill='currentColor'
							></path>
						</svg>
					</button>

					{/* <div class='drawer__header'>
						<h2 class='drawer__heading'>Your cart</h2>
						<button
							class='drawer__close'
							type='button'
							onclick="this.closest('cart-drawer').close()"
							aria-label='Close'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								aria-hidden='true'
								focusable='false'
								role='presentation'
								class='icon icon-close'
								fill='none'
								viewBox='0 0 18 17'
							>
								<path
									d='M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z'
									fill='currentColor'
								></path>
							</svg>
						</button>
					</div>
					<div class=' is-empty'>
						<form
							action='/cart'
							id='CartDrawer-Form'
							class='cart__contents cart-drawer__form pf-form-processed'
							method='post'
						>
							<div
								id='CartDrawer-CartItems'
								class='drawer__contents js-contents'
							>
								<p
									id='CartDrawer-LiveRegionText'
									class='visually-hidden'
									role='status'
								></p>
								<p
									id='CartDrawer-LineItemStatus'
									class='visually-hidden'
									aria-hidden='true'
									role='status'
								>
									Loading...
								</p>
							</div>
							<div id='CartDrawer-CartErrors' role='alert'></div>
						</form>
					</div>
					<div class='drawer__footer'>
						<div class='cart-drawer__footer'>
							<div class='totals' role='status'>
								<h2 class='totals__subtotal'>Subtotal</h2>
								<p class='totals__subtotal-value'>€0,00 EUR</p>
							</div>

							<div></div>

							<small class='tax-note caption-large rte'>
								Tax included and shipping calculated at checkout
							</small>
						</div>

						<div class='cart__ctas'>
							<noscript>
								<button
									type='submit'
									class='cart__update-button button button--secondary'
									form='CartDrawer-Form'
								>
									Update
								</button>
							</noscript>

							<button
								type='submit'
								id='CartDrawer-Checkout'
								class='cart__checkout-button button p_a_t_ch'
								name='checkout'
								form='CartDrawer-Form'
								disabled=''
							>
								Check out
							</button>
						</div>
					</div> */}
				</div>
			</div>
		</div>
	)
}

const ReactCart = () => {
	const container = document.getElementById('react-cart')
	const root = createRoot(container)

	root.render(<Cart />)
	console.log('first24414', container)
}

export default ReactCart
