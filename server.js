const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2000
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'time-tracker'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    const arrayData = await db.collection('time-track').find().toArray()
    // const timeWindow = await db.collection('time-track').find( { time: { $exists: true } })
    // console.log(timeWindow)
    // const itemsLeft = await db.collection('time-track').countDocuments({completed: false})
    response.render('index.ejs', { tasks: arrayData })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    console.log(request.body)
    db.collection('time-track').insertOne({thing: request.body.todoTime, time: request.body.timeWindow})

    .then(result => {
        console.log('Task Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// { "fullName" : "john smith",
//   "company" : "xyz",
//   "email" : "john.smith@xyz.com",
//   "timeSaved" : 50 
//   "moneySaved" : 10 
// }

// UserModel.update(
//     SomeFindCriteria,
//    { $inc: { timeSaved: newTimeSaved, moneySaved: newMoneySaved } }
// )

app.put('/addTime', (request, response) => {
    // console.log(request.body)
    db.collection('time-track').updateOne({ $inc: {time: request.body.timeFromJS} })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

// app.put('/markUnComplete', (request, response) => {
//     db.collection('todos').updateOne({thing: request.body.itemFromJS},{
//         $set: {
//             completed: false
//           }
//     },{
//         sort: {_id: -1},
//         upsert: false
//     })
//     .then(result => {
//         console.log('Marked Complete')
//         response.json('Marked Complete')
//     })
//     .catch(error => console.error(error))

// })

app.delete('/deleteItem', (request, response) => {
    console.log(request.body)
    db.collection('time-track').deleteOne({thing: request.body.itemFromJS, time: request.body.timeFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})