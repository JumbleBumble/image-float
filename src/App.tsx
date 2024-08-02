import ImageFloat from './ImageFloat'
import ImageFloatControls from './ImageFloatControls'

function App() {
	return (
		<div className="bg-black w-screen h-screen">
			<ImageFloat src="https://via.placeholder.com/50">
				<ImageFloatControls />
			</ImageFloat>
		</div>
	)
}

export default App
