import React from 'react'
import { useImageFloatContext } from './ImageFloat'

const ImageFloatControls: React.FC = () => {
	const {
		numImages,
		setNumImages,
		imageJitter,
		setImageJitter,
		jitterInterval,
		setJitterInterval,
		jitterForce,
		setJitterForce,
		cursorInteract,
		setCursorInteract,
		forceMultiplier,
		setForceMultiplier,
		blackholeEffect,
		setBlackholeEffect,
	} = useImageFloatContext()

	const toggleJitter = () => setImageJitter(!imageJitter)
	const toggleCursorInteract = () => setCursorInteract(!cursorInteract)
	const toggleBlackholeEffect = () => setBlackholeEffect(!blackholeEffect)

	return (
		<div className="absolute bottom-5 left-5 text-white space-y-3">
			<p className="text-lg">Number of Images: {numImages}</p>
			<div className="flex items-center space-x-2">
				<button
					className="px-3 py-1 bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
					onClick={() => setNumImages(numImages + 1)}
				>
					Add Image
				</button>
				<button
					className="px-3 py-1 bg-green-500 rounded-md hover:bg-green-600 transition-colors"
					onClick={toggleJitter}
				>
					{imageJitter ? 'Disable' : 'Enable'} Jitter
				</button>
				<button
					className="px-3 py-1 bg-purple-500 rounded-md hover:bg-purple-600 transition-colors"
					onClick={toggleCursorInteract}
				>
					{cursorInteract ? 'Disable' : 'Enable'} Cursor Interaction
				</button>
				<button
					className="px-3 py-1 bg-red-500 rounded-md hover:bg-red-600 transition-colors"
					onClick={toggleBlackholeEffect}
				>
					{blackholeEffect ? 'Black Hole' : 'Force Field'}
				</button>
			</div>
			<div className="flex flex-col space-y-1">
				<label className="text-sm">
					Jitter Interval: {jitterInterval}
				</label>
				<input
					className="w-full"
					type="range"
					min="0"
					max="1000"
					value={jitterInterval}
					onChange={(e) => setJitterInterval(Number(e.target.value))}
				/>
			</div>
			<div className="flex flex-col space-y-1">
				<label className="text-sm">Jitter Force: {jitterForce}</label>
				<input
					className="w-full"
					type="range"
					min="0"
					max="1000"
					value={jitterForce}
					onChange={(e) => setJitterForce(Number(e.target.value))}
				/>
			</div>
			<div className="flex flex-col space-y-1">
				<label className="text-sm">
					Force Multiplier: {forceMultiplier}
				</label>
				<input
					className="w-full"
					type="range"
					min="0"
					max="1000"
					value={forceMultiplier}
					onChange={(e) =>
						setForceMultiplier(Number(e.target.value))
					}
				/>
			</div>
		</div>
	)
}

export default ImageFloatControls
