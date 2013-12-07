# grunt-license-server

> Store the license of the library you are using.

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-license-server --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-license-server');
```

## Save-license task

_Run this task with the `grunt save_license` command._

### Usage Examples

#### Make to licenses.json
```js
save_license: {
  dist: {
    src: ['**/*.js'],
    dest: 'licenses.json'
  }
}
```

---

License
========

MIT License.