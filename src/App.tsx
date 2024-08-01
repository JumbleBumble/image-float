import ImageFloat from './ImageFloat'

function App() {
	return (
		<div className="bg-black">
			<ImageFloat
				blackholeEffect={true}
				forceMultiplier={40}
				src="https://via.placeholder.com/50"
			>
				<div>Your content here</div>
			</ImageFloat>
		</div>
	)
}

export default App
