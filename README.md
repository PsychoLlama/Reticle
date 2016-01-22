# Reticle
Put a scope on gunDB.

## What it is
> Reticle is a tool built for [gunDB](https://github.com/amark/gun)

By default, gun's data is global. If you use the same key by accident on a different app, both datasets will merge into one frankensteinian nightmare. Reticle solves this by namespacing your keys under a hashed string, preventing otherwise gruesome conflicts from ever happening.

## How it works
You can scope your databases under a name, like `Todo List`, and Reticle will produce a hashed string (`'7b3ozc'`) and automatically upgrade your context to use that new namespace.

> Scope names are case sensitive

Reticle exposes two methods through Gun...

 - one on the constructor: `Gun.scope`
 - one on each instance: `gun.scope`

To set a scope for every gun instance you create, use the constructor method.
```javascript
Gun.scope('Todo List')

// both are scoped under "Todo List"
var list = Gun().get('list')
var items = Gun().get('list/items')
```

To scope just one instance, use the instance method.
```javascript
var gun = Gun().scope('Todo List').get('list/items');
```
Once the scope has been set, it will remain the same until changed again.

## Examples
Using two instances without collision
```javascript
var fleetPlayers, tracePlayers;
fleetPlayers = Gun().scope('battlefleet').get('players')
tracePlayers = Gun().scope('trace').get('players')

fleetPlayers.put({
  'Player 0': 'Bob'
})
tracePlayers.put({
  'Player 0': 'Dave'
})
fleetPlayers.path('Player 0').val() // "Bob"
tracePlayers.path('Player 0').val() // "Dave"
```

## Edge cases
Reticle will try to convert input to a string so it can hash it. If the value it's given is a isn't a string, Reticle will try to convert it. If the value is falsy, gun will revert to it's global behavior. For example, if you call `.scope` with `null` or empty string `""`, **your namespace is global**. There is no prefix.

## Support
If you find any problems or know of a way to improve Reticle (or gun for that matter), send us a message on [Gitter](http://gitter.im/amark/gun). We keep an eye on the channel.

## Contributing
Contributing is always welcome.
If you want to add a feature or fix a bug, there are npm scripts that make development easier. It will help if you compile while coding so you can try it out in the browser. The build process will automatically run every time you change the source once you kick off the process; just type this in the terminal:
```bash
$ npm run build
```

You can check that the functionality doesn't break by testing frequently by running:
```bash
$ npm test
```

If you have any problems or questions, feel free to let us know in the [Gitter channel](http://gitter.im/amark/gun).

<!--

### Contributors
 - your name here

-->