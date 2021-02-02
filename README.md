# Dapplet-Overlay Bridge
TypeScript library for two-way communication between a dapplet and an overlay.

## Installation

Use the package manager npm or yarn to install the library.

```
npm i @dapplets/dapplet-overlay-bridge
```

You can import the library as [ECMAScript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

```html
<script type="module">
    import Bridge from 'https://unpkg.com/@dapplets/dapplet-overlay-bridge';
</script>
```

## Usage

You can try simple example written in one HTML file by this path: [`examples/pure-html-page/index.html`](https://github.com/dapplets/dapplet-overlay-bridge/blob/master/examples/pure-html-page/index.html).

```javascript
// Dapplet side
const overlay = Core.overlay({ url: 'http://localhost:5000', title: 'Overlay' });
overlay.sendAndListen('data', 'Hello, World!', {});

// Overlay side
import Bridge from '@dapplets/dapplet-overlay-bridge';

class MyBridge extends Bridge {
    _subId = 0;

    onData(callback) {
        this.subscribe('data', (data) => {
            callback(data);
            return (++this._subId).toString();
        });
    }
}

const bridge = new MyBridge();

bridge.onData((data) => alert(data)); // Hello, World!
```
