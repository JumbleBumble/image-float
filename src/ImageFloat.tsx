import React, { useEffect, useRef, useState, ReactNode } from 'react'
import { useSprings, animated, to } from '@react-spring/web'
import { throttle } from 'lodash'

const getRandom = (min: number, max: number) =>
	Math.random() * (max - min) + min

interface ImageFloatProps {
	/** Source URL of the image. */
	src: string
	/** Optional React nodes to be rendered inside the component. */
	children?: ReactNode
	/** Optional number of images to be displayed. Defaults to 50. */
	numImages?: number
	/** Optional radius for the force field effect. Defaults to 100. */
	forceFieldRadius?: number
	/** Optional friction value to be applied to the images. Defaults to a minimum of 15. */
	friction?: number
	/** Optional mass value to be applied to the images. Defaults to a minimum of 1. */
	mass?: number
	/** Optional image max velocity. Defaults to 100. */
	maxVelocity?: number
	/** Optional image size multiplier. */
	sizeMultiplier?: number
	/** Optional width of the images. */
	imageWidth?: number
	/** Optional height of the images. */
	imageHeight?: number
	/** Optional cursor force multiplier. Defaults to 13.66. */
	forceMultiplier?: number
	/** Optional boolean to toggle cursor interaction. Defaults to true. */
	cursorInteract?: boolean
	/** Optional boolean to toggle blackhole effect. Defaults to false. */
	blackholeEffect?: boolean
	/** Optional boolean to toggle collision detection. Defaults to true. */
	collisions?: boolean
	/** Optional boolean to enable random movement of images. Defaults to false. */
	imageJitter?: boolean
	/** Optional interval in milliseconds for random movement. Defaults to 1000. */
	jitterInterval?: number
	/** Optional force value for random movement. Defaults to 10. */
	jitterForce?: number
}

const ImageFloat: React.FC<ImageFloatProps> = ({
	src,
	children,
	numImages = 50,
	forceFieldRadius = 100,
	friction = 15,
	mass = 1,
	maxVelocity = 100,
	sizeMultiplier = 1,
	imageWidth = 50,
	imageHeight = 50,
	forceMultiplier = 13.66,
	cursorInteract = true,
	blackholeEffect = false,
	collisions = true,
	imageJitter = false,
	jitterInterval = 1000,
	jitterForce = 10,
}) => {
	const [mouse, setMouse] = useState({ x: 0, y: 0 })
	const containerRef = useRef<HTMLDivElement>(null)
	const jitterTimes = useRef<Map<number, number>>(new Map())
	friction = Math.max(friction, 15)
	mass = Math.max(mass, 1)

	const FORCE_MULTIPLIER = forceMultiplier

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [springs, api] = useSprings(numImages, (_index: number) => ({
		from: {
			x: getRandom(0, window.innerWidth),
			y: getRandom(0, window.innerHeight),
			scale: getRandom(0.5, 1) * sizeMultiplier,
			rotate: getRandom(0, 360),
		},
		config: { mass: mass, tension: 170, friction: friction },
	}))

	useEffect(() => {
		if (cursorInteract) {
			const handleMouseMove = throttle((event: MouseEvent) => {
				setMouse({ x: event.clientX, y: event.clientY })
			}, 50)

			window.addEventListener('mousemove', handleMouseMove)

			return () => {
				window.removeEventListener('mousemove', handleMouseMove)
			}
		}
	}, [cursorInteract])

	useEffect(() => {
		let animationFrameId: number | undefined

		const animate = () => {
			api.start((i) => {
				const spring = springs[i]
				const dx = spring.x.get() - mouse.x
				const dy = spring.y.get() - mouse.y
				const distance = Math.sqrt(dx * dx + dy * dy)
				const scale = spring.scale.get()

				let fx = 0,
					fy = 0
				if (distance < forceFieldRadius) {
					const forceDirection = blackholeEffect ? -1 : 1
					const force =
						((forceFieldRadius - distance) / forceFieldRadius) *
						FORCE_MULTIPLIER *
						forceDirection
					fx = force * (dx / distance)
					fy = force * (dy / distance)
				}

				fx = Math.min(maxVelocity, Math.max(-maxVelocity, fx))
				fy = Math.min(maxVelocity, Math.max(-maxVelocity, fy))

				let newX = spring.x.get() + fx
				let newY = spring.y.get() + fy

				if (imageJitter) {
					const now = Date.now()
					const jitterTime = jitterTimes.current.get(i) ?? 0

					if (now >= jitterTime) {
						const randomX = getRandom(-jitterForce, jitterForce)
						const randomY = getRandom(-jitterForce, jitterForce)
						newX += randomX
						newY += randomY

						jitterTimes.current.set(i, now + jitterInterval)
					}
				}

				if (newX < 0) newX = 0
				if (newX > window.innerWidth - imageWidth * scale)
					newX = window.innerWidth - imageWidth * scale
				if (newY < 0) newY = 0
				if (newY > window.innerHeight - imageHeight * scale)
					newY = window.innerHeight - imageHeight * scale

				if (collisions) {
					for (let j = 0; j < springs.length; j++) {
						if (i !== j) {
							const other = springs[j]
							const otherX = other.x.get()
							const otherY = other.y.get()
							const otherScale = other.scale.get()

							const distance = Math.sqrt(
								(otherX - newX) ** 2 + (otherY - newY) ** 2
							)

							const minDistance =
								Math.sqrt(
									(imageWidth * scale) ** 2 +
										(imageHeight * scale) ** 2
								) /
									2 +
								Math.sqrt(
									(imageWidth * otherScale) ** 2 +
										(imageHeight * otherScale) ** 2
								) /
									2

							if (distance < minDistance) {
								const overlap = minDistance - distance
								const angle = Math.atan2(
									newY - otherY,
									newX - otherX
								)
								newX += Math.cos(angle) * overlap
								newY += Math.sin(angle) * overlap
							}
						}
					}
				}

				return {
					x: newX,
					y: newY,
				}
			})

			animationFrameId = requestAnimationFrame(animate)
		}

		animate()

		return () => {
			if (animationFrameId !== undefined) {
				cancelAnimationFrame(animationFrameId)
			}
		}
	}, [
		mouse,
		api,
		springs,
		forceFieldRadius,
		FORCE_MULTIPLIER,
		maxVelocity,
		blackholeEffect,
		collisions,
		imageHeight,
		imageWidth,
		imageJitter,
		jitterInterval,
		jitterForce,
	])

	return (
		<div
			ref={containerRef}
			style={{
				position: 'relative',
				width: '100%',
				height: '100vh',
				overflow: 'hidden',
			}}
		>
			{springs.map((props, i) => (
				<animated.div
					key={i}
					style={{
						position: 'absolute',
						willChange: 'transform',
						transform: to(
							[props.x, props.y, props.scale, props.rotate],
							(x, y, scale, rotate) =>
								`translate3d(${x}px,${y}px,0) scale(${scale}) rotate(${rotate}deg)`
						),
						width: imageWidth,
						height: imageHeight,
						backgroundImage: `url(${src})`,
						backgroundSize: 'cover',
					}}
				/>
			))}
			{children}
		</div>
	)
}

export default ImageFloat
