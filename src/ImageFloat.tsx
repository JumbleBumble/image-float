import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useRef,
	ReactNode,
} from 'react'
import { useSprings, animated, to } from '@react-spring/web'
import { throttle } from 'lodash'

const getRandom = (min: number, max: number) =>
	Math.random() * (max - min) + min

interface ImageFloatContextProps {
	numImages: number
	forceFieldRadius: number
	friction: number
	mass: number
	maxVelocity: number
	sizeMultiplier: number
	imageWidth: number
	imageHeight: number
	forceMultiplier: number
	cursorInteract: boolean
	blackholeEffect: boolean
	collisions: boolean
	imageJitter: boolean
	jitterInterval: number
	jitterForce: number
	setNumImages: (value: number) => void
	setForceFieldRadius: (value: number) => void
	setFriction: (value: number) => void
	setMass: (value: number) => void
	setMaxVelocity: (value: number) => void
	setSizeMultiplier: (value: number) => void
	setImageWidth: (value: number) => void
	setImageHeight: (value: number) => void
	setForceMultiplier: (value: number) => void
	setCursorInteract: (value: boolean) => void
	setBlackholeEffect: (value: boolean) => void
	setCollisions: (value: boolean) => void
	setImageJitter: (value: boolean) => void
	setJitterInterval: (value: number) => void
	setJitterForce: (value: number) => void
}

const defaultContext: ImageFloatContextProps = {
	numImages: 50,
	forceFieldRadius: 100,
	friction: 15,
	mass: 1,
	maxVelocity: 100,
	sizeMultiplier: 1,
	imageWidth: 50,
	imageHeight: 50,
	forceMultiplier: 13.66,
	cursorInteract: true,
	blackholeEffect: false,
	collisions: true,
	imageJitter: false,
	jitterInterval: 1000,
	jitterForce: 10,
	setNumImages: () => {},
	setForceFieldRadius: () => {},
	setFriction: () => {},
	setMass: () => {},
	setMaxVelocity: () => {},
	setSizeMultiplier: () => {},
	setImageWidth: () => {},
	setImageHeight: () => {},
	setForceMultiplier: () => {},
	setCursorInteract: () => {},
	setBlackholeEffect: () => {},
	setCollisions: () => {},
	setImageJitter: () => {},
	setJitterInterval: () => {},
	setJitterForce: () => {},
}

export const ImageFloatContext =
	createContext<ImageFloatContextProps>(defaultContext)

export const useImageFloatContext = () => {
	const context = useContext(ImageFloatContext)
	if (!context) {
		throw new Error(
			'useImageFloatContext must be used within an ImageFloatProvider'
		)
	}
	return context
}

interface ImageFloatProps {
	src: string
	children?: ReactNode
}

const ImageFloat: React.FC<ImageFloatProps> = ({ src, children }) => {
	const [numImages, setNumImages] = useState(defaultContext.numImages)
	const [forceFieldRadius, setForceFieldRadius] = useState(
		defaultContext.forceFieldRadius
	)
	const [friction, setFriction] = useState(defaultContext.friction)
	const [mass, setMass] = useState(defaultContext.mass)
	const [maxVelocity, setMaxVelocity] = useState(defaultContext.maxVelocity)
	const [sizeMultiplier, setSizeMultiplier] = useState(
		defaultContext.sizeMultiplier
	)
	const [imageWidth, setImageWidth] = useState(defaultContext.imageWidth)
	const [imageHeight, setImageHeight] = useState(defaultContext.imageHeight)
	const [forceMultiplier, setForceMultiplier] = useState(
		defaultContext.forceMultiplier
	)
	const [cursorInteract, setCursorInteract] = useState(
		defaultContext.cursorInteract
	)
	const [blackholeEffect, setBlackholeEffect] = useState(
		defaultContext.blackholeEffect
	)
	const [collisions, setCollisions] = useState(defaultContext.collisions)
	const [imageJitter, setImageJitter] = useState(defaultContext.imageJitter)
	const [jitterInterval, setJitterInterval] = useState(
		defaultContext.jitterInterval
	)
	const [jitterForce, setJitterForce] = useState(defaultContext.jitterForce)
	const containerRef = useRef<HTMLDivElement>(null)

	const [mouse, setMouse] = useState({ x: 0, y: 0 })
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [springs, api] = useSprings(numImages, (_index: number) => ({
		from: {
			x: getRandom(0, window.innerWidth),
			y: getRandom(0, window.innerHeight),
			scale: getRandom(0.5, 1) * sizeMultiplier,
			rotate: getRandom(0, 360),
		},
		config: {
			mass: Math.max(mass, 1),
			tension: 170,
			friction: Math.max(friction, 15),
		},
	}))

	const jitterTimes = useRef<Map<number, number>>(new Map())

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
				if (containerRef.current == null) {
					return
				}
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
						forceMultiplier *
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
				if (
					newX >
					containerRef.current.clientWidth - imageWidth * scale
				)
					newX =
						containerRef.current.clientWidth - imageWidth * scale
				if (newY < 0) newY = 0
				if (
					newY >
					containerRef.current.clientHeight - imageHeight * scale
				)
					newY =
						containerRef.current.clientHeight - imageHeight * scale

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
		forceMultiplier,
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
		<ImageFloatContext.Provider
			value={{
				numImages,
				setNumImages,
				forceFieldRadius,
				setForceFieldRadius,
				friction,
				setFriction,
				mass,
				setMass,
				maxVelocity,
				setMaxVelocity,
				sizeMultiplier,
				setSizeMultiplier,
				imageWidth,
				setImageWidth,
				imageHeight,
				setImageHeight,
				forceMultiplier,
				setForceMultiplier,
				cursorInteract,
				setCursorInteract,
				blackholeEffect,
				setBlackholeEffect,
				collisions,
				setCollisions,
				imageJitter,
				setImageJitter,
				jitterInterval,
				setJitterInterval,
				jitterForce,
				setJitterForce,
			}}
		>
			<div
				ref={containerRef}
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
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
		</ImageFloatContext.Provider>
	)
}

export default ImageFloat
