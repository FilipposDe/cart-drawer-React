import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

const style = `
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
        max-height: 68vh;
        overflow: auto;
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
    #react-cart .empty-title {
        margin: 130px 0 30px;
    }
`

function CartItem(props) {
	const { item, index, updateItem } = props

	return (
		<li>
			<img
				src={item.image}
				alt={item.title}
				width='150'
				height='150'
			></img>
			<div>
				<h3>
					<a href={`/products/${item.handle}`}>{item.title}</a>
				</h3>
				<div>{item.variant_title}</div>
				<div className='drawer-quantity'>
					<button
						onClick={() => {
							updateItem(index + 1, item.quantity - 1)
						}}
					>
						-
					</button>
					<input
						type='number'
						value={item.quantity}
						onChange={(e) => {
							updateItem(index + 1, e.target.value)
						}}
					/>

					<button
						onClick={() => {
							updateItem(index + 1, item.quantity + 1)
						}}
					>
						+
					</button>
				</div>
				<button
					className='remove-item'
					onClick={() => {
						updateItem(index + 1, 0)
					}}
				>
					<small>Remove</small>
				</button>
			</div>
			<div>${(item.price / 100) * item.quantity}</div>
		</li>
	)
}

function CartDrawer() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		async function fetchCart() {
			setLoading(true)
			try {
				const res = await fetch('/cart.js')
				const cart = await res.json()
				setItems(cart.items)
			} catch (error) {}
			setLoading(false)
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
		setItems(cart.items)
	}

	if (loading) return null

	return (
		<div class='drawer'>
			<style jsx>{style}</style>
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
									<CartItem
										key={item.id}
										item={item}
										index={i}
										updateItem={updateItem}
									/>
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
						<>
							<h2 className='empty-title'>Your cart is empty</h2>
							<a href='/collections/all' class='button'>
								Continue shopping
							</a>
						</>
					)}

					<button
						className='close-cart drawer__close'
						type='button'
						aria-label='Close'
						onClick={() =>
							document
								.querySelector('#react-cart')
								.classList.remove('react-cart--open')
						}
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
			</div>
		</div>
	)
}

const ReactCart = () => {
	const container = document.getElementById('react-cart')
	const root = createRoot(container)
	root.render(<CartDrawer />)
}

export default ReactCart
