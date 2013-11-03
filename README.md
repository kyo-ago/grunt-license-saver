grunt-save-license
========

> Make licenses.json

## Getting Started

```shell
npm install grunt-save-license --save-dev
```

```js
grunt.loadNpmTasks('grunt-save-license');
```

## Save-license task

### Usage Examples

#### Make to licenses.json
```js
save_license: {
  dist: {
    src: ['*.js'],
    dest: 'licenses.json'
  }
}
```

---

License
========

MIT License.