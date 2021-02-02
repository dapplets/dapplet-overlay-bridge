# Dapplet-Overlay Bridge
TypeScript library for two-way communication between a dapplet and an overlay.

## Getting Started

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