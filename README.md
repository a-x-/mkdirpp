# mkdirp

Like `mkdir -p`, but in node.js!

# installation

`npm i -S mkdirpp`

# example

```js
var mkdirp = require('mkdirp');
    
mkdirpp('/tmp/foo/bar/baz')
    .then(() => console.log('pow!'))
    .catch(err => console.error(err));
```

Output

```
pow!
```

And now `/tmp/foo/bar/baz` exists!

# methods

```js
var mkdirp = require('mkdirpp');
```

## mkdirp(dir, opts) -> Promise

Create a new directory and any necessary subdirectories at `dir` with octal
permission string `opts.mode`. If `opts` is a non-object, it will be treated as
the `opts.mode`.

If `opts.mode` isn't specified, it defaults to `0777 & (~process.umask())`.

You can optionally pass in an alternate `fs` implementation by passing in
`opts.fs`. Your implementation should have `opts.fs.mkdir(path, mode, cb)` and
`opts.fs.stat(path, cb)`.

# license

MIT

# credits

Based on https://github.com/substack/node-mkdirp
