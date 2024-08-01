# FloatImages Component

A React component that displays floating images with interactive effects using `@react-spring/web`. The images can interact with the cursor, simulate a force field, apply a blackhole effect, and include optional collision detection and random jitter movements.

## Installation
```sh
npm install @react-spring/web lodash
```
## Usage
```ts
import React from 'react'
import FloatImages from './FloatImages'

const App = () => {
  return (
    <div>
      <FloatImages 
        src="path/to/your/image.png" 
        numImages={100} 
        forceFieldRadius={150} 
        friction={20} 
        mass={1.5} 
        maxVelocity={150} 
        sizeMultiplier={1.2} 
        forceMultiplier={15} 
        blackholeEffect={true} 
        collisions={true} 
        imageJitter={true} 
        jitterInterval={1000} 
        jitterForce={10} 
      >
        <YourContentHere />
      </FloatImages>
    </div>
  )
}

export default App
```
## Props

### `src`
- **Type:** `string`
- **Description:** Source URL of the image.

### `children`
- **Type:** `ReactNode`
- **Optional:** Yes
- **Description:** Optional React nodes to be rendered inside the component.

### `numImages`
- **Type:** `number`
- **Optional:** Yes
- **Default:** `50`
- **Description:** Number of images to be displayed.

### `forceFieldRadius`
- **Type:** `number`
- **Optional:** Yes
- **Default:** `100`
- **Description:** Radius for the force field effect.

### `friction`
- **Type:** `number`
- **Optional:** Yes
- **Default:** `15`
- **Description:** Friction value to be applied to the images.

### `mass`
- **Type:** `number`
- **Optional:** Yes
- **Default:** `1`
- **Description:** Mass value to be applied to the images.

### `maxVelocity`
- **Type:** `number`
- **Optional:** Yes
- **Default:** `100`
- **Description:** Image max velocity.

### `sizeMultiplier`
- **Type:** `number`
- **Optional:** Yes
- **Description:** Image size multiplier.

### `forceMultiplier`
- **Type:** `number`
- **Optional:** Yes
- **Default:** `13.66`
- **Description:** Cursor force multiplier.

### `cursorInteract`
- **Type:** `boolean`
- **Optional:** Yes
- **Default:** `true`
- **Description:** Toggle cursor interaction.

### `blackholeEffect`
- **Type:** `boolean`
- **Optional:** Yes
- **Default:** `false`
- **Description:** Toggle blackhole effect.

### `collisions`
- **Type:** `boolean`
- **Optional:** Yes
- **Default:** `true`
- **Description:** Toggle collision detection between images.

### `imageJitter`
- **Type:** `boolean`
- **Optional:** Yes
- **Default:** `false`
- **Description:** Toggle random movement of images.

### `jitterInterval`
- **Type:** `number`
- **Optional:** Yes
- **Default:** `1000`
- **Description:** Interval in milliseconds for random movement.

### `jitterForce`
- **Type:** `number`
- **Optional:** Yes
- **Default:** `10`
- **Description:** Force value for random movement.
