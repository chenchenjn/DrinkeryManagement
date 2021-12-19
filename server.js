const express = require('express')//express框架
const fs = require('fs')

// const axios = require('axios');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/menu');//连接menu数据库
const db = mongoose.connection;

const tableSchema = new mongoose.Schema({//tables数据表
  id: Number,
  tableName: String,
  status: Number,
  reserveTime: String
});

const Table = mongoose.model('Table', tableSchema);

const MenuSchema = new mongoose.Schema({//menus数据表
  id: Number,
  foodName: String,
  price: Number,
  vipPrice: Number
});

const Menu = mongoose.model('Menu', MenuSchema);

const app = express()//express框架

app.use('/detail/', express.static('./detail/'))//express框架。express 会在静态资源目录detail下查找文件

app.get('/', (req, res) => {//Express框架。 HTTP请求中的请求消息(req)和响应消息(res)
  fs.readFile('./login.html', (err, data) => {
    res.send(data.toString())
  })
})

const UsersSchema = new mongoose.Schema({//users数据表
  id: Number,
  email: String,
  password: String,
});

const Users = mongoose.model('users', UsersSchema);

app.get('/login', (req, res) => {
  const { email, password } = req.query;
  Users.find({ email, password }, (err, data) => {
    console.log(email, password, data);
    if (data.length === 0) {//去menu库中users表中找，没找到就是(data.length === 0)
      res.send({ message: '登录失败' })
    } else {
      res.send({ message: '登录成功' })
    }
  })
})

app.get('/console', function (req, res) {//Express框架。请求。url后加/console可以直接跳转到index.html主界面
  fs.readFile('./index.html', (err, data) => {
    res.send(data.toString())
  })
})

app.get('/tables', (req, res) => {
  Table.find({}, (err, data) => {
    // console.log(data);
    res.send(data)
  })
  // res.send('fsaf')
})

app.delete('/tables', (req, res) => {
  const { id } = req.query;
  // console.log(id);
  Table.deleteOne({ id: parseInt(id) }, err => {//注意类型转换，如这里转换成整形
    if (err) {
      res.send({
        'message': '删除失败'
      })
    }
    res.send({
      'message': '删除成功'
    })
  })
  
})
  
app.post('/add_tables', (req, res) => {
  Table.find({}, (err, data) => {
    const ids = data.map(d => d['id'])
    const maxId = Math.max(...ids)//添加桌号时，在已存在的所有桌id中找最大值，加1成为新增id
    const dataByAdd = data.length === 0 ? [
      { id: 0, tableName: '0号桌', status: 0, reserveTime: '' },
    ] : [
      { id: maxId + 1, tableName: (maxId + 1) + '号桌', status: 0, reserveTime: '' },
    ]
    Table.insertMany(dataByAdd, (err, data) => {
      // console.log(data);
      res.send({ message: '添加成功' })
    })
  })
})

app.post('/tables', (req, res) => {
  let status = parseInt(req.query.status)
  let id = parseInt(req.query.id)

  // console.log(status, id);
  if (status === 1) { // 退桌
    Table.update({ id }, { $set: {status: 0, reserveTime: ''} }, (err, data) => {
      res.send({'message': '退桌成功'})
    })
  } else {
    const date = new Date()
    const reserveTime = date.toString().split(' ').slice(1, 5).join('-')//取当前时间的某一段，并加入分隔符-
    // console.log(reserveTime);
    Table.update({ id }, { $set: { status: 1, reserveTime } }, (err, data) => {
      res.send({'message': '预约成功'})
    })
  }
  // res.send({})
})


app.get('/menus', (req, res) => {
  Menu.find({}, (err, data) => {
    // console.log(data);
    res.send(data)
  })
  // res.send('fsaf')
})

app.delete('/menus', (req, res) => {
  const { id } = req.query;
  // console.log(id);
  Menu.deleteOne({ id: parseInt(id) }, err => {
    if (err) {
      res.send({
        'message': '删除失败'
      })
    }
    res.send({
      'message': '删除成功'
    })
  })
  
})

app.post('/add_menus', (req, res) => {
  const { foodName, price, vipPrice } = req.query;
  Menu.find({}, (err, data) => {
    const ids = data.map(d => d['id'])
    const maxId = Math.max(...ids)//添加菜品时，在已存在的所有菜id中找最大值，加1成为新增id
    const dataByAdd = data.length === 0 ? [
      { id: 0, foodName, price: parseFloat(price), vipPrice: parseFloat(vipPrice) },
    ] : [
      { id: maxId + 1, foodName, price: parseFloat(price), vipPrice: parseFloat(vipPrice) },
    ]
    Menu.insertMany(dataByAdd, (err, data) => {
      // console.log(data);
      res.send({ message: '添加成功' })
    })
  })
})

const ordersSchema = new mongoose.Schema({//orders数据表
  id: Number,
  tableName: String,
  orderTime: String,
  price: Number,
  isPay: Boolean
});

const orders = mongoose.model('order', ordersSchema);

app.get('/orders', (req, res) => {
  orders.find({}, (err, data) => {
    // console.log(data);
    res.send(data)
  })
  // res.send('fsaf')
})

app.delete('/orders', (req, res) => {
  const { id } = req.query;
  // console.log(id);
  orders.deleteOne({ id: parseInt(id) }, err => {
    if (err) {
      res.send({
        'message': '删除失败'
      })
    }
    res.send({
      'message': '删除成功'
    })
  })
  
})
app.post('/add_orders', (req, res) => {
  const { tableName, price } = req.query;
  orders.find({}, (err, data) => {
    const ids = data.map(d => d['id'])
    const maxId = Math.max(...ids)
    const date = new Date()
    const orderTime = date.toString().split(' ').slice(1, 5).join('-')
    const dataByAdd = data.length === 0 ? [
      { id: 0, tableName, price: parseFloat(price), isPay: false, orderTime },
    ] : [
      { id: maxId + 1, tableName, price: parseFloat(price), isPay: false, orderTime },
    ]
    orders.insertMany(dataByAdd, (err, data) => {
      // console.log(data);
      res.send({ message: '添加成功' })
    })
  })
})

app.post('/orders', (req, res) => {
  let id = parseInt(req.query.id)
  orders.update({ id }, { $set: { isPay: true } }, (err, data) => {
    res.send({'message': '结账成功'})
  })
})
app.listen(3000, () => {
  console.log("http://localhost:3000");
})