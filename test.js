const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/menu');
const db = mongoose.connection;


const ordersSchema = new mongoose.Schema({
  id: Number,
  tableName: String,
  orderTime: String,
  price: Number,
  isPay: Boolean
});

const orders = mongoose.model('order', ordersSchema);

const data = []
for (let i = 0; i < 20; i ++) {
  const price = Math.floor(Math.random() * 1000 + 200);
  const date = new Date()
  const orderTime = date.toString().split(' ').slice(1, 5).join('-')
  data.push({
    id: i,
    tableName: i + "号桌",
    orderTime,
    price,
    isPay: false
  })
}

orders.insertMany(data)

// Table.find({}, (err, data) => {
//   console.log(data);
//   // res.send(data)

// })