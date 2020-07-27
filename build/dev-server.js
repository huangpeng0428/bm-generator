require('./check-versions')()
var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var express = require('express')
var webpack = require('webpack')
var bodyParser = require('body-parser')
var fs = require('fs')
var path = require('path')
var opn = require('opn')
var beautify = require('js-beautify').js_beautify
var beautifyConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.jsbeautifyrc')))
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)
var Mock = require('mockjs')

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// var hotMiddleware = require('webpack-hot-middleware')(compiler, {
//   log: () => {}
// })
// // force page reload when html-webpack-plugin template changes
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// proxy api requests
// var proxyTable = config.dev.proxyTable
// Object.keys(proxyTable).forEach(function(context) {
//   var options = proxyTable[context]
//   if (typeof options === 'string') {
//     options = { target: options }
//   }
//   app.use(proxyMiddleware(context, options))
// })

// handle fallback for HTML5 history API
// app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
// app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))
// 使用get方式获取数据
app.use('/pages', express.static('./pages'))
app.use('/output', express.static('./output'))

app.get('/meta/info', function(req, res) {
  if (req.query.code) {
    var filePath = './pages/' + req.query.code + '.js'
    if (fs.existsSync(filePath)) {
      var content = fs.readFileSync(filePath, { encoding: 'utf8' })
      res.json({
        code: 200,
        value: content,
      })
    } else {
      res.json({
        code: 200,
        value: null,
      })
    }
    var content = fs.readFileSync
  } else {
    res.json({
      code: 110000,
      message: '必须要提供code',
    })
  }
})

app.get('/meta/list', function(req, res) {
  var dirs = fs.readdirSync('./pages')
  var value = []
  var i = 0
  dirs.forEach(function(dir) {
    var ext = path.extname(dir)
    var code = path.basename(dir, ext)
    if (ext == '.js') {
      value.push({
        type: 0,
        id: ++i,
        code: code,
      })
    }
  })
  res.json({
    code: 200,
    value: {
      value: value,
      total: value.length,
    }
  })
})

app.post('/meta/save', function(req, res) {
  if (req.body.code) {
    
    fs.writeFileSync('./pages/' + req.body.code + '.js', beautify(req.body.value, beautifyConfig))
    res.json({
      code: 200,
      value: null,
    })
  } else {
    res.json({
      code: 110000,
      message: '必须要提供code',
    })
  }
})


// 删除，则移动文件到本地/pages-bak/备份
app.post('/meta/delete', function(req, res) {
  if (req.body.code) {
    var date = new Date();
    fs.rename('./pages/' + req.body.code + '.js',
      './pages-bak/' + req.body.code + '-' + (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()) + '.js.bak',
      function(err) {
        if (err) throw err
        res.json({
          code: 200,
          message: '',
        })
      }
    )
  }
})

// 开发阶段用于调试接口，规则： /api/data 则调用 /mocks/api_data.js 里的mocks数据
app.get('/mocks/*', function(req, res) {
  var requestUrl = req.params[0];
  var filePath = path.resolve('./mocks/' + requestUrl.replace(/\//g,'_') + '.js')
  console.log(filePath,fs.existsSync(filePath))
  if (fs.existsSync(filePath)) {
    var data = require(filePath)
    data = Mock.mock(data)
    res.json({
      code: 200,
      message: '',
      value: {
        data: data.data,
        total: data.data.length,
      },
    })
  } else {
    res.json({
      code: 200,
      value: {
        data: [],
        total: 0,
      },
      messsage: 'no file',
    })
  }
});

var uri = 'http://localhost:' + port

console.log(uri);

devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n')
})

// module.exports = app.listen(port, function (err) {
//   if (err) {
//     console.log(err)
//     return
//   }

//   // when env is testing, don't need open it
//   if (process.env.NODE_ENV !== 'testing') {
//     // opn(uri)
//   }
// })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(devMiddleware);

var staticPath = path.posix.join(
  config.dev.assetsPublicPath,
  config.dev.assetsSubDirectory
);
app.use(staticPath, express.static("./static"));

// 使用get方式获取数据
app.use('/pages', express.static('./pages'))
app.use('/output', express.static('./output'))

app.get("/meta/info", function(req, res) {
  if (req.query.code) {
    var filePath = "./pages/" + req.query.code + ".js";
    if (fs.existsSync(filePath)) {
      var content = fs.readFileSync(filePath, { encoding: "utf8" });
      res.json({
        code: 200,
        value: content
      });
    } else {
      res.json({
        code: 200,
        value: null
      });
    }
    var content = fs.readFileSync;
  } else {
    res.json({
      code: 110000,
      message: "必须要提供code"
    });
  }
});

app.get("/meta/list", function(req, res) {
  var dirs = fs.readdirSync("./pages");
  var value = [];
  var i = 0;
  dirs.forEach(function(dir) {
    var ext = path.extname(dir);
    var code = path.basename(dir, ext);
    if (ext == ".js") {
      value.push({
        type: 0,
        id: ++i,
        code: code
      });
    }
  });
  res.json({
    code: 200,
    value: {
      value: value,
      total: value.length
    }
  });
});

app.post("/meta/save", function(req, res) {
  if (req.body.code) {
    fs.writeFileSync(
      "./pages/" + req.body.code + ".js",
      beautify(req.body.value, beautifyConfig)
    );
    res.json({
      code: 200,
      value: null
    });
  } else {
    res.json({
      code: 110000,
      message: "必须要提供code"
    });
  }
});

// 删除，则移动文件到本地/pages-bak/备份
app.post('/meta/delete', function(req, res) {
  if (req.body.code) {
    var date = new Date();
    fs.rename('./pages/' + req.body.code + '.js',
      './pages-bak/' + req.body.code + '-' + (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()) + '.js.bak',
      function(err) {
        if (err) throw err
        res.json({
          code: 200,
          message: '',
        })
      }
    )
  }
})


// 开发阶段用于调试接口，规则： /api/data 则调用 /mocks/api_data.js 里的mocks数据
app.get('/mocks/*', function(req, res) {
  var requestUrl = req.params[0];
  var filePath = path.resolve('./mocks/' + requestUrl.replace(/\//g,'_') + '.js')
  console.log(filePath,fs.existsSync(filePath))
  if (fs.existsSync(filePath)) {
    var data = require(filePath)
    data = Mock.mock(data)
    res.json({
      code: 200,
      message: '',
      value: {
        data: data.data,
        total: data.data.length,
      },
    })
  } else {
    res.json({
      code: 200,
      value: {
        data: [],
        total: 0,
      },
      messsage: 'no file',
    })
  }
});

var uri = "http://localhost:" + port;

devMiddleware.waitUntilValid(function() {
  console.log("> Listening at " + uri + "\n");
});

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== "testing") {
    // opn(uri)
  }
});
